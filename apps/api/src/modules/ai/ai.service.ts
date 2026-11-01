import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { verifiedPortfolioData } from './portfolio-knowledge';

const VERIFIED_SYSTEM_INSTRUCTION = `
You are the portfolio assistant for Sidhartha.
Strict Operational Boundaries:
1. Ground every answer strictly in the provided verified portfolio context.
2. If asked about technologies, projects, or work history not explicitly verified, reply:
   "I do not have verified record of that in Sidhartha's portfolio. Please refer to the Projects or Experience sections."
3. Do not invent metrics, client names, or claims under any circumstances.
4. Keep answers concise, technical, and professional.
Context:
${JSON.stringify(verifiedPortfolioData)}
`.trim();

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private client: GoogleGenAI | null = null;
  private readonly modelId = 'gemini-3.8-flash';

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const key = this.config.get<string>('GEMINI_API_KEY');
    if (!key || key.trim() === '') {
      this.logger.warn('GEMINI_API_KEY absent. Offline knowledge-base fallback active.');
    } else {
      this.client = new GoogleGenAI({ apiKey: key });
      this.logger.log(`Initialized Gemini Assistant with model: ${this.modelId}`);
    }
  }

  async ask(prompt: string): Promise<{ text: string; source: 'gemini' | 'local_fallback' }> {
    const cleanPrompt = prompt.trim().slice(0, 500);
    if (!cleanPrompt) {
      return { text: 'Please provide a valid question.', source: 'local_fallback' };
    }

    if (!this.client) {
      return { text: this.queryLocalFallback(cleanPrompt), source: 'local_fallback' };
    }

    try {
      const response = await this.client.models.generateContent({
        model: this.modelId,
        contents: [
          {
            role: 'user',
            parts: [{ text: `${VERIFIED_SYSTEM_INSTRUCTION}\n\nUser Question: ${cleanPrompt}` }],
          },
        ],
      });

      if (!response || !response.text) {
        throw new Error('Malformed AI response');
      }

      return { text: response.text.trim(), source: 'gemini' };
    } catch (err: any) {
      this.logger.warn(`Gemini API dispatch failed (${err?.message || err}). Serving local fallback.`);
      return { text: this.queryLocalFallback(cleanPrompt), source: 'local_fallback' };
    }
  }

  queryLocalFallback(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('skill') || q.includes('stack')) {
      return `Sidhartha's verified stack: ${verifiedPortfolioData.skills.join(', ')}.`;
    }
    if (q.includes('project')) {
      return `Key projects include: ${verifiedPortfolioData.projects.map((p) => p.name).join(', ')}. See Projects section for live demos.`;
    }
    if (q.includes('contact') || q.includes('hire')) {
      return 'You can reach Sidhartha via the Contact form or his verified LinkedIn profile.';
    }
    return "I am operating in offline mode. Please explore the portfolio sections directly to learn more about Sidhartha's work.";
  }
}

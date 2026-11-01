import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { verifiedPortfolioData, PortfolioProject } from './portfolio-knowledge';
import { PrismaService } from '../../prisma/prisma.service';

const VERIFIED_SYSTEM_INSTRUCTION = `
You are the interactive AI Portfolio Assistant for Sidhartha.
Strict Operational Boundaries:
1. Ground every answer strictly in the provided verified portfolio context.
2. If asked about technologies, projects, or work history not explicitly verified, reply:
   "I do not have verified record of that in Sidhartha's portfolio. Please refer to the Projects or Skills sections."
3. Do not invent metrics, client names, statistics, or claims under any circumstances.
4. Keep answers concise, technical, and professional.
Context:
${JSON.stringify(verifiedPortfolioData)}
`.trim();

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private client: GoogleGenAI | null = null;
  private readonly modelId = 'gemini-2.5-flash';

  constructor(
    private readonly config: ConfigService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  onModuleInit() {
    const key = this.config.get<string>('GEMINI_API_KEY');
    if (!key || key.trim() === '') {
      this.logger.log('GEMINI_API_KEY absent. High-fidelity verified offline knowledge engine active ($0 budget).');
    } else {
      try {
        this.client = new GoogleGenAI({ apiKey: key });
        this.logger.log(`Initialized Gemini Assistant with model: ${this.modelId}`);
      } catch (err: any) {
        this.logger.warn(`Failed to initialize GoogleGenAI client: ${err?.message || err}. Running offline engine.`);
      }
    }
  }

  async ask(prompt: string): Promise<{ text: string; source: 'gemini' | 'local_fallback' }> {
    const cleanPrompt = prompt.trim().slice(0, 500);
    if (!cleanPrompt) {
      return { text: 'Please provide a valid question.', source: 'local_fallback' };
    }

    if (!this.client) {
      return { text: await this.queryLocalFallback(cleanPrompt), source: 'local_fallback' };
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
      this.logger.warn(`Gemini API dispatch failed (${err?.message || err}). Serving verified local engine.`);
      return { text: await this.queryLocalFallback(cleanPrompt), source: 'local_fallback' };
    }
  }

  async queryLocalFallback(query: string): Promise<string> {
    const q = query.toLowerCase().trim();

    // 1. Check for specific project queries
    for (const project of verifiedPortfolioData.projects) {
      const pNameLower = project.name.toLowerCase();
      const pSlugLower = project.slug.toLowerCase();
      if (q.includes(pNameLower) || q.includes(pSlugLower)) {
        return `**${project.name}**: ${project.description}\n\n**Tech Stack**: ${project.techStack.join(', ')}.`;
      }
    }

    // 2. All projects overview
    if (
      /\b(projects?|portfolio)\b/i.test(q) &&
      (q.includes('what') || q.includes('show') || q.includes('list') || q.includes('tell') || q.includes('all') || q.includes('see') || q === 'projects')
    ) {
      const list = verifiedPortfolioData.projects
        .map((p) => `• **${p.name}** (${p.techStack.slice(0, 3).join(', ')})`)
        .join('\n');
      return `Sidhartha has engineered several verified platforms:\n\n${list}\n\nFeel free to ask about any specific project for details, or explore the Projects section above.`;
    }

    // 3. Skills and Technology Stack
    if (
      q.includes('skill') ||
      q.includes('stack') ||
      q.includes('technology') ||
      q.includes('technologies') ||
      q.includes('languages') ||
      q.includes('tools')
    ) {
      return `Sidhartha's verified core technical competencies:\n\n• **Languages & Frameworks**: React, Next.js, TypeScript, JavaScript, Node.js, NestJS, Python\n• **Cloud & Data**: AWS, SQL, PostgreSQL, Prisma ORM\n• **Specializations**: Machine Learning, Computer Vision, High-Performance Web Architectures, Interactive 3D.`;
    }

    // 4. Specific technology queries
    if (q.includes('python') || q.includes('machine learning') || q.includes('ai') || q.includes('model')) {
      return `Yes, Python and Machine Learning are core pillars of Sidhartha's work. He has built ML-driven applications including **GenVision** (neural computer vision) and the **Autism Screening Platform** (behavioral ML models).`;
    }

    if (q.includes('react') || q.includes('next') || q.includes('typescript') || q.includes('frontend')) {
      return `Sidhartha has deep experience with modern frontend engineering using **React**, **Next.js**, and **TypeScript**, crafting reactive UIs, 3D interactive graphics, and server-side rendered architectures.`;
    }

    if (q.includes('node') || q.includes('nest') || q.includes('backend') || q.includes('api') || q.includes('sql') || q.includes('database')) {
      return `For backend systems, Sidhartha designs robust services using **Node.js**, **NestJS**, **SQL (PostgreSQL/Neon)**, Prisma ORM, and REST/microservice APIs.`;
    }

    if (q.includes('aws') || q.includes('cloud') || q.includes('devops') || q.includes('docker')) {
      return `Sidhartha deploys and manages cloud workloads with **AWS** and containerized environments, ensuring high availability, security, and performance.`;
    }

    // 5. Bio / "Who is Sidhartha" / "About"
    if (
      q.includes('who is') ||
      q.includes('about') ||
      q.includes('introduce') ||
      q.includes('background') ||
      q.includes('sidhartha')
    ) {
      return `**${verifiedPortfolioData.name}** is a **${verifiedPortfolioData.role}** based in ${verifiedPortfolioData.location}. ${verifiedPortfolioData.summary}`;
    }

    // 6. Education
    if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('study')) {
      return verifiedPortfolioData.education;
    }

    // 7. Contact / Hire
    if (
      q.includes('contact') ||
      q.includes('hire') ||
      q.includes('reach') ||
      q.includes('email') ||
      q.includes('message') ||
      q.includes('connect')
    ) {
      return `${verifiedPortfolioData.contact.note}\n\n${verifiedPortfolioData.contact.availability}`;
    }

    // 8. GitHub / Code
    if (q.includes('github') || q.includes('git') || q.includes('source') || q.includes('repo')) {
      return `You can explore Sidhartha's open-source repositories and code contributions on his verified GitHub profile. Links are available in the Navigation bar and Projects section.`;
    }

    // 9. Greetings
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello ') || q.startsWith('hi ')) {
      return `Hello! I'm Sidhartha's AI Portfolio Assistant. Ask me about his projects (like GenVision or BhuYanthra), his technology stack, or how to contact him.`;
    }

    // 10. Honest boundary fallback (no hallucination)
    return `I do not have a verified record of that in Sidhartha's portfolio. Please feel free to ask about his projects (like GenVision or BhuYanthra), technical skills, or reach out via the Contact form.`;
  }
}

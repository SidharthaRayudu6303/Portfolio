import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { verifiedPortfolioData } from './portfolio-knowledge';
import { PrismaService } from '../../prisma/prisma.service';

const VERIFIED_SYSTEM_INSTRUCTION = `
You are the interactive AI Portfolio Assistant for SIDHARTHA RAYUDU.
Strict Operational Boundaries:
1. Ground every answer strictly in the provided verified portfolio context.
2. If asked about technologies, projects, or work history not explicitly verified, reply:
   "I do not have verified record of that in Sidhartha's portfolio. Please refer to the Projects or Skills sections."
3. Do not invent metrics, client names, statistics, ratings, or claims under any circumstances.
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
        let details = `**${project.name}**: ${project.description}\n\n• **Status**: ${project.status}\n• **Tech Stack**: ${project.techStack.join(', ')}`;
        if (project.problemSolved) details += `\n• **Problem Solved**: ${project.problemSolved}`;
        if (project.myContribution) details += `\n• **My Contribution**: ${project.myContribution}`;
        if (project.liveUrl) details += `\n• **Live Demo**: ${project.liveUrl}`;
        if (project.githubUrl) details += `\n• **GitHub**: ${project.githubUrl}`;
        return details;
      }
    }

    // 2. All projects overview
    if (
      /\b(projects?|portfolio)\b/i.test(q) &&
      (q.includes('what') || q.includes('show') || q.includes('list') || q.includes('tell') || q.includes('all') || q.includes('see') || q === 'projects')
    ) {
      const list = verifiedPortfolioData.projects
        .map((p) => `• **${p.name}** (${p.status}) — ${p.techStack.slice(0, 3).join(', ')}`)
        .join('\n');
      return `Sidhartha has worked on 6 verified engineering platforms:\n\n${list}\n\nFeel free to ask about any specific project (e.g. GenVision, BhuYanthra, Robohatch, SmartDonum) for more details.`;
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
      const s = verifiedPortfolioData.skills;
      return `Sidhartha's verified technical competencies:\n\n• **Programming Languages**: ${s.programmingLanguages.join(', ')}\n• **Frontend**: ${s.frontend.join(', ')}\n• **Backend**: ${s.backend.join(', ')}\n• **Databases**: ${s.databases.join(', ')}\n• **Cloud**: ${s.cloud.join(', ')}\n• **Tools**: ${s.tools.join(', ')}\n• **AI/ML**: ${s.aiMl.join(', ')}`;
    }

    // 4. Specific technology queries
    if (q.includes('python') || q.includes('machine learning') || q.includes('ai') || q.includes('model') || q.includes('cv') || q.includes('vision')) {
      return `Python and Machine Learning are core areas of interest for Sidhartha. He has applied Transformers, Diffusion Models, Computer Vision, and Image Inpainting in **GenVision**, and geospatial AI workflows in **BhuYanthra**.`;
    }

    if (q.includes('react') || q.includes('next') || q.includes('typescript') || q.includes('frontend')) {
      return `Sidhartha has practical experience building responsive web platforms with **React.js**, **Next.js**, **TypeScript**, and **Tailwind CSS**, including full-stack platforms like Robohatch and SmartDonum.`;
    }

    if (q.includes('node') || q.includes('nest') || q.includes('backend') || q.includes('api') || q.includes('sql') || q.includes('database') || q.includes('mysql') || q.includes('postgres')) {
      return `For backend systems, Sidhartha works with **Node.js**, **NestJS**, **REST APIs**, and relational databases including **PostgreSQL**, **MySQL**, and **Amazon RDS**.`;
    }

    // 5. Bio / "Who is Sidhartha" / "About"
    if (
      q.includes('who is') ||
      q.includes('about') ||
      q.includes('introduce') ||
      q.includes('background') ||
      q.includes('sidhartha') ||
      q.includes('rayudu')
    ) {
      return `**${verifiedPortfolioData.name}** (${verifiedPortfolioData.legalName}) is a **${verifiedPortfolioData.role}** based in ${verifiedPortfolioData.location}.\n\n${verifiedPortfolioData.summary}\n\n**Career Objective**: ${verifiedPortfolioData.careerObjective}`;
    }

    // 6. Education
    if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('study') || q.includes('cgpa') || q.includes('sathyabama')) {
      const e = verifiedPortfolioData.education;
      return `**Education**:\n• **Institution**: ${e.institution}\n• **Degree**: ${e.degree} in ${e.department}\n• **Duration**: ${e.startYear} – ${e.expectedGraduation}\n• **CGPA**: ${e.cgpa}\n• **Coursework**: ${e.coursework.join(', ')}\n• **Academic Achievement**: ${e.academicAchievement}`;
    }

    // 7. Experience / Internship
    if (
      q.includes('internship') ||
      q.includes('unstop') ||
      q.includes('robohatch') ||
      q.includes('employment') ||
      /\b(work\s+experience|job\s+experience|job\s+history|past\s+roles?|career\s+history)\b/i.test(q) ||
      (q.includes('experience') && !q.includes('nasa') && !q.includes('rocket')) ||
      (q.includes('where') && q.includes('work'))
    ) {
      const expList = verifiedPortfolioData.experience
        .map((exp) => `• **${exp.company}** — ${exp.role} (${exp.type})\n  ${exp.responsibilities}\n  *Technologies*: ${exp.technologies.join(', ')}`)
        .join('\n\n');
      return `**Professional Experience**:\n\n${expList}`;
    }

    // 8. Hackathons & Competitions
    if (q.includes('hackathon') || q.includes('antariksh') || q.includes('competition') || q.includes('achievement')) {
      const hList = verifiedPortfolioData.hackathons
        .map((h) => `• **${h.title}** (${h.year}): ${h.challenge} — *Status: ${h.status}*`)
        .join('\n');
      return `**Hackathons & Achievements**:\n\n${hList}`;
    }

    // 9. Certifications
    if (q.includes('certificat') || q.includes('datacamp') || q.includes('ibm') || q.includes('infosys') || q.includes('codetantra') || q.includes('samsung')) {
      const certList = verifiedPortfolioData.certifications
        .map((c) => `• **${c.title}** — ${c.issuer}${c.date ? ` (${c.date})` : ''}`)
        .join('\n');
      return `**Certifications & Learning**:\n\n${certList}`;
    }

    // 10. Contact / Profiles / Social
    if (
      q.includes('contact') ||
      q.includes('hire') ||
      q.includes('reach') ||
      q.includes('email') ||
      q.includes('message') ||
      q.includes('connect') ||
      q.includes('phone') ||
      q.includes('linkedin') ||
      q.includes('leetcode')
    ) {
      return `**Contact Sidhartha Rayudu**:\n• **Email**: ${verifiedPortfolioData.email}\n• **Phone**: ${verifiedPortfolioData.phone}\n• **Location**: ${verifiedPortfolioData.location}\n• **LinkedIn**: ${verifiedPortfolioData.profiles.linkedin}\n• **LeetCode**: ${verifiedPortfolioData.profiles.leetcode}\n• **HackerRank**: ${verifiedPortfolioData.profiles.hackerrank}\n• **Availability**: ${verifiedPortfolioData.availability}\n• You can also send a direct message through the on-site Contact form.`;
    }

    // 11. Greetings
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello ') || q.startsWith('hi ')) {
      return `Hello! I am Sidhartha Rayudu's AI Portfolio Assistant. Ask me about his projects (GenVision, BhuYanthra, Robohatch, SmartDonum), technical skills, education at Sathyabama, or how to reach him.`;
    }

    // 12. Honest fallback
    return `I do not have a verified record of that in Sidhartha's portfolio. Please feel free to ask about his 6 projects (like GenVision or BhuYanthra), skills, education, or get in touch through the Contact section.`;
  }
}

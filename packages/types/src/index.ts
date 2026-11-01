// Core Shared Interfaces & DTOs

export interface ProjectDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SkillDto {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

export interface ExperienceDto {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  order: number;
}

export interface CertificationDto {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

export interface ContactMessageDto {
  name: string;
  email: string;
  message: string;
}

export interface AiChatRequestDto {
  message: string;
}

export interface AiChatResponseDto {
  text: string;
  source: 'gemini' | 'local_fallback';
}

export interface CsrfTokenResponseDto {
  csrfToken: string;
}

export interface AdminJwtPayload {
  sub: string;
  email: string;
  role: 'admin';
  tokenVersion: number;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

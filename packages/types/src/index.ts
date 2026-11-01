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
  problemSolved?: string | null;
  myContribution?: string | null;
  whyBuilt?: string | null;
  features?: string[];
  status?: string | null;
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
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  order: number;
}

export interface CertificationDto {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

export interface EducationDto {
  id: string;
  institution: string;
  degree: string;
  department: string;
  startYear: number;
  endYear: number;
  cgpa: string;
  coursework: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementDto {
  id: string;
  title: string;
  category: string;
  description: string;
  year?: number | null;
  status?: string | null;
  projectUrl?: string | null;
  proofUrl?: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeDocumentDto {
  id: string;
  filename: string;
  label: string;
  mimeType: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSettingDto {
  key: string;
  value: string;
}

export interface ProfileMediaDto {
  id: string;
  type: string;
  mimeType: string;
  fileSize: number;
  imageUrl?: string | null;
  updatedAt: string;
}

export interface ContactMessageDto {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessageItemDto {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AnalyticsSummaryDto {
  totalViews: number;
  topPages: { path: string; visits: number }[];
  recentViews: {
    id: string;
    path: string;
    referrer: string | null;
    device: string | null;
    createdAt: string;
  }[];
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

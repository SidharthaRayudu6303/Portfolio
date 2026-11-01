import React from 'react';
import { BACKEND_API_URL } from '@/lib/constants';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { ProjectsSection } from '@/components/projects-section';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceSection } from '@/components/experience-section';
import { CertificationsSection } from '@/components/certifications-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';
import { InteractiveUniverse } from '@/components/effects/interactive-universe';

export const dynamic = 'force-dynamic';

interface Project {
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
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  order: number;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

async function fetchPortfolioData(): Promise<{
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  certifications: Certification[];
}> {
  try {
    const [projRes, skillRes, expRes, certRes] = await Promise.all([
      fetch(`${BACKEND_API_URL}/projects`, { cache: 'no-store' }),
      fetch(`${BACKEND_API_URL}/skills`, { cache: 'no-store' }),
      fetch(`${BACKEND_API_URL}/experience`, { cache: 'no-store' }),
      fetch(`${BACKEND_API_URL}/certifications`, { cache: 'no-store' }),
    ]);

    const projects: Project[] = projRes.ok ? await projRes.json() : [];
    const skills: Skill[] = skillRes.ok ? await skillRes.json() : [];
    const experience: Experience[] = expRes.ok ? await expRes.json() : [];
    const certifications: Certification[] = certRes.ok ? await certRes.json() : [];

    return {
      projects,
      skills,
      experience,
      certifications,
    };
  } catch {
    return {
      projects: [],
      skills: [],
      experience: [],
      certifications: [],
    };
  }
}

export default async function HomePage() {
  const { projects, skills, experience, certifications } = await fetchPortfolioData();

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 selection:bg-cyan-500 selection:text-neutral-950">
      {/* 3D Particle Universe, Cinematic Loader, Custom Cursor & Scroll Effects */}
      <InteractiveUniverse />

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          projectCount={projects.length}
          skillCount={skills.length}
        />

        {/* About Section */}
        <About />

        {/* Projects Section */}
        <ProjectsSection projects={projects} />

        {/* Skills Section */}
        <SkillsSection skills={skills} />

        {/* Experience Section */}
        <ExperienceSection experience={experience} />

        {/* Certifications Section */}
        <CertificationsSection certifications={certifications} />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

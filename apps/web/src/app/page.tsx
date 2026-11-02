import React from 'react';
import { BACKEND_API_URL } from '@/lib/constants';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { EducationSection } from '@/components/education-section';
import { SkillsSection } from '@/components/skills-section';
import { ProjectsSection, VERIFIED_DEFAULT_PROJECTS } from '@/components/projects-section';
import { ExperienceSection } from '@/components/experience-section';
import { HackathonsSection } from '@/components/hackathons-section';
import { CertificationsSection } from '@/components/certifications-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';
import { InteractiveUniverse } from '@/components/effects/interactive-universe';
import { ScreenDots } from '@/components/navigation/screen-dots';
import { BackToTop } from '@/components/navigation/back-to-top';

export const revalidate = 60;

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
  problemSolved?: string | null;
  myContribution?: string | null;
  whyBuilt?: string | null;
  features?: string[];
  status?: string | null;
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
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  order: number;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
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
      fetch(`${BACKEND_API_URL}/projects`, { next: { revalidate: 60 } }),
      fetch(`${BACKEND_API_URL}/skills`, { next: { revalidate: 60 } }),
      fetch(`${BACKEND_API_URL}/experience`, { next: { revalidate: 60 } }),
      fetch(`${BACKEND_API_URL}/certifications`, { next: { revalidate: 60 } }),
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
    <div className="relative min-h-screen bg-[#050505] text-neutral-100 selection:bg-cyan-500 selection:text-neutral-950 overflow-x-hidden">
      {/* 3D Particle Universe, Cinematic Loader, Custom Cursor & Scroll Effects */}
      <InteractiveUniverse />

      {/* Navigation & Section Indicator */}
      <Navbar />
      <ScreenDots />

      {/* Main Sections */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <Hero
          projectCount={projects.length > 0 ? projects.length : VERIFIED_DEFAULT_PROJECTS.length}
          skillCount={skills.length > 0 ? skills.length : 32}
        />

        {/* 2. About Me */}
        <About />

        {/* 3. Education */}
        <EducationSection />

        {/* 4. Technical Skills */}
        <SkillsSection skills={skills} />

        {/* 5. Featured & Engineering Projects */}
        <ProjectsSection projects={projects} />

        {/* 6. Experience & Internship */}
        <ExperienceSection experience={experience} />

        {/* 7. Hackathons & Coding Profiles */}
        <HackathonsSection />

        {/* 8. Certifications & Accreditations */}
        <CertificationsSection certifications={certifications} />

        {/* 9. Contact Section & Resume Download */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Code2,
  FolderGit2,
  Star,
  Github,
  ExternalLink,
  ArrowUpRight,
  Activity,
  Layers,
} from 'lucide-react';
import { ProjectModal, Project } from './project-modal';

interface ProjectsSectionProps {
  projects?: Project[];
}

// 6 verified projects with complete confirmed specifications
export const VERIFIED_DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-genvision',
    title: 'GenVision: A Cloud Severity-Aware Transformer-Diffusion Framework',
    slug: 'genvision',
    description:
      'An AI/ML-based satellite image reconstruction framework designed to recover cloud-obscured regions in satellite imagery and support agricultural analysis.',
    problemSolved:
      'Cloud coverage in satellite images can hide important geographical information, affecting remote sensing and agricultural monitoring.',
    whyBuilt:
      'To explore how AI and deep learning can reconstruct missing satellite image regions and improve the usability of remote sensing data.',
    myContribution:
      'Research, System architecture, AI/ML workflow, Frontend development, and Integration.',
    features: [
      'Cloud detection',
      'Cloud severity analysis',
      'Satellite image reconstruction',
      'Temporal image analysis',
      'Agricultural analysis',
    ],
    techStack: [
      'Next.js',
      'React',
      'Python processing services',
      'Transformers',
      'Diffusion Models',
      'Computer Vision',
      'Image Inpainting',
    ],
    status: 'Final-year project — In Development',
    featured: true,
    order: 1,
    liveUrl: 'https://gen-vision-nu.vercel.app/',
    githubUrl: null, // Intentionally left empty as instructed
  },
  {
    id: 'proj-bhuyanthra',
    title: 'BhuYanthra — AI-Powered Agricultural Intelligence Platform',
    slug: 'bhuyanthra',
    description:
      'An agricultural intelligence platform that uses satellite imagery and geospatial analysis to support agricultural monitoring and decision-making.',
    problemSolved:
      'Lack of accessible satellite-based agricultural insights and difficulties monitoring agricultural land over time.',
    whyBuilt:
      'To explore how satellite data and AI can help improve agricultural monitoring and decision-making.',
    myContribution:
      'Frontend development, Integration of geospatial data, and Platform development.',
    features: [
      'Satellite imagery visualization',
      'Agricultural monitoring',
      'Geospatial analysis',
      'Remote sensing data integration',
    ],
    techStack: [
      'Next.js',
      'React',
      'Python',
      'ISRO Bhuvan',
      'Sentinel-2',
      'Geospatial Analysis',
    ],
    status: 'In Development',
    featured: true,
    order: 2,
    liveUrl: null, // Left empty until confirmed
    githubUrl: null, // Left empty until confirmed
  },
  {
    id: 'proj-robohatch',
    title: 'Robohatch — 3D Printed Products E-commerce Platform',
    slug: 'robohatch',
    description:
      'An e-commerce platform designed for showcasing and selling 3D-printed products through an intuitive online shopping experience.',
    myContribution:
      'Full-stack development, Frontend implementation, Backend API integration, and Cloud deployment.',
    features: [
      'Product listings',
      'Product details',
      'Shopping experience',
      'Backend API integration',
      'Responsive interface',
    ],
    techStack: ['Next.js', 'NestJS', 'TypeScript', 'REST APIs', 'AWS', 'Vercel'],
    status: 'Developed / Deployed',
    featured: true,
    order: 3,
    liveUrl: 'https://robohatch-platform-web.vercel.app/',
    githubUrl: 'https://github.com/Chandrasekhar246800/robohatch-platform.git',
  },
  {
    id: 'proj-smartdonum',
    title: 'SmartDonum — Donation Management Platform',
    slug: 'smartdonum',
    description:
      'A donation management platform connecting donors and beneficiaries to make donations of food, clothing, and books more accessible and organized.',
    myContribution:
      'Frontend development, Application design, API integration, and Platform development.',
    features: [
      'Donation management',
      'Donor & beneficiary workflows',
      'Donation listings',
      'Responsive user interface',
    ],
    techStack: ['React.js', 'Next.js', 'REST APIs', 'MySQL'],
    status: 'Developed / Deployed',
    featured: true,
    order: 4,
    liveUrl: 'https://smartdonum.vercel.app/',
    githubUrl: 'https://github.com/Chandrasekhar246800/smartdonum.git',
  },
  {
    id: 'proj-autism',
    title: 'Autism Screening Platform',
    slug: 'autism-screening-platform',
    description:
      'A web-based autism screening platform designed to provide an accessible interface for screening-related assessments and media submissions.',
    problemSolved:
      'Provides an accessible digital interface for early screening assessments and media submissions (non-clinical screening evaluation tool).',
    myContribution:
      'Frontend development and implementation of application workflows.',
    features: [
      'Landing page',
      'Account creation',
      'Dashboard',
      'Camera scanning interface',
      'Video upload functionality',
    ],
    techStack: ['React', 'Vite', 'TypeScript'],
    status: 'Developed / Deployed',
    featured: false,
    order: 5,
    liveUrl: 'https://autism-screening-platform.vercel.app/',
    githubUrl: 'https://github.com/SidharthaRayudu6303/autism_screening_platform.git',
  },
  {
    id: 'proj-rental',
    title: 'Smart Rental Platform — Equipment & Fleet Management Dashboard',
    slug: 'smart-rental-platform',
    description:
      'An equipment and fleet management platform designed to help monitor rental equipment, track operations, and visualize key business information.',
    myContribution:
      'Frontend development, Dashboard implementation, API integration, and Application development.',
    features: [
      'Equipment tracking',
      'Fleet management dashboard',
      'Analytics & telemetry',
      'Forecasting',
      'Alerts',
    ],
    techStack: ['React.js', 'Next.js', 'REST APIs', 'Vercel'],
    status: 'Developed / Deployed',
    featured: false,
    order: 6,
    liveUrl: 'https://cat-hackathon-nu.vercel.app/dashboard',
    githubUrl: 'https://github.com/SidharthaRayudu6303/CAT_Hackathon.git',
  },
];

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // If projects exist from DB, map them; otherwise use VERIFIED_DEFAULT_PROJECTS
  const allProjects =
    projects && projects.length > 0 ? projects : VERIFIED_DEFAULT_PROJECTS;

  const featuredProjects = allProjects.filter((p) => p.featured);
  const standardProjects = allProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Code2 className="h-4 w-4" />
              <span>Project Portfolio</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured &amp; Engineering Projects
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Verified full-stack applications, AI/ML frameworks, and real-world software platforms.
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {allProjects.length} Verified Projects
          </span>
        </div>

        <div className="space-y-12">
          {/* Featured Projects Grid (GenVision, BhuYanthra, Robohatch, SmartDonum) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>Featured Highlights</span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-cyan-500/30 bg-neutral-900/60 p-6 shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/60 hover:bg-neutral-850/80 hover:shadow-xl hover:shadow-cyan-500/15 cursor-pointer"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 ring-1 ring-cyan-500/30">
                          Featured
                        </span>
                        {project.status && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                            project.status.toLowerCase().includes('development')
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white transition"
                            title="GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-cyan-400 transition"
                            title="Live Demo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Problem Solved Preview */}
                    {project.problemSolved && (
                      <p className="mt-2 text-xs text-neutral-400 border-l-2 border-cyan-500/40 pl-2 italic">
                        &ldquo;{project.problemSolved}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Tech Stack Tags & Deep Dive Link */}
                  <div className="mt-6 border-t border-neutral-800/80 pt-4 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-neutral-800 bg-neutral-950/80 px-2 py-0.5 text-[11px] font-mono text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                      <span className="text-[11px] text-cyan-400/80 font-mono">Click to view full architecture</span>
                      <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                        <span>Inspect</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Engineering Projects (Autism Screening & Smart Rental Platform) */}
          {standardProjects.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>Additional Verified Projects</span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {standardProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-850/60 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                          project.status?.toLowerCase().includes('development')
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {project.status || 'Verified Project'}
                        </span>
                        <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 hover:text-white transition"
                              title="GitHub"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 hover:text-cyan-400 transition"
                              title="Live Demo"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-neutral-800/80 pt-4 flex flex-col gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-neutral-800 bg-neutral-950/80 px-2 py-0.5 text-[11px] font-mono text-neutral-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                        <span className="text-[11px] text-neutral-500">Click to view details</span>
                        <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                          <span>Inspect</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Deep Dive Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}

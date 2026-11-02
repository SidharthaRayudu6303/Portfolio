'use client';

import React, { useEffect } from 'react';
import { ProjectArtwork } from './project-artwork';
import {
  X,
  Github,
  ExternalLink,
  Layers,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  ListCheck,
  Activity,
  Lightbulb,
} from 'lucide-react';

export interface Project {
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
  category?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

// Fallback image helper
function getProjectImage(slug: string, explicitImg?: string | null): string {
  if (explicitImg && explicitImg.trim() !== '') return explicitImg;
  if (slug.includes('genvision')) return '/projects/genvision.svg';
  if (slug.includes('bhuyanthra')) return '/projects/bhuyanthra.svg';
  if (slug.includes('robohatch')) return '/projects/robohatch.svg';
  if (slug.includes('smartdonum')) return '/projects/smartdonum.svg';
  if (slug.includes('autism')) return '/projects/autism-screening.svg';
  if (slug.includes('rental')) return '/projects/smart-rental.svg';
  return '/projects/genvision.svg';
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // ESC key listener to close modal
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const projectImage = getProjectImage(project.slug, project.imageUrl);
  const isInDevelopment = project.status?.toLowerCase().includes('development');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-cyan-500/40 bg-neutral-900/95 shadow-2xl shadow-cyan-950/50 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Project Visual Artwork Banner (16:9 Aspect Ratio) */}
        <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-t-3xl border-b border-neutral-800 bg-neutral-950">
          <ProjectArtwork
            src={projectImage}
            alt={project.title}
            title={project.title}
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent pointer-events-none" />

          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-neutral-700/80 bg-neutral-950/80 p-2.5 text-neutral-300 hover:text-white hover:border-cyan-400 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Close project modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badges on Visual */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
                <span>Featured Project</span>
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium backdrop-blur-md ${
                isInDevelopment
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{project.status || (isInDevelopment ? 'In Development' : 'Deployed')}</span>
            </span>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title Header */}
          <div>
            <span className="block font-mono text-xs uppercase tracking-widest text-cyan-400 mb-1">
              Project Specification
            </span>
            <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {project.title}
            </h3>
          </div>

          {/* Overview Description */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 text-sm sm:text-base text-neutral-200 leading-relaxed">
            {project.description}
          </div>

          {/* Problem Statement & Solution */}
          {project.problemSolved && (
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span>Problem Addressed</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {project.problemSolved}
              </p>
            </div>
          )}

          {/* Autism Non-Diagnostic Disclaimer */}
          {project.slug.includes('autism') && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-start gap-3 text-xs text-amber-300 leading-relaxed">
              <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-200 uppercase font-mono text-[10px] tracking-wider mb-0.5">
                  Non-Diagnostic Advisory Notice
                </strong>
                <span>
                  This platform is designed solely as an observational pre-screening and media submission interface for research and preliminary informational support. It does not provide medical diagnosis, clinical evaluation, or formal psychiatric validation.
                </span>
              </div>
            </div>
          )}

          {/* Why Built / Technical Solution */}
          {project.whyBuilt && (
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-purple-400">
                <Lightbulb className="h-4 w-4" />
                <span>Engineering Rationale &amp; Objectives</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {project.whyBuilt}
              </p>
            </div>
          )}

          {/* My Verified Contribution */}
          {project.myContribution && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/15 p-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">
                <UserCheck className="h-4 w-4" />
                <span>My Contribution</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                {project.myContribution}
              </p>
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">
                <ListCheck className="h-4 w-4 text-cyan-400" />
                <span>Key Platform Features</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Technologies &amp; Architecture</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-cyan-500/40 transition"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links & Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:border-neutral-700 hover:text-white transition"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {isInDevelopment && !project.liveUrl && !project.githubUrl && (
                <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  ℹ Currently in active development. Links will be released upon milestone deployment.
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white hover:border-neutral-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

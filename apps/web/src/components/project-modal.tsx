'use client';

import React from 'react';
import {
  X,
  Github,
  ExternalLink,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react';

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

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-neutral-900 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-xl border border-neutral-800 bg-neutral-950/80 p-2 text-neutral-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Featured Tag & Slug */}
        <div className="flex items-center gap-3">
          {project.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 ring-1 ring-cyan-500/30">
              <Star className="h-3 w-3 fill-cyan-400" />
              <span>Featured Project</span>
            </span>
          )}
          <span className="font-mono text-xs text-neutral-500">
            /{project.slug}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {project.title}
        </h3>

        {/* Project Description */}
        <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
          {project.description}
        </div>

        {/* Tech Stack */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Technologies &amp; Architecture</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Highlights List */}
        <div className="mt-6 border-t border-neutral-800/80 pt-4 space-y-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>PostgreSQL (Neon) Database-backed record</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Production-ready component architecture</span>
          </div>
        </div>

        {/* Links Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-5">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold text-neutral-300 hover:border-neutral-700 hover:text-white transition"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition"
              >
                <span>Live Deployment</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


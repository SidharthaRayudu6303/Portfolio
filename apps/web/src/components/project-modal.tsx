'use client';

import React from 'react';
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
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-neutral-900 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-xl border border-neutral-800 bg-neutral-950/80 p-2 text-neutral-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Featured Tag & Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          {project.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 ring-1 ring-cyan-500/30">
              <Star className="h-3 w-3 fill-cyan-400" />
              <span>Featured Project</span>
            </span>
          )}
          {project.status && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium ${
              project.status.toLowerCase().includes('development')
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            }`}>
              <Activity className="h-3 w-3" />
              <span>{project.status}</span>
            </span>
          )}
          <span className="font-mono text-xs text-neutral-500">
            /{project.slug}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-white">
          {project.title}
        </h3>

        {/* Project Description */}
        <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
          {project.description}
        </div>

        {/* Problem Statement */}
        {project.problemSolved && (
          <div className="mt-4 rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Problem Solved</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {project.problemSolved}
            </p>
          </div>
        )}

        {/* Why I Built It */}
        {project.whyBuilt && (
          <div className="mt-3 rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-purple-400">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Why I Built It</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {project.whyBuilt}
            </p>
          </div>
        )}

        {/* My Contribution */}
        {project.myContribution && (
          <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">
              <UserCheck className="h-3.5 w-3.5" />
              <span>My Contribution</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {project.myContribution}
            </p>
          </div>
        )}

        {/* Main Features */}
        {project.features && project.features.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">
              <ListCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Key Features</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {project.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-2 text-xs text-neutral-300">
                  <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Links Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition"
              >
                <span>Live Demo</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
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
            {!project.liveUrl && !project.githubUrl && (
              <span className="text-xs text-neutral-500 italic">
                Repository / Demo link will be provided upon public confirmation.
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Code2,
  FolderGit2,
  Star,
  Github,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { ProjectModal } from './project-modal';

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

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featuredProjects = projects.filter((p) => p.featured);
  const standardProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Code2 className="h-4 w-4" />
              <span>Showcase</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured &amp; Engineering Projects
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} in Database
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-20 text-center">
            <FolderGit2 className="h-10 w-10 text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-white">No projects found in database</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-md">
              Projects added via the Admin CMS will automatically populate this section.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Projects Grid */}
            {featuredProjects.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>Featured Highlights</span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-cyan-500/30 bg-neutral-900/60 p-6 shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/60 hover:bg-neutral-850/80 hover:shadow-xl hover:shadow-cyan-500/15"
                    >
                      <div>
                        {/* Top Meta Bar */}
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400 ring-1 ring-cyan-500/30">
                            Featured
                          </span>
                          <div className="flex items-center gap-2.5">
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
                                className="text-cyan-400 hover:text-cyan-300 transition"
                                title="Live Demo"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-400 transition">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-xs text-neutral-300 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Footer & Detail Action */}
                      <div className="mt-6 border-t border-neutral-800/80 pt-4">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md bg-neutral-800/80 px-2 py-0.5 text-[10px] font-medium text-neutral-300 transition-colors hover:bg-cyan-500/20 hover:text-cyan-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:underline cursor-pointer"
                        >
                          <span>Explore Architecture</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects Grid */}
            {standardProjects.length > 0 && (
              <div className="space-y-6">
                {featuredProjects.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">
                    <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Other Key Projects</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {standardProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-neutral-850/60 hover:shadow-lg hover:shadow-cyan-950/20"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-white transition"
                                title="GitHub"
                              >
                                <Github className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 transition"
                                title="Live Demo"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-neutral-800/80 pt-3">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[9px] text-neutral-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 group-hover:text-cyan-400 transition cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}


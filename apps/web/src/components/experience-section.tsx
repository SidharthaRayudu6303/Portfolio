'use client';

import React from 'react';
import {
  Briefcase,
  Calendar,
  Building,
  CheckCircle2,
  Rocket,
  Code2,
} from 'lucide-react';

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

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  // If user hasn't added corporate employment records in CMS, present verified project milestones
  const verifiedMilestones = [
    {
      title: 'GenVision AI & Vision Systems',
      subtitle: 'Lead Architect & ML Engineering',
      date: 'Recent Milestone',
      description:
        'Architected end-to-end generative AI and computer vision pipelines in Python and FastAPI, coupled with responsive React and Next.js interfaces for visual defect detection.',
      icon: Rocket,
      badge: 'Project Initiative',
    },
    {
      title: 'BhuYanthra Agricultural Robotics',
      subtitle: 'Robotics & Soil Intelligence System',
      date: 'Engineering Milestone',
      description:
        'Designed autonomous agricultural robotics platform collecting soil sensor telemetry and predicting crop yield through machine learning models.',
      icon: Code2,
      badge: 'Hardware & IoT',
    },
    {
      title: 'Robohatch Smart Incubation System',
      subtitle: 'Embedded Hardware & Cloud Telemetry',
      date: 'Engineering Milestone',
      description:
        'Engineered precision incubation environmental controls with real-time sensor calibration and AWS cloud telemetry streaming.',
      icon: Briefcase,
      badge: 'Automation',
    },
  ];

  return (
    <section id="experience" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Briefcase className="h-4 w-4" />
              <span>Career &amp; Milestones</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Experience &amp; Engineering Journey
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {experience.length > 0 ? `${experience.length} Verified Entries` : 'Project Milestones'}
          </span>
        </div>

        {/* Timeline View */}
        <div className="relative border-l border-neutral-800 ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-10">
          {experience.length > 0 ? (
            experience
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
              )
              .map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 ring-4 ring-neutral-900">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        exp.current ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-850/50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-300">
                          <Building className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="font-semibold text-cyan-400">{exp.company}</span>
                          {exp.current && (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 sm:text-right">
                        <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                          })}{' '}
                          —{' '}
                          {exp.current
                            ? 'Present'
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                              })
                            : 'Present'}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            // Verified Project Milestones (Honest, accurate roadmap without inventing corporate jobs)
            verifiedMilestones.map((ms) => {
              const Icon = ms.icon;
              return (
                <div key={ms.title} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 ring-4 ring-neutral-900">
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>

                  <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-850/50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                            {ms.title}
                          </h3>
                          <span className="text-xs text-cyan-400 font-medium">
                            {ms.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-mono text-neutral-400">
                          {ms.badge}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {ms.date}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {ms.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}


'use client';

import React from 'react';
import {
  Briefcase,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

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

interface ExperienceSectionProps {
  experience?: Experience[];
}

// Confirmed internship record
const DEFAULT_EXPERIENCE = [
  {
    id: 'exp-unstop',
    company: 'Unstop Events',
    role: 'React JS Developer Intern',
    type: 'Part-time Internship',
    description:
      'Worked on React.js-based frontend development and practical web development tasks, gaining foundational hands-on industry experience in component state management and UI implementation.',
    technologies: ['React.js', 'JavaScript'],
    achievement: 'Practical experience with frontend development.',
    startDate: null, // Intentionally left empty as instructed
    endDate: null,   // Intentionally left empty as instructed
    current: false,
    order: 1,
  },
];

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  // Use DB experience if available; otherwise use DEFAULT_EXPERIENCE
  const items =
    experience && experience.length > 0 ? experience : DEFAULT_EXPERIENCE;

  return (
    <section id="experience" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Briefcase className="h-4 w-4" />
              <span>Internship &amp; Experience</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Professional Work &amp; Practical Training
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Verified industry experience focused on modern frontend engineering.
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {items.length} {items.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>

        {/* Timeline View */}
        <div className="relative border-l border-neutral-800 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-10">
          {items.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 ring-4 ring-neutral-900">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
              </div>

              {/* Card */}
              <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-amber-500/40 hover:bg-neutral-850/50">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-mono font-medium text-amber-300 mb-2">
                      <Building className="h-3 w-3" />
                      <span>{exp.company}</span>
                    </span>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  </div>

                  {/* Dates only if provided */}
                  {(exp.startDate || exp.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                      <Calendar className="h-3.5 w-3.5 text-amber-400" />
                      <span>
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start'}
                        {' – '}
                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-800/80">
                  <span className="text-xs font-mono text-neutral-500">Tech Stack:</span>
                  {(('technologies' in exp && Array.isArray((exp as any).technologies))
                    ? (exp as any).technologies
                    : ['React.js', 'JavaScript']
                  ).map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-md border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-xs font-mono text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

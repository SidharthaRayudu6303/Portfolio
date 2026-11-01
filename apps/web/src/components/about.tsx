'use client';

import React from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Compass,
  Code2,
  Cpu,
  Layers,
  Lightbulb,
  FileText,
  Target,
  BookOpen,
} from 'lucide-react';
import {
  DISPLAY_NAME,
  FULL_LEGAL_NAME,
  ABOUT_TEXT,
  CAREER_OBJECTIVE,
  CURRENTLY_LOOKING_FOR,
  AVAILABILITY,
  MAIN_INTERESTS,
  CURRENTLY_LEARNING,
} from '@/lib/constants';

export function About() {
  const pillars = [
    {
      icon: Code2,
      title: 'Full-Stack Development',
      description:
        'Building responsive, accessible web platforms using React.js, Next.js, and TypeScript, backed by robust REST APIs in Node.js and NestJS.',
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: Cpu,
      title: 'AI & Machine Learning',
      description:
        'Exploring Transformer and Diffusion models for image reconstruction in GenVision, geospatial AI in BhuYanthra, and computer vision classification.',
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Layers,
      title: 'Backend & Databases',
      description:
        'Designing relational schemas, performing safe migrations, and engineering transactional services with PostgreSQL, MySQL, and Amazon RDS.',
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Lightbulb,
      title: 'Cloud & Engineering Systems',
      description:
        'Deploying and orchestrating applications across AWS, Vercel, and modern containerized infrastructure with continuous CI/CD pipelines.',
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section id="about" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <User className="h-4 w-4" />
            <span>About Me</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Computer Science Student &amp; Passionate Software Builder
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6 text-sm text-neutral-300 sm:text-base leading-relaxed">
            <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
              I am <strong className="text-cyan-400">{DISPLAY_NAME}</strong> ({FULL_LEGAL_NAME}).
            </p>

            <p className="leading-relaxed">
              {ABOUT_TEXT}
            </p>

            {/* Career Objective Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-2">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Target className="h-4 w-4" />
                <span>Career Objective</span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed sm:text-sm">
                &ldquo;{CAREER_OBJECTIVE}&rdquo;
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-cyan-300">Currently Looking For:</span>
                <span className="text-neutral-300">{CURRENTLY_LOOKING_FOR}</span>
              </div>
            </div>

            {/* Main Interests & Currently Learning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Main Interests</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {MAIN_INTERESTS.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Currently Learning</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {CURRENTLY_LEARNING.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resume Link */}
            <div className="pt-2">
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition"
              >
                <FileText className="h-4 w-4" />
                <span>View / Download Latest Verified Resume PDF &rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Pillars of Expertise */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-850/60"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${pillar.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

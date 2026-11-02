'use client';

import React from 'react';
import {
  GraduationCap,
  Code2,
  Cpu,
  Trophy,
  Rocket,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  isCurrent?: boolean;
  statusText: string;
  accent: {
    border: string;
    bg: string;
    text: string;
    glow: string;
  };
}

const MILESTONES: Milestone[] = [
  {
    year: '2023',
    title: 'Started CSE',
    subtitle: 'Academic Foundations',
    description:
      'Enrolled in B.E. Computer Science & Engineering at Sathyabama Institute of Science and Technology. Built strong foundations in Data Structures, Algorithms, and Object-Oriented Programming.',
    icon: GraduationCap,
    statusText: 'Foundation',
    accent: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    },
  },
  {
    year: '2024',
    title: 'Explored Web Development',
    subtitle: 'Full-Stack Engineering',
    description:
      'Mastered modern web development with React.js, Next.js, TypeScript, and Node.js. Built real-world e-commerce, donation, and rental management platforms.',
    icon: Code2,
    statusText: 'Web Stack',
    accent: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    },
  },
  {
    year: '2025',
    title: 'Dived into AI/ML',
    subtitle: 'Intelligent Systems',
    description:
      'Ventured into computer vision, deep learning models, and geospatial image processing. Engineered GenVision (image inpainting) and BhuYanthra (agricultural satellite intelligence).',
    icon: Cpu,
    statusText: 'AI Systems',
    accent: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    },
  },
  {
    year: '2026',
    title: 'Hackathons & Internships',
    subtitle: 'Competitive & Industry Impact',
    description:
      'Selected for Bharatiya Antariksh Hackathon 2026 Challenge 12; engineered Smart Rental at CAT Hackathon; entering engineering internship to build scalable systems.',
    icon: Trophy,
    isCurrent: true,
    statusText: 'Current Focus',
    accent: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    },
  },
  {
    year: '2027',
    title: 'Graduating & Beyond',
    subtitle: 'Software Engineering Career',
    description:
      'Graduating with B.E. in CSE. Stepping into full-time software development to solve real-world problems, build scalable cloud architectures, and continuously innovate.',
    icon: Rocket,
    statusText: 'Target Horizon',
    accent: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    },
  },
];

export function JourneyTimeline() {
  return (
    <div className="mt-16 pt-12 border-t border-neutral-800/80">
      {/* Timeline Section Header */}
      <div className="max-w-2xl mb-10">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="h-4 w-4" />
          <span>Milestones</span>
        </div>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Journey &amp; Growth Timeline
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed">
          From establishing computer science fundamentals to building AI systems, competing in national hackathons, and preparing for graduation.
        </p>
      </div>

      {/* Desktop Horizontal Timeline (Visible on lg and above) */}
      <div className="hidden lg:block relative">
        {/* Continuous Connecting Line with Gradient & Glow */}
        <div className="absolute top-[38px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-amber-500/40 -z-0">
          {/* Animated Glow Runner */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 blur-[1px] animate-pulse-subtle" />
        </div>

        <div className="grid grid-cols-5 gap-4 relative z-10">
          {MILESTONES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.year} className="flex flex-col items-center text-center group">
                {/* Milestone Node */}
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border ${item.accent.border} ${item.accent.bg} ${item.accent.glow} backdrop-blur-md transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-6 w-6 ${item.accent.text}`} />

                  {/* Pulsing indicator for current milestone */}
                  {item.isCurrent && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-bold text-black items-center justify-center">
                        ★
                      </span>
                    </span>
                  )}
                </div>

                {/* Milestone Year Badge */}
                <div className="mt-4 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-900/90 text-xs font-mono font-bold text-white shadow-sm">
                    <span>{item.year}</span>
                    {item.isCurrent && (
                      <span className="ml-1 text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                        • LIVE
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white group-hover:text-cyan-300 transition">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {item.subtitle}
                  </span>
                </div>

                {/* Description Card */}
                <div className="mt-3 w-full rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5 backdrop-blur-sm text-left transition-all duration-300 group-hover:border-neutral-700 group-hover:bg-neutral-850/60">
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Vertical Timeline (Visible on < lg) */}
      <div className="lg:hidden relative pl-6 border-l-2 border-neutral-800 space-y-8 ml-2">
        {MILESTONES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.year} className="relative group">
              {/* Dot on the vertical line */}
              <div
                className={`absolute -left-[31px] top-1.5 flex h-8 w-8 items-center justify-center rounded-xl border ${item.accent.border} ${item.accent.bg} ${item.accent.glow} backdrop-blur-md`}
              >
                <Icon className={`h-4 w-4 ${item.accent.text}`} />
              </div>

              {/* Content Box */}
              <div
                className={`rounded-2xl border ${
                  item.isCurrent ? 'border-emerald-500/40 bg-neutral-900/70 shadow-lg shadow-emerald-950/20' : 'border-neutral-800/80 bg-neutral-900/40'
                } p-5 backdrop-blur-sm transition`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold font-mono text-white">
                      {item.year}
                    </span>
                    <span className="text-xs text-neutral-400">•</span>
                    <h4 className="text-sm font-bold text-white">
                      {item.title}
                    </h4>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium ${item.accent.bg} ${item.accent.text} border ${item.accent.border}`}
                  >
                    {item.isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    <span>{item.statusText}</span>
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


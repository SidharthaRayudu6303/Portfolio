'use client';

import React from 'react';
import Image from 'next/image';
import {
  User,
  GraduationCap,
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Cloud,
  FileText,
  Target,
  MapPin,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  DISPLAY_NAME,
  FULL_LEGAL_NAME,
  PROFESSIONAL_TITLE,
  PROFILE_PHOTO_URL,
  ABOUT_TEXT,
  CAREER_OBJECTIVE,
  CURRENTLY_LOOKING_FOR,
  AVAILABILITY,
  MAIN_INTERESTS,
  CURRENTLY_LEARNING,
} from '@/lib/constants';
import { DeveloperWorkspace } from './about/developer-workspace';
import { JourneyTimeline } from './about/journey-timeline';

export function About() {
  const capabilities = [
    {
      icon: Code2,
      title: 'Full-Stack Development',
      description:
        'Building responsive, accessible web platforms using React.js, Next.js, and TypeScript, backed by robust REST APIs in Node.js and NestJS.',
      accent: {
        border: 'border-cyan-500/30 hover:border-cyan-400/60',
        bg: 'bg-cyan-500/10 text-cyan-400',
        glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
      },
    },
    {
      icon: Cpu,
      title: 'AI & Machine Learning',
      description:
        'Exploring Transformer and Diffusion models for image reconstruction in GenVision, geospatial AI in BhuYanthra, and computer vision classification.',
      accent: {
        border: 'border-purple-500/30 hover:border-purple-400/60',
        bg: 'bg-purple-500/10 text-purple-400',
        glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      },
    },
    {
      icon: Layers,
      title: 'Backend & Databases',
      description:
        'Designing relational schemas, performing safe migrations, and engineering transactional services with PostgreSQL, MySQL, and Amazon RDS.',
      accent: {
        border: 'border-blue-500/30 hover:border-blue-400/60',
        bg: 'bg-blue-500/10 text-blue-400',
        glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      },
    },
    {
      icon: Cloud,
      title: 'Cloud & Engineering Systems',
      description:
        'Deploying and orchestrating applications across AWS, Vercel, and modern containerized infrastructure with continuous CI/CD pipelines.',
      accent: {
        border: 'border-emerald-500/30 hover:border-emerald-400/60',
        bg: 'bg-emerald-500/10 text-emerald-400',
        glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      },
    },
  ];

  return (
    <section id="about" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <User className="h-4 w-4" />
            <span>About Me</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A Curious Builder
          </h2>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base leading-relaxed">
            Computer Science &amp; Engineering Student • Full-Stack Developer &amp; AI/ML Enthusiast
          </p>
        </div>

        {/* Main Balanced Two-Column Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* ========================================================= */}
          {/* LEFT SIDE: Narrative, Info Badges & Developer Workstation */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Personal Introduction Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 sm:p-7 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Introduction</span>
              </div>
              <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                I am <span className="text-cyan-400 font-bold">{DISPLAY_NAME}</span> ({FULL_LEGAL_NAME}).
              </p>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {ABOUT_TEXT}
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-1 border-t border-neutral-800/80">
                Focused on bridging web engineering with intelligent systems — designing scalable backend architectures, reactive web user interfaces, and applied machine learning pipelines.
              </p>
            </div>

            {/* Quick Facts Pill Matrix (Location, Degree, Graduation) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase text-neutral-500">Location</span>
                  <span className="block text-xs font-bold text-white truncate" title="Chennai, TN / Kakinada, AP">
                    Chennai / Kakinada
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase text-neutral-500">Degree</span>
                  <span className="block text-xs font-bold text-white truncate" title="B.E. Computer Science and Engineering">
                    B.E. CSE
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase text-neutral-500">Graduation</span>
                  <span className="block text-xs font-bold text-emerald-400">
                    2027 (Expected)
                  </span>
                </div>
              </div>
            </div>

            {/* Cinematic Developer Workspace Visual */}
            <div className="pt-2">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Developer Environment &amp; Real-World Workflow
                </span>
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>ACTIVE</span>
                </span>
              </div>
              <DeveloperWorkspace />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Profile Card & Four Capability Cards          */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* Authentic Profile Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-5 backdrop-blur-md shadow-xl shadow-cyan-950/20 flex items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                <Image
                  src={PROFILE_PHOTO_URL}
                  alt={FULL_LEGAL_NAME}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{AVAILABILITY}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white truncate" title={FULL_LEGAL_NAME}>
                  {FULL_LEGAL_NAME}
                </h3>
                <p className="text-xs text-neutral-300 font-medium truncate">
                  {PROFESSIONAL_TITLE}
                </p>
                <p className="text-[11px] font-mono text-cyan-400">
                  Chennai, Tamil Nadu / Kakinada, Andhra Pradesh
                </p>
              </div>
            </div>

            {/* Four Capability Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 pb-1">
                <span>Core Engineering Capabilities</span>
                <span className="text-cyan-400">4 Focus Areas</span>
              </div>

              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className={`group rounded-2xl border ${cap.accent.border} bg-neutral-900/40 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${cap.accent.glow}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${cap.accent.bg}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                          {cap.title}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Career Objective & Looking For */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                <span>Career Objective</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                &ldquo;{CAREER_OBJECTIVE}&rdquo;
              </p>
              <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-1 text-xs">
                <span className="text-[11px] font-mono text-neutral-500 uppercase">Currently Looking For:</span>
                <span className="text-neutral-200 font-medium">{CURRENTLY_LOOKING_FOR}</span>
              </div>
            </div>

            {/* Interests & Currently Learning Pills */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-2">
                  Key Technical Interests:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MAIN_INTERESTS.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-950/30 px-2 py-0.5 text-[11px] text-cyan-300"
                    >
                      <span>•</span>
                      <span>{interest}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80">
                <span className="block text-[11px] font-mono uppercase tracking-wider text-purple-400 mb-2">
                  Currently Learning &amp; Deepening:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CURRENTLY_LEARNING.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-md border border-purple-500/20 bg-purple-950/30 px-2 py-0.5 text-[11px] text-purple-300"
                    >
                      <span>•</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Download Action Link */}
            <div className="pt-1">
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="true"
                className="group flex items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-950/20 px-4 py-3 text-xs font-bold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span>Download Verified Resume PDF</span>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* TASK 2: Visual Journey Timeline */}
        <JourneyTimeline />
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import {
  User,
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Target,
  MapPin,
  ArrowRight,
  FileText,
} from 'lucide-react';
import {
  FULL_LEGAL_NAME,
  DISPLAY_NAME,
  PROFESSIONAL_TITLE,
  PROFILE_PHOTO_URL,
  ABOUT_TEXT,
  CAREER_OBJECTIVE,
  CURRENTLY_LOOKING_FOR,
  AVAILABILITY,
} from '@/lib/constants';

export function About() {
  const whatIBuild = [
    {
      icon: Code2,
      title: 'Full-Stack Web Platforms',
      description:
        'Engineered responsive, accessible single-page applications and dashboards with Next.js, React, and TypeScript, backed by robust REST architectures.',
      accent: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    },
    {
      icon: Cpu,
      title: 'AI/ML & Intelligent Solutions',
      description:
        'Applying deep learning, Transformer, and Diffusion frameworks to real problems, including satellite image inpainting (GenVision) and geospatial analytics.',
      accent: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    },
    {
      icon: Layers,
      title: 'Backend Systems & Data Architecture',
      description:
        'Designing secure REST APIs, clean service boundaries, and structured schemas using NestJS, Node.js, PostgreSQL, Prisma, and MySQL.',
      accent: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    },
  ];

  return (
    <section
      id="about"
      className="scroll-mt-16 min-h-screen lg:h-screen flex flex-col justify-center py-16 border-b border-neutral-800/80 relative"
    >
      <div className="mx-auto max-w-7xl px-6 w-full">
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <User className="h-4 w-4" />
            <span>About Me</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Engineering with Curiosity &amp; Purpose
          </h2>
        </div>

        {/* Compact, Viewport-Optimized 2-Column Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN: Profile Photograph & Career Objective (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* 1. Actual Profile Photograph Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-5 backdrop-blur-sm flex items-center gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                <Image
                  src={PROFILE_PHOTO_URL}
                  alt={FULL_LEGAL_NAME}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{AVAILABILITY}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white truncate" title={FULL_LEGAL_NAME}>
                  {FULL_LEGAL_NAME}
                </h3>
                <p className="text-xs text-neutral-300 font-medium truncate">
                  {PROFESSIONAL_TITLE}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 pt-0.5">
                  <MapPin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">Kakinada, Andhra Pradesh, India</span>
                </div>
              </div>
            </div>

            {/* 2. Career Objective Card */}
            <div className="flex-1 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <Target className="h-3.5 w-3.5" />
                  <span>Career Objective</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  &ldquo;{CAREER_OBJECTIVE}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-1 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Target Roles
                </span>
                <span className="text-neutral-200 font-medium">
                  {CURRENTLY_LOOKING_FOR}
                </span>
              </div>
            </div>

            {/* Quick Resume Link */}
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="true"
              className="group flex items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-950/20 px-4 py-2.5 text-xs font-bold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-cyan-400" />
                <span>Download Verified Resume PDF</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* RIGHT COLUMN: Personal Introduction & What I Build (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* 3. Short Personal Introduction Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-5 sm:p-6 backdrop-blur-sm space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Introduction</span>
              </div>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
                {ABOUT_TEXT}
              </p>
            </div>

            {/* 4. What I Build (3 Compact Cards) */}
            <div className="space-y-2.5">
              <span className="block text-xs font-mono uppercase tracking-wider text-neutral-400 pb-0.5">
                What I Build
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {whatIBuild.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-900/70"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border ${item.accent}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

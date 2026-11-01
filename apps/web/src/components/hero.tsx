'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowUpRight,
  Send,
  Linkedin,
  Mail,
  ChevronDown,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Code2,
  Eye,
  FileText,
  MapPin,
  Github,
} from 'lucide-react';
import {
  DISPLAY_NAME,
  FULL_LEGAL_NAME,
  PROFESSIONAL_TITLE,
  HERO_HEADLINE,
  HERO_SUBTITLE,
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  GITHUB_URL,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
  AVAILABILITY,
} from '@/lib/constants';

const CharacterScene = dynamic(
  () => import('@/components/three/character-scene').then((mod) => mod.CharacterScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[440px] w-full max-w-[420px] items-center justify-center rounded-2xl border border-cyan-500/20 bg-neutral-950/60 font-mono text-xs text-cyan-400">
        <Sparkles className="mr-2 h-4 w-4 animate-spin text-cyan-400" />
        <span>Initializing 3D Rig...</span>
      </div>
    ),
  }
);

interface HeroProps {
  projectCount: number;
  skillCount: number;
}

export function Hero({ projectCount, skillCount }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'3d' | 'telemetry'>('3d');
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden border-b border-neutral-800/80 pt-24 pb-16"
    >
      {/* Background Lighting Effects */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Bio & Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span>{AVAILABILITY}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>{CONTACT_LOCATION}</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <span className="block font-mono text-sm uppercase tracking-widest text-neutral-400">
                Hi, my name is
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl">
                {DISPLAY_NAME}
              </h1>
              <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 sm:text-3xl xl:text-4xl">
                {PROFESSIONAL_TITLE}
              </h2>
            </div>

            {/* Introduction Paragraph */}
            <div className="space-y-2 max-w-2xl">
              <p className="text-base sm:text-lg font-semibold text-neutral-200">
                {HERO_HEADLINE}
              </p>
              <p className="text-sm text-neutral-300 sm:text-base leading-relaxed">
                {HERO_SUBTITLE}
              </p>
            </div>

            {/* Call to Actions & Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                data-magnetic="true"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                <span>View Projects</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="true"
                className="group inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-5 py-3 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400"
                title="Download Active Resume PDF"
              >
                <FileText className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Download Resume</span>
              </a>

              <a
                href="#contact"
                data-magnetic="true"
                className="group inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-3 text-xs font-bold text-neutral-200 transition hover:border-cyan-500/40 hover:bg-neutral-800 hover:text-white"
              >
                <Send className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Contact Me</span>
              </a>

              <div className="flex items-center gap-2 border-l border-neutral-800 pl-3 ml-1">
                {GITHUB_URL && (
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="true"
                    className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
                    title="GitHub Profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-cyan-400"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={LEETCODE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-amber-400"
                  title="LeetCode Profile"
                >
                  LC
                </a>
                <a
                  href={HACKERRANK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-emerald-400"
                  title="HackerRank Profile"
                >
                  HR
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-cyan-400"
                  title="Send Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Character Experience & Telemetry */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* View Switcher Controls */}
            <div className="mb-3 flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/70 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono transition-all ${
                  activeTab === '3d'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                <span>3D Cyber Rig</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('telemetry')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono transition-all ${
                  activeTab === 'telemetry'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>Telemetry</span>
              </button>
            </div>

            {/* Ambient Lighting Orbs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px] animate-pulse-subtle" />
              <div className="h-60 w-60 rounded-full bg-blue-600/15 blur-[70px]" />
            </div>

            {/* Dynamic View: 3D Scene or Terminal */}
            {activeTab === '3d' ? (
              <div className="w-full flex justify-center">
                <CharacterScene />
              </div>
            ) : (
              /* High-Tech Terminal Card Fallback/View */
              <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/30 bg-neutral-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
                {/* Terminal Window Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                    <span>sidhartha@dev:~</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-[10px] text-cyan-400">LIVE</span>
                  </div>
                </div>

                {/* Terminal Body Content */}
                <div className="font-mono text-xs space-y-3">
                  <div className="text-neutral-400">
                    <span className="text-cyan-400">$</span> fetch profile --engineer &quot;Sidhartha&quot;
                  </div>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 space-y-2 text-neutral-300">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">ROLE:</span>
                      <span className="text-white font-semibold">Full Stack Developer</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">FOCUS:</span>
                      <span className="text-cyan-400">Next.js • NestJS • Python • ML</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">DATABASE:</span>
                      <span className="text-emerald-400">Neon Cloud PostgreSQL</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">SECURITY:</span>
                      <span className="text-purple-400">Zero-Trust BFF + Double CSRF</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-neutral-500 text-[11px]">{`// Active Project Telemetry:`}</span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2.5">
                        <span className="block text-[10px] uppercase font-bold text-cyan-400">GenVision</span>
                        <span className="block text-[10px] text-neutral-400">AI Computer Vision</span>
                      </div>
                      <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-2.5">
                        <span className="block text-[10px] uppercase font-bold text-blue-400">BhuYanthra</span>
                        <span className="block text-[10px] text-neutral-400">Agri Robotics &amp; IoT</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Architecture v7.2 Verified • Ready to Deploy</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verified Statistics Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800/80">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Code2 className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Projects</span>
              </div>
              <span className="text-3xl font-extrabold text-white">{projectCount}</span>
              <span className="block text-xs text-neutral-400 mt-1">Verified in Neon DB</span>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Core Stack</span>
              </div>
              <span className="text-3xl font-extrabold text-white">{skillCount}</span>
              <span className="block text-xs text-neutral-400 mt-1">Technologies Mastered</span>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Type Safety</span>
              </div>
              <span className="text-3xl font-extrabold text-white">100%</span>
              <span className="block text-xs text-neutral-400 mt-1">Strict TypeScript &amp; Python</span>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Cpu className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Architecture</span>
              </div>
              <span className="text-3xl font-extrabold text-white">v7.2</span>
              <span className="block text-xs text-neutral-400 mt-1">Zero-Trust BFF Security</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 flex justify-center">
          <a
            href="#about"
            className="group flex flex-col items-center gap-1.5 text-xs text-neutral-500 hover:text-cyan-400 transition"
            aria-label="Scroll to About section"
          >
            <span className="font-mono text-[11px] tracking-wider uppercase">Explore</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-cyan-400" />
          </a>
        </div>
      </div>
    </section>
  );
}

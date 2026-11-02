'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Sparkles,
  ExternalLink,
  Target,
  Code2,
  Award,
  Radio,
  Gauge,
  CheckCircle2,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  Building2,
  Compass,
} from 'lucide-react';
import {
  LEETCODE_URL,
  HACKERRANK_URL,
} from '@/lib/constants';

interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: number;
  challenge: string;
  recognition: string;
  category: string;
  accent: 'cyan' | 'amber' | 'purple';
  description: string;
  details: {
    focus: string;
    technologies: string[];
    keyTakeaway: string;
    verifiedScope: string;
  };
}

const VERIFIED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-bah-2026',
    title: 'Bharatiya Antariksh Hackathon 2026',
    organization: 'ISRO / Bharatiya Antariksh Hackathon',
    year: 2026,
    challenge: 'Challenge 12 — Temporal Remote Sensing Missing Region Inpainting',
    recognition: 'Selected for Challenge 12',
    category: 'National Hackathon',
    accent: 'cyan',
    description:
      'Selected challenge focused on applying AI/ML-based image inpainting to reconstruct cloud-obscured missing regions in temporal remote sensing imagery.',
    details: {
      focus: 'Satellite image reconstruction, temporal multispectral remote sensing, and cloud severity analysis.',
      technologies: ['Deep Learning', 'Generative Inpainting', 'Sentinel-2', 'ISRO Bhuvan', 'Python'],
      keyTakeaway: 'Formulated generative inpainting pipelines to recover lost land-surface radiometric data without distorting agricultural indices.',
      verifiedScope: 'National space hackathon selection for official Challenge 12 problem statement.',
    },
  },
  {
    id: 'ach-cat-2025',
    title: 'CAT Hackathon',
    organization: 'Caterpillar (CAT Hackathon)',
    year: 2025,
    challenge: 'Smart Rental Platform — Equipment & Fleet Management Dashboard',
    recognition: 'Project Submission / Deployed',
    category: 'Corporate Innovation Hackathon',
    accent: 'amber',
    description:
      'Engineered a comprehensive equipment and fleet management platform to monitor rental equipment, track operations, and visualize real-time business telemetry.',
    details: {
      focus: 'Fleet utilization metrics, machine telematics diagnostics, predictive rental forecasting, and dispatch management.',
      technologies: ['React.js', 'Next.js', 'REST APIs', 'Vercel', 'Tailwind CSS'],
      keyTakeaway: 'Delivered an interactive, production-ready dashboard enabling operators to monitor equipment lifecycles and revenue velocity.',
      verifiedScope: 'End-to-end full-stack prototype submission and live deployment under hackathon constraints.',
    },
  },
  {
    id: 'ach-ncat-2025',
    title: 'National Coding Aptitude Test (NCAT) 2025',
    organization: 'National Coding Aptitude Assessment',
    year: 2025,
    challenge: 'National Level Algorithmic & Coding Aptitude Assessment',
    recognition: 'Ranked 4,237 among 2.1 Lakh+ Participants',
    category: 'Competitive Examination',
    accent: 'purple',
    description:
      'National competitive examination rigorously assessing Data Structures, Algorithmic Analysis, Computational Logic, and problem solving under timed constraints.',
    details: {
      focus: 'Data structures, algorithmic efficiency, time and space complexity, and analytical problem-solving aptitude.',
      technologies: ['Data Structures', 'Algorithms', 'Computational Logic', 'Time & Space Complexity'],
      keyTakeaway: 'Secured an All-India Rank of 4,237 out of 210,000+ examinees across Indian universities (Top ~2% nationally).',
      verifiedScope: 'National competitive benchmark assessment verified by score accreditation.',
    },
  },
];

export function HackathonsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = setTimeout(() => {
      setPrefersReducedMotion(mediaQuery.matches);
    }, 0);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return (
    <section id="hackathons" className="scroll-mt-24 py-20 border-b border-neutral-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[300px] bg-purple-600/5 blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ========================================================= */}
        {/* TASK 2: Achievements & Hackathons Header                   */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3.5 py-1 text-xs font-mono font-bold tracking-widest text-cyan-400 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Trophy className="h-3.5 w-3.5 text-cyan-400" />
            <span>AWARDS &amp; RECOGNITION</span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Hackathons &amp; Technical Achievements
          </h2>

          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-neutral-400">
            Verified national hackathon selections, corporate innovation challenges, and algorithmic aptitude rankings.
          </p>
        </div>

        {/* ========================================================= */}
        {/* Achievements Showcase Cards Grid                          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {VERIFIED_ACHIEVEMENTS.map((ach) => {
            const isExpanded = expandedId === ach.id;
            const isCyan = ach.accent === 'cyan';
            const isAmber = ach.accent === 'amber';
            const isPurple = ach.accent === 'purple';

            return (
              <div
                key={ach.id}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 ${
                  isCyan
                    ? 'border-cyan-500/30 hover:border-cyan-400 shadow-lg shadow-cyan-950/20 hover:shadow-cyan-500/15'
                    : isAmber
                    ? 'border-amber-500/30 hover:border-amber-400 shadow-lg shadow-amber-950/20 hover:shadow-amber-500/15'
                    : 'border-purple-500/30 hover:border-purple-400 shadow-lg shadow-purple-950/20 hover:shadow-purple-500/15'
                }`}
              >
                <div>
                  {/* Top Bar: Icon, Year & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-105 ${
                        isCyan
                          ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : isAmber
                          ? 'border-amber-500/40 bg-amber-500/15 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          : 'border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                      }`}
                    >
                      {isCyan ? (
                        <Radio className="h-6 w-6 animate-pulse" />
                      ) : isAmber ? (
                        <Gauge className="h-6 w-6" />
                      ) : (
                        <Award className="h-6 w-6" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-mono text-neutral-400 border border-neutral-800">
                        {ach.year}
                      </span>
                    </div>
                  </div>

                  {/* Recognition Status Pill */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold border backdrop-blur-md ${
                        isCyan
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                          : isAmber
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      <Target className="h-3 w-3" />
                      <span>{ach.recognition}</span>
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    {ach.title}
                  </h3>

                  <p className="mt-1 text-xs font-mono text-neutral-400">
                    {ach.organization}
                  </p>

                  {/* Short Description */}
                  <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                    {ach.description}
                  </p>

                  {/* Inline Expanded Drawer */}
                  {isExpanded && (
                    <div
                      className="mt-4 pt-4 border-t border-neutral-800/80 space-y-3 animate-fadeIn"
                      style={{
                        animationDuration: prefersReducedMotion ? '0s' : '250ms',
                      }}
                    >
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                          Technical Focus:
                        </span>
                        <p className="text-xs text-neutral-200 mt-0.5">
                          {ach.details.focus}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                          Technologies:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ach.details.technologies.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-neutral-950 px-2 py-0.5 text-[10px] font-mono text-neutral-300 border border-neutral-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-2.5">
                        <span className="text-[11px] font-mono text-cyan-300 font-semibold block mb-0.5">
                          Verified Key Takeaway:
                        </span>
                        <p className="text-[11px] text-neutral-300 leading-normal">
                          {ach.details.keyTakeaway}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : ach.id)}
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAchievement(ach)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold group/sub"
                    title="Inspect Full Verification"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TASK 3: Interactive Coding Profiles Showcase               */}
        {/* ========================================================= */}
        <div id="coding-profiles" className="scroll-mt-24 pt-12 border-t border-neutral-800/80">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1 text-xs font-mono font-bold tracking-widest text-purple-400 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Code2 className="h-3.5 w-3.5 text-purple-400" />
              <span>ALGORITHMIC RIGOR</span>
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Coding Profiles &amp; Problem Solving
            </h3>

            <p className="mt-2 max-w-xl text-xs sm:text-sm text-neutral-400">
              Active algorithmic problem solving, core computer science principles, and verified competitive handles.
            </p>
          </div>

          {/* Two Interactive Platform Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* LeetCode Profile Panel */}
            <a
              href={LEETCODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFA116]/80 hover:shadow-[0_0_35px_rgba(255,161,22,0.22)]"
            >
              <div>
                {/* Header: Brand Icon & Handle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* LeetCode Signature Glyphed Badge */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFA116]/40 bg-[#FFA116]/10 text-[#FFA116] shadow-[0_0_15px_rgba(255,161,22,0.2)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                        <path d="M16 4l-8 8 8 8" stroke="#FFA116" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 12h10" stroke="#FFA116" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#FFA116] transition-colors">
                        LeetCode
                      </h4>
                      <span className="font-mono text-xs text-neutral-400">
                        @WPETOvKlww
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-mono text-[#FFA116] border border-[#FFA116]/30">
                    Active Solver
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Focusing on Data Structures, dynamic programming, tree traversals, and algorithmic problem solving in Python and Java.
                </p>

                {/* Focus Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['Data Structures', 'Algorithms', 'Complexity Analysis', 'Python'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-neutral-800 bg-neutral-950/80 px-2.5 py-0.5 text-[11px] font-mono text-neutral-300 group-hover:border-[#FFA116]/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 group-hover:text-white transition">
                  Inspect Problem Solves
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFA116]/40 bg-[#FFA116]/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-[#FFA116] group-hover:bg-[#FFA116]/20 transition-all">
                  <span>Visit Profile</span>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </a>

            {/* HackerRank Profile Panel */}
            <a
              href={HACKERRANK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#00EA64]/80 hover:shadow-[0_0_35px_rgba(0,234,100,0.22)]"
            >
              <div>
                {/* Header: Brand Icon & Handle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* HackerRank Signature Glyphed Badge */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00EA64]/40 bg-[#00EA64]/10 text-[#00EA64] shadow-[0_0_15px_rgba(0,234,100,0.2)]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                        <rect x="2" y="2" width="20" height="20" rx="5" fill="#00EA64" fillOpacity="0.1" stroke="#00EA64" strokeWidth="1.5" />
                        <path d="M7 6v12M17 6v12M7 12h10" stroke="#00EA64" strokeWidth="2.5" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#00EA64] transition-colors">
                        HackerRank
                      </h4>
                      <span className="font-mono text-xs text-neutral-400">
                        @madhavarapusidh1
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-mono text-[#00EA64] border border-[#00EA64]/30">
                    Proficiency Tracks
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Proficiency tracks in core languages, problem solving modules, SQL querying, and fundamental coding challenges.
                </p>

                {/* Focus Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['Problem Solving', 'Python Proficiency', 'Core Algorithms', 'SQL'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-neutral-800 bg-neutral-950/80 px-2.5 py-0.5 text-[11px] font-mono text-neutral-300 group-hover:border-[#00EA64]/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 group-hover:text-white transition">
                  Inspect Badges &amp; Modules
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#00EA64]/40 bg-[#00EA64]/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-[#00EA64] group-hover:bg-[#00EA64]/20 transition-all">
                  <span>Visit Profile</span>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Full Modal Achievement Inspector                           */}
        {/* ========================================================= */}
        {selectedAchievement && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-ach-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedAchievement(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/40 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-5 right-5 rounded-full border border-neutral-700/80 bg-neutral-950/80 p-2 text-neutral-300 hover:text-white hover:border-cyan-400 transition"
                aria-label="Close achievement modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/40">
                      {selectedAchievement.category}
                    </span>
                    <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-mono text-neutral-300">
                      {selectedAchievement.year}
                    </span>
                  </div>

                  <h3 id="modal-ach-title" className="text-2xl font-bold text-white">
                    {selectedAchievement.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-cyan-400">
                    {selectedAchievement.organization}
                  </p>
                </div>

                {/* Recognition Badge Highlight */}
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                    Recognition Standing
                  </span>
                  <p className="text-base font-bold text-white">
                    {selectedAchievement.recognition}
                  </p>
                  <p className="text-xs text-neutral-300 mt-1">
                    {selectedAchievement.details.verifiedScope}
                  </p>
                </div>

                {/* Problem & Overview */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Challenge &amp; Problem Overview
                  </h4>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                </div>

                {/* Focus Areas & Technologies */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Technologies &amp; Domain Concepts
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAchievement.details.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-mono text-neutral-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified Takeaway */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Engineering Takeaway &amp; Impact
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {selectedAchievement.details.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

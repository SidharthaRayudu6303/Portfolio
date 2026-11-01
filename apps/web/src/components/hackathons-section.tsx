'use client';

import React from 'react';
import {
  Trophy,
  Calendar,
  Sparkles,
  ExternalLink,
  Target,
  Code,
  Terminal,
} from 'lucide-react';
import {
  HACKATHONS_DATA,
  LEETCODE_URL,
  HACKERRANK_URL,
} from '@/lib/constants';

export function HackathonsSection() {
  return (
    <section id="hackathons" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Trophy className="h-4 w-4" />
              <span>Competitions &amp; Problem Solving</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hackathons &amp; Technical Achievements
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              National hackathon challenges, AI problem solving, and verified competitive platforms.
            </p>
          </div>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HACKATHONS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-cyan-500/40 hover:bg-neutral-850/60"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-mono font-medium text-cyan-300">
                    <Target className="h-3 w-3" />
                    <span>{item.status}</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                  {item.title}
                </h3>
                <h4 className="mt-1 text-xs font-mono text-neutral-300">
                  {item.challenge}
                </h4>
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Verified Challenge Participation</span>
                <span className="text-cyan-400 font-semibold">{item.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Coding Practice Section Header & Cards */}
        <div id="coding-profiles" className="scroll-mt-24 mt-16 pt-12 border-t border-neutral-800/60">
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Code className="h-4 w-4" />
              <span>Algorithmic Practice</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white">
              Coding Profiles &amp; Problem Solving
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Active exploration of Data Structures and Algorithms through verified coding platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {/* LeetCode Card */}
            <a
              href={LEETCODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-amber-500/40 hover:bg-neutral-850/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-sm">
                  LC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                    LeetCode Profile
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono">
                    @WPETOvKlww
                  </span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-neutral-500 group-hover:text-amber-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* HackerRank Card */}
            <a
              href={HACKERRANK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-emerald-500/40 hover:bg-neutral-850/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm">
                  HR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                    HackerRank Profile
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono">
                    @madhavarapusidh1
                  </span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-neutral-500 group-hover:text-emerald-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


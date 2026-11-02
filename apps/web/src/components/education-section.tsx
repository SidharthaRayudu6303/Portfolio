'use client';

import React from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Sparkles,
  School,
  CheckCircle2,
} from 'lucide-react';
import { EDUCATION_DATA, INTERMEDIATE_DATA } from '@/lib/constants';

export function EducationSection() {
  const coreCoursework = [
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Machine Learning',
    'Software Engineering',
  ];

  return (
    <section
      id="education"
      className="scroll-mt-16 min-h-screen lg:h-screen flex flex-col justify-center py-16 border-b border-neutral-800/80 relative"
    >
      <div className="mx-auto max-w-7xl px-6 w-full">
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Foundation</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Education &amp; Qualifications
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            University curriculum in computer science fundamentals, systems architecture, and mathematical foundations.
          </p>
        </div>

        {/* Compact 2-Card Layout (Undergrad + Intermediate) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* 1. Primary Undergrad Card: Sathyabama Institute of Science and Technology (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-neutral-900/80 to-neutral-950/80 p-6 sm:p-7 backdrop-blur-md relative overflow-hidden flex flex-col justify-between space-y-5 shadow-xl shadow-cyan-950/20">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 h-44 w-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300">
                  <Sparkles className="h-3 w-3" />
                  <span>Bachelor of Engineering (B.E.)</span>
                </span>

                <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                  <span>CGPA:</span>
                  <span className="text-white">{EDUCATION_DATA.cgpa}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {EDUCATION_DATA.institution}
                </h3>
                <p className="text-sm font-semibold text-cyan-400 font-mono mt-0.5">
                  {EDUCATION_DATA.department}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{EDUCATION_DATA.startYear} – {EDUCATION_DATA.expectedGraduation} (Expected)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Chennai, Tamil Nadu</span>
                </span>
              </div>
            </div>

            {/* Core Coursework Badges */}
            <div className="relative z-10 pt-3 border-t border-neutral-800/80 space-y-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Core Academic Coursework:
              </span>
              <div className="flex flex-wrap gap-2">
                {coreCoursework.map((course) => (
                  <span
                    key={course}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] font-medium text-neutral-300"
                  >
                    <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                    <span>{course}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Higher Secondary / Intermediate Card: Narayana Junior College (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-6 sm:p-7 backdrop-blur-md relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1 text-xs font-mono text-neutral-300">
                  <School className="h-3 w-3 text-cyan-400" />
                  <span>Intermediate (Class XII)</span>
                </span>

                <div className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold text-cyan-400">
                  <span>Score:</span>
                  <span className="text-white font-extrabold">{INTERMEDIATE_DATA.percentage}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {INTERMEDIATE_DATA.institution}
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">
                  MPC Stream (Mathematics, Physics, Chemistry)
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-mono text-neutral-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{INTERMEDIATE_DATA.years}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{INTERMEDIATE_DATA.location}</span>
                </span>
                <span className="text-[11px] text-neutral-500">
                  {INTERMEDIATE_DATA.board}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800/80">
              <p className="text-xs text-neutral-300 leading-relaxed">
                Strong analytical foundation in advanced mathematics, classical mechanics, and logical problem solving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

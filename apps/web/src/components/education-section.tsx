'use client';

import React from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { EDUCATION_DATA } from '@/lib/constants';

export function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Background</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Education &amp; Academic Foundation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Rigorous foundations in computer science theory, algorithms, distributed systems, and applied AI.
          </p>
        </div>

        {/* Education Main Card */}
        <div className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-neutral-800">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-mono font-medium text-cyan-300">
                <Sparkles className="h-3 w-3" />
                <span>B.E. Computer Science and Engineering</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white pt-1">
                {EDUCATION_DATA.institution}
              </h3>
              <p className="text-sm text-neutral-300 font-medium">
                {EDUCATION_DATA.department}
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>{EDUCATION_DATA.startYear} – {EDUCATION_DATA.expectedGraduation} (Expected)</span>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-bold">
                CGPA: {EDUCATION_DATA.cgpa}
              </div>
            </div>
          </div>

          {/* Academic Achievement Callout */}
          <div className="mt-6 rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Award className="h-4 w-4" />
              <span>Key Academic Achievement</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              <strong className="text-purple-300 font-semibold">{EDUCATION_DATA.academicAchievement}</strong>
            </p>
          </div>

          {/* Relevant Coursework */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-3">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>Relevant Coursework</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EDUCATION_DATA.coursework.map((course) => (
                <div
                  key={course}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/80 px-3 py-1.5 text-xs text-neutral-300 transition hover:border-cyan-500/40 hover:text-white"
                >
                  <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import React from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building,
  School,
  Compass,
} from 'lucide-react';
import { EDUCATION_DATA, INTERMEDIATE_DATA } from '@/lib/constants';

export function EducationSection() {
  const courseworkCategories = [
    {
      category: 'Data Structures & Algorithms',
      items: ['Data Structures and Algorithms', 'Object-Oriented Programming', 'Algorithm Analysis'],
      accent: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/20',
    },
    {
      category: 'Systems & Architecture',
      items: ['Database Management Systems', 'Operating Systems', 'Computer Networks'],
      accent: 'border-blue-500/30 text-blue-300 bg-blue-950/20',
    },
    {
      category: 'Applied AI & Engineering',
      items: ['Machine Learning', 'Artificial Intelligence', 'Software Engineering'],
      accent: 'border-purple-500/30 text-purple-300 bg-purple-950/20',
    },
  ];

  const academicTrajectory = [
    { year: 'Year 1 (2023–24)', focus: 'Core DSA, Object-Oriented Design, Discrete Math' },
    { year: 'Year 2 (2024–25)', focus: 'DBMS, OS, Computer Networks, Modern Web Architectures' },
    { year: 'Year 3 (2025–26)', focus: 'Applied AI/ML, Satellite Inpainting, ISRO BAH Selection' },
    { year: 'Year 4 (2026–27)', focus: 'Advanced Distributed Systems, Production Engineering' },
  ];

  return (
    <section id="education" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Background</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Education &amp; Academic Foundation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Rigorous university curriculum in computer science theory, algorithms, relational databases, distributed systems, and applied artificial intelligence.
          </p>
        </div>

        {/* Primary Education Card: Sathyabama University */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950/90 p-6 sm:p-9 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-cyan-950/20">
          {/* Subtle Cyber Glow Halos */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row: Degree, Institution, Dates, CGPA */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-8 border-b border-neutral-800/80">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Bachelor of Engineering (B.E.)</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-950/80 px-2.5 py-1 text-xs font-mono text-neutral-400">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  <span>Chennai, Tamil Nadu</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                {EDUCATION_DATA.institution}
              </h3>
              <p className="text-sm sm:text-base text-cyan-400 font-semibold font-mono">
                {EDUCATION_DATA.department}
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 text-xs font-mono">
              <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/70 px-3.5 py-2 text-neutral-300">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>{EDUCATION_DATA.startYear} – {EDUCATION_DATA.expectedGraduation} (Expected)</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span>CGPA:</span>
                <span className="text-sm text-white font-mono">{EDUCATION_DATA.cgpa}</span>
              </div>
            </div>
          </div>

          {/* Academic Trajectory Timeline Progression */}
          <div className="relative z-10 mt-8 pt-2">
            <span className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Academic Curricular Progression:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {academicTrajectory.map((step, idx) => (
                <div
                  key={step.year}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4 transition-all duration-300 hover:border-cyan-500/30 hover:bg-neutral-900/60"
                >
                  <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold">{step.year}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-snug">
                    {step.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Achievement Callout (Bharatiya Antariksh Hackathon '26) */}
          <div className="relative z-10 mt-8 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="h-4 w-4" />
              <span>National Hackathon Challenge Selection</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              <strong className="text-purple-300 font-semibold">{EDUCATION_DATA.academicAchievement}</strong>
            </p>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              National space hackathon organized by ISRO/IN-SPACe: Selected for Challenge 12 targeting AI/ML-driven temporal inpainting across multispectral Earth observation satellite imagery.
            </p>
          </div>

          {/* Relevant Coursework Tag Clusters */}
          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-4">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Academic Coursework Clusters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courseworkCategories.map((group) => (
                <div
                  key={group.category}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 space-y-2.5"
                >
                  <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    {group.category}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {group.items.map((course) => (
                      <div
                        key={course}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${group.accent}`}
                      >
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intermediate / Higher Secondary Education Card */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-neutral-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800/60 px-2.5 py-0.5 text-[11px] font-mono text-neutral-300">
                <School className="h-3 w-3 text-cyan-400" />
                <span>{INTERMEDIATE_DATA.board}</span>
              </span>
              <span className="text-[11px] font-mono text-neutral-400">MPC Stream</span>
            </div>
            <h4 className="text-lg font-bold text-white pt-1">
              {INTERMEDIATE_DATA.institution}
            </h4>
            <p className="text-xs text-neutral-400">
              {INTERMEDIATE_DATA.location} • {INTERMEDIATE_DATA.years}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-cyan-400 font-bold font-mono text-xs sm:text-sm">
              <span>Score: </span>
              <span className="text-white font-extrabold">{INTERMEDIATE_DATA.percentage}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

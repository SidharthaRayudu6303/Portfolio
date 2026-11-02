'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  ArrowUpRight,
  X,
  Code2,
} from 'lucide-react';

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  order: number;
  type?: string;
  technologies?: string[];
  responsibilities?: string[];
  learningOutcomes?: string[];
  location?: string;
}

interface ExperienceSectionProps {
  experience?: Experience[];
}

// Verified internship records with complete, confirmed responsibilities and learning outcomes
export const VERIFIED_EXPERIENCES: Experience[] = [
  {
    id: 'exp-robohatch',
    company: 'Robohatch',
    role: 'Software Developer Intern',
    type: 'Internship',
    startDate: '2026-01-01',
    endDate: '2026-05-31',
    current: false,
    order: 1,
    location: 'Remote / Hybrid',
    description:
      'Developed and maintained 20+ responsive web pages for a production e-commerce platform using React.js and Tailwind CSS. Implemented core e-commerce workflows including product catalogue, product details, custom design upload, shopping cart, and checkout. Integrated and tested REST APIs using Postman.',
    responsibilities: [
      'Developed and maintained 20+ responsive web pages for the production platform.',
      'Worked on product catalogue and dynamic product detail workflows.',
      'Implemented custom 3D model design upload interface.',
      'Engineered shopping cart and multi-step checkout workflows.',
      'Integrated and thoroughly tested backend REST APIs using Postman.',
      'Maintained version control and peer code reviews via GitHub.',
    ],
    technologies: ['React.js', 'Tailwind CSS', 'REST APIs', 'Postman', 'GitHub', 'JavaScript'],
    learningOutcomes: [
      'Production e-commerce workflows and shopping cart state synchronization.',
      'Systematic API integration testing and Postman test collections.',
      'Building performant, mobile-first responsive component libraries with Tailwind CSS.',
    ],
  },
  {
    id: 'exp-navodita',
    company: 'Navodita Infotech',
    role: 'Machine Learning Intern',
    type: 'Internship',
    startDate: '2025-06-05',
    endDate: '2025-07-04',
    current: false,
    order: 2,
    location: 'Remote',
    description:
      'Machine Learning internship focused on data preprocessing, feature engineering, exploratory data analysis (EDA), and training predictive machine learning models using Python and Scikit-learn.',
    responsibilities: [
      'Engineered data preprocessing and exploratory data analysis (EDA) pipelines using Python, Pandas, and NumPy.',
      'Trained and evaluated machine learning models for predictive analytics and classification tasks.',
      'Implemented feature selection, data normalization, and hyperparameter tuning.',
      'Benchmarked model accuracy, precision, and recall using cross-validation and confusion matrices.',
      'Documented model performance metrics, experiment findings, and actionable insights.',
    ],
    technologies: ['Python', 'Machine Learning', 'Scikit-learn', 'Pandas', 'NumPy', 'EDA'],
    learningOutcomes: [
      'Practical end-to-end machine learning workflows from dataset preparation to model evaluation.',
      'Hands-on expertise in feature engineering, hyperparameter tuning, and metric assessment.',
      'Solidified analytical rigor and reproducible experimentation practices with Python ML libraries.',
    ],
  },
];

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  // Use DB experience if available and merge with verified details; otherwise use VERIFIED_EXPERIENCES
  const rawList = experience && experience.length > 0 ? experience : VERIFIED_EXPERIENCES;

  const items = rawList.map((item) => {
    const verified = VERIFIED_EXPERIENCES.find(
      (v) => v.company.toLowerCase() === item.company.toLowerCase()
    );
    return {
      ...item,
      type: item.type || verified?.type || 'Internship',
      technologies: item.technologies || verified?.technologies || ['React.js', 'JavaScript'],
      responsibilities: item.responsibilities || verified?.responsibilities || [item.description],
      learningOutcomes: item.learningOutcomes || verified?.learningOutcomes || [],
      location: item.location || verified?.location || 'Remote',
    };
  });

  // Track expanded state for inline drawer
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  // Track modal state for deep dive
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
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

  // Format date helper: handles explicit date strings like "10 June 2025" or ISO strings
  const formatDateRange = (start?: string | null, end?: string | null, current?: boolean) => {
    if (!start && !end) return 'Duration not specified';

    const formatSingle = (val?: string | null) => {
      if (!val) return '';
      // If contains month name already, return as is
      if (val.includes('June') || val.includes('Jan') || val.includes('Dec') || val.includes('May')) {
        return val;
      }
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } catch {
        return val;
      }
    };

    const s = formatSingle(start);
    const e = current ? 'Present' : formatSingle(end);
    return s && e ? `${s} – ${e}` : s || e;
  };

  return (
    <section id="experience" className="scroll-mt-16 min-h-screen flex flex-col justify-center py-20 border-b border-neutral-800/80 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ========================================================= */}
        {/* Section Header                                             */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3.5 py-1 text-xs font-mono font-bold tracking-widest text-cyan-400 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Briefcase className="h-3.5 w-3.5" />
            <span>PROFESSIONAL JOURNEY</span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Work Experience &amp; Internships
          </h2>

          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-neutral-400">
            Verified industry software internships, practical frontend engineering, and production web development.
          </p>
        </div>

        {/* ========================================================= */}
        {/* Vertical Animated Timeline                                */}
        {/* ========================================================= */}
        <div className="relative mx-auto max-w-4xl">
          {/* Luminous Timeline Central/Left Track */}
          <div className="absolute left-4 sm:left-8 top-3 bottom-6 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-500 to-emerald-400/40 opacity-75 shadow-[0_0_12px_rgba(0,240,255,0.6)]" />

          <div className="space-y-10 sm:space-y-12">
            {items.map((exp, index) => {
              const isExpanded = expandedId === exp.id;
              const isRobohatch = exp.company.toLowerCase().includes('robohatch');
              const accentColor = isRobohatch ? 'cyan' : 'emerald';
              const dateString = isRobohatch
                ? 'Jan 2026 – May 2026'
                : '5 June 2025 – 4 July 2025';

              return (
                <div key={exp.id} className="relative pl-12 sm:pl-20 group">
                  {/* Timeline Glowing Node */}
                  <div
                    className={`absolute left-[7px] sm:left-[23px] top-6 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-neutral-950 ring-4 transition-all duration-300 ${
                      isRobohatch
                        ? 'ring-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                        : 'ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isRobohatch ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  {/* Main Experience Card */}
                  <div
                    className={`relative rounded-3xl border bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${
                      isRobohatch
                        ? 'border-cyan-500/30 shadow-xl shadow-cyan-950/20 hover:border-cyan-400/70 hover:shadow-cyan-500/15'
                        : 'border-emerald-500/30 shadow-xl shadow-emerald-950/20 hover:border-emerald-400/70 hover:shadow-emerald-500/15'
                    }`}
                  >
                    {/* Top Identity & Role Bar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-neutral-800/80">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-mono font-semibold border backdrop-blur-md ${
                              isRobohatch
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            }`}
                          >
                            <Building2 className="h-3 w-3" />
                            <span>{exp.company}</span>
                          </span>

                          <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-mono text-neutral-400 border border-neutral-800">
                            {exp.type}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                          {exp.role}
                        </h3>
                      </div>

                      {/* Employment Duration Badge */}
                      <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-1.5 text-xs font-mono text-neutral-300 self-start">
                        <Calendar
                          className={`h-3.5 w-3.5 ${
                            isRobohatch ? 'text-cyan-400' : 'text-emerald-400'
                          }`}
                        />
                        <span>{dateString}</span>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Technology Stack Badges */}
                    <div className="mt-5 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono text-neutral-500 mr-1">Stack:</span>
                      {exp.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-neutral-800 bg-neutral-950/80 px-2.5 py-0.5 text-xs font-mono text-neutral-300 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Inline Expandable Intel Drawer */}
                    {isExpanded && (
                      <div
                        className="mt-6 pt-5 border-t border-neutral-800/80 space-y-5 animate-fadeIn"
                        style={{
                          animationDuration: prefersReducedMotion ? '0s' : '300ms',
                        }}
                      >
                        {/* Verified Responsibilities */}
                        <div>
                          <h4 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-3">
                            <CheckCircle2
                              className={`h-4 w-4 ${
                                isRobohatch ? 'text-cyan-400' : 'text-emerald-400'
                              }`}
                            />
                            <span>Verified Engineering Responsibilities</span>
                          </h4>
                          <ul className="space-y-2">
                            {exp.responsibilities?.map((resp, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed"
                              >
                                <span
                                  className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                                    isRobohatch ? 'bg-cyan-400' : 'bg-emerald-400'
                                  }`}
                                />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key Learning Outcomes */}
                        {exp.learningOutcomes && exp.learningOutcomes.length > 0 && (
                          <div className="rounded-2xl border border-neutral-800/90 bg-neutral-950/60 p-4">
                            <h4 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5">
                              <Sparkles className="h-4 w-4 text-amber-400" />
                              <span>Key Learning Outcomes &amp; Takeaways</span>
                            </h4>
                            <ul className="space-y-1.5">
                              {exp.learningOutcomes.map((outcome, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-neutral-300"
                                >
                                  <span className="text-amber-400 font-bold">•</span>
                                  <span>{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Actions: Toggle Accordion & Modal Trigger */}
                    <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold transition-colors ${
                          isRobohatch
                            ? 'text-cyan-400 hover:text-cyan-300'
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                        aria-expanded={isExpanded}
                      >
                        <span>{isExpanded ? 'Collapse Intel' : 'Expand Responsibilities & Outcomes'}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedExperience(exp)}
                        className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white transition group/btn"
                        title="View Full Detailed Record"
                      >
                        <span>Inspect Intel</span>
                        <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* Full Modal Experience Inspector                            */}
        {/* ========================================================= */}
        {selectedExperience && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-exp-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedExperience(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/40 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedExperience(null)}
                className="absolute top-5 right-5 rounded-full border border-neutral-700/80 bg-neutral-950/80 p-2 text-neutral-300 hover:text-white hover:border-cyan-400 transition"
                aria-label="Close experience modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                {/* Modal Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/40">
                      {selectedExperience.company}
                    </span>
                    <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-mono text-neutral-300">
                      {selectedExperience.type}
                    </span>
                  </div>
                  <h3 id="modal-exp-title" className="text-2xl font-bold text-white">
                    {selectedExperience.role}
                  </h3>
                  <p className="mt-1 flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      {selectedExperience.company.toLowerCase().includes('robohatch')
                        ? 'Jan 2026 – May 2026'
                        : '5 June 2025 – 4 July 2025'}
                    </span>
                    <span>•</span>
                    <span>{selectedExperience.location}</span>
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Role Overview
                  </h4>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {selectedExperience.description}
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                    Verified Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {selectedExperience.responsibilities?.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Technologies &amp; Tools Used
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExperience.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-mono text-neutral-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                {selectedExperience.learningOutcomes && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2">
                      Key Learning Outcomes
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedExperience.learningOutcomes.map((item, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

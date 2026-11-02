'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { SRLogo } from '@/components/brand/sr-logo';
import {
  PythonLogo,
  ReactLogo,
  TypeScriptLogo,
  JavaScriptLogo,
  NextjsLogo,
  NodejsLogo,
  NestjsLogo,
  PostgreSQLLogo,
  GitLogo,
  DockerLogo,
  MongoDBLogo,
  TailwindLogo,
  OpenCVLogo,
  LinuxLogo,
  RestApiLogo,
} from './tech-logos';

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export interface TechPlanet {
  id: string;
  name: string;
  category: string;
  orbit: 1 | 2 | 3;
  angle: number; // in degrees (0 to 360)
  color: string;
  accentBg: string;
  renderLogo: (className?: string) => React.ReactNode;
  description: string;
  appliedIn: string;
}

export const ORBITAL_PLANETS: TechPlanet[] = [
  // --- Orbit 1: Foundational Core (Radius 90px, 5 planets) ---
  {
    id: 'python',
    name: 'Python',
    category: 'Programming Languages',
    orbit: 1,
    angle: 0,
    color: '#38bdf8',
    accentBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    renderLogo: (cls) => <PythonLogo className={cls} />,
    description: 'Core language for machine learning pipelines, OpenCV computer vision, and backend automation.',
    appliedIn: 'GenVision inpainting framework, CodeTantra certified coursework, and NCAT assessment.',
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend Development',
    orbit: 1,
    angle: 72,
    color: '#00f0ff',
    accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    renderLogo: (cls) => <ReactLogo className={cls} />,
    description: 'Declarative component architecture for high-performance interactive single-page applications.',
    appliedIn: 'Robohatch e-commerce production platform (20+ pages), SmartDonum, and Smart Rental Platform.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Programming Languages',
    orbit: 1,
    angle: 144,
    color: '#3b82f6',
    accentBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    renderLogo: (cls) => <TypeScriptLogo className={cls} />,
    description: 'Strict type safety across frontend components, BFF contracts, and backend APIs.',
    appliedIn: 'Full-stack monorepo contracts (@portfolio/types), Next.js App Router, and NestJS services.',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend & APIs',
    orbit: 1,
    angle: 216,
    color: '#22c55e',
    accentBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    renderLogo: (cls) => <NodejsLogo className={cls} />,
    description: 'Event-driven, asynchronous JavaScript runtime for high-throughput backend services and APIs.',
    appliedIn: 'SmartDonum REST backend, authentication handlers, and asynchronous data ingestion pipelines.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Databases & Storage',
    orbit: 1,
    angle: 288,
    color: '#60a5fa',
    accentBg: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
    renderLogo: (cls) => <PostgreSQLLogo className={cls} />,
    description: 'Enterprise relational database powering Neon cloud persistence and transactional consistency.',
    appliedIn: 'Neon serverless cloud persistence, Prisma migrations, and relational data modeling.',
  },

  // --- Orbit 2: Frameworks & Modern Stack (Radius 155px, 5 planets) ---
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend Development',
    orbit: 2,
    angle: 36,
    color: '#ffffff',
    accentBg: 'bg-neutral-800 text-white border-cyan-500/30',
    renderLogo: (cls) => <NextjsLogo className={cls} />,
    description: 'Full-stack React framework with App Router, server-rendered components, and BFF architecture.',
    appliedIn: 'Sidhartha Rayudu Portfolio, SSR optimizations, Turbopack, and Vercel edge deployment.',
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend & APIs',
    orbit: 2,
    angle: 108,
    color: '#e11d48',
    accentBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    renderLogo: (cls) => <NestjsLogo className={cls} />,
    description: 'Enterprise modular backend architecture with dependency injection, guards, and DTO validation.',
    appliedIn: 'Portfolio backend on Render, rate limiting guards, and JWT authentication services.',
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'Programming Languages',
    orbit: 2,
    angle: 180,
    color: '#facc15',
    accentBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    renderLogo: (cls) => <JavaScriptLogo className={cls} />,
    description: 'Modern asynchronous programming, DOM lifecycle manipulation, Closures, and Web APIs.',
    appliedIn: 'Interactive portfolio canvas, Three.js custom render loops, and client-side state engines.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend Development',
    orbit: 2,
    angle: 252,
    color: '#38bdf8',
    accentBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    renderLogo: (cls) => <TailwindLogo className={cls} />,
    description: 'Utility-first modern responsive CSS styling, micro-interactions, and cyber design systems.',
    appliedIn: 'Robohatch e-commerce production UI, responsive mobile viewports, and dark theme palette.',
  },
  {
    id: 'restapi',
    name: 'RESTful APIs',
    category: 'Backend & APIs',
    orbit: 2,
    angle: 324,
    color: '#00f0ff',
    accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    renderLogo: (cls) => <RestApiLogo className={cls} />,
    description: 'Stateless API architecture, structured JSON schemas, HTTP status codes, and Postman testing.',
    appliedIn: 'Robohatch API integrations, Smart Rental fleet telemetry, and Autism Screening ingestion.',
  },

  // --- Orbit 3: Cloud, AI & Infrastructure (Radius 225px, 5 planets) ---
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Developer Tools',
    orbit: 3,
    angle: 20,
    color: '#f97316',
    accentBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    renderLogo: (cls) => <GitLogo className={cls} />,
    description: 'Distributed version control, branch management, collaborative workflows, and GitHub Actions.',
    appliedIn: 'Production monorepo versioning, team collaboration at Robohatch, and open-source projects.',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Cloud & Infrastructure',
    orbit: 3,
    angle: 92,
    color: '#0284c7',
    accentBg: 'bg-sky-600/20 text-sky-300 border-sky-500/40',
    renderLogo: (cls) => <DockerLogo className={cls} />,
    description: 'Containerization, reproducible multi-stage builds, and microservices runtime environments.',
    appliedIn: 'Local development service isolation, backend containerization, and Render deployment.',
  },
  {
    id: 'opencv',
    name: 'OpenCV & Computer Vision',
    category: 'AI & Machine Learning',
    orbit: 3,
    angle: 164,
    color: '#ef4444',
    accentBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    renderLogo: (cls) => <OpenCVLogo className={cls} />,
    description: 'Image processing, spatial filtering, facial landmark detection, and video stream analysis.',
    appliedIn: 'Autism Screening video observational analysis and GenVision satellite spectral processing.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Databases & Storage',
    orbit: 3,
    angle: 236,
    color: '#22c55e',
    accentBg: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
    renderLogo: (cls) => <MongoDBLogo className={cls} />,
    description: 'NoSQL document database, dynamic JSON schemas, indexing, and aggregation pipelines.',
    appliedIn: 'MongoDB Basics certified credential and unstructured telemetry logging.',
  },
  {
    id: 'linux',
    name: 'Linux / Bash',
    category: 'Developer Tools',
    orbit: 3,
    angle: 308,
    color: '#eab308',
    accentBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    renderLogo: (cls) => <LinuxLogo className={cls} />,
    description: 'Unix shell scripting, process management, file permissions, and cloud server administration.',
    appliedIn: 'Render cloud server operations, automation shell scripts, and terminal development.',
  },
];

interface OrbitalSystemProps {
  selectedPlanet: TechPlanet | null;
  onSelectPlanet: (planet: TechPlanet | null) => void;
  highlightedCategory?: string | null;
}

export function OrbitalSystem({
  selectedPlanet,
  onSelectPlanet,
  highlightedCategory,
}: OrbitalSystemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Expansive, wide orbit radii (in pixels) for an open 500x500 stage
  const orbitRadii = {
    1: 90,
    2: 155,
    3: 225,
  };

  const orbit1Planets = useMemo(() => ORBITAL_PLANETS.filter((p) => p.orbit === 1), []);
  const orbit2Planets = useMemo(() => ORBITAL_PLANETS.filter((p) => p.orbit === 2), []);
  const orbit3Planets = useMemo(() => ORBITAL_PLANETS.filter((p) => p.orbit === 3), []);

  const isPaused = isHovering;

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 select-none">
      {/* Expansive, Unboxed Orbital System Space */}
      <div
        className="relative h-[340px] w-[340px] sm:h-[450px] sm:w-[450px] lg:h-[510px] lg:w-[510px] flex items-center justify-center scale-[0.78] sm:scale-[0.92] lg:scale-100 transition-transform origin-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Soft Ambient Cyber Glow Bloom */}
        <div className="absolute h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute h-80 w-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

        {/* ============================================================== */}
        {/* ORBITAL PATHS (Continuous concentric guidelines)              */}
        {/* ============================================================== */}
        {/* Orbit 1 Ring (Inner ~90px radius) */}
        <div
          className={`absolute rounded-full border border-dashed transition-colors duration-300 pointer-events-none ${
            selectedPlanet?.orbit === 1
              ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'border-cyan-500/20'
          }`}
          style={{ width: orbitRadii[1] * 2, height: orbitRadii[1] * 2 }}
        />

        {/* Orbit 2 Ring (Middle ~155px radius) */}
        <div
          className={`absolute rounded-full border border-dashed transition-colors duration-300 pointer-events-none ${
            selectedPlanet?.orbit === 2
              ? 'border-blue-400/70 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              : 'border-blue-500/20'
          }`}
          style={{ width: orbitRadii[2] * 2, height: orbitRadii[2] * 2 }}
        />

        {/* Orbit 3 Ring (Outer ~225px radius) */}
        <div
          className={`absolute rounded-full border border-dashed transition-colors duration-300 pointer-events-none ${
            selectedPlanet?.orbit === 3
              ? 'border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'border-purple-500/20'
          }`}
          style={{ width: orbitRadii[3] * 2, height: orbitRadii[3] * 2 }}
        />

        {/* ============================================================== */}
        {/* CENTRAL SUN: REUSABLE SR LOGO CORE                             */}
        {/* ============================================================== */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto">
          {/* Solar Glow Aura */}
          <div className="absolute h-28 w-28 rounded-full bg-gradient-to-tr from-cyan-400/30 to-purple-600/30 blur-xl animate-pulse-subtle pointer-events-none" />

          {/* Central Core Shield */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-cyan-400/70 bg-neutral-950/95 shadow-[0_0_35px_rgba(0,240,255,0.4)] backdrop-blur-xl">
            {/* Corner Cyber Accents */}
            <div className="absolute top-1 left-1 h-1.5 w-1.5 border-t border-l border-cyan-300" />
            <div className="absolute top-1 right-1 h-1.5 w-1.5 border-t border-r border-purple-400" />
            <div className="absolute bottom-1 left-1 h-1.5 w-1.5 border-b border-l border-cyan-300" />
            <div className="absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-purple-400" />

            <SRLogo size="md" showGlow={true} />
          </div>

          <span className="mt-1.5 text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SR CORE
          </span>
        </div>

        {/* ============================================================== */}
        {/* ROTATING ORBIT 1 (INNER): Radius 90px                         */}
        {/* ============================================================== */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          <div
            className={`relative rounded-full pointer-events-none ${
              !prefersReducedMotion ? 'animate-orbit-1' : ''
            } ${isPaused ? 'orbit-paused' : ''}`}
            style={{ width: orbitRadii[1] * 2, height: orbitRadii[1] * 2 }}
          >
            {orbit1Planets.map((planet) => {
              const rad = (planet.angle * Math.PI) / 180;
              const radius = orbitRadii[1];
              const x = Math.round((radius + radius * Math.cos(rad)) * 100) / 100;
              const y = Math.round((radius + radius * Math.sin(rad)) * 100) / 100;

              const isSelected = selectedPlanet?.id === planet.id;
              const isCategoryHighlighted = highlightedCategory
                ? planet.category.toLowerCase().includes(highlightedCategory.toLowerCase())
                : false;

              return (
                <button
                  key={planet.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => onSelectPlanet(isSelected ? null : planet)}
                  aria-label={`Select ${planet.name}`}
                  className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl border transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 h-10 w-10 sm:h-11 sm:w-11 p-1.5 ${
                    isSelected
                      ? 'scale-125 border-cyan-300 bg-cyan-950/90 text-white shadow-[0_0_25px_rgba(0,240,255,0.7)] ring-2 ring-cyan-400 z-50'
                      : isCategoryHighlighted
                      ? 'scale-115 border-purple-400 bg-purple-950/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-40'
                      : 'border-neutral-800/90 bg-neutral-950/90 text-neutral-300 hover:border-cyan-400/70 hover:bg-neutral-900 hover:scale-115 hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span
                    className={`inline-flex items-center justify-center ${
                      !prefersReducedMotion ? 'animate-counter-orbit-1' : ''
                    } ${isPaused ? 'orbit-paused' : ''}`}
                  >
                    {planet.renderLogo('h-6 w-6')}
                  </span>

                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-neutral-950/95 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 opacity-0 shadow-lg pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                    {planet.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROTATING ORBIT 2 (MIDDLE): Radius 155px                        */}
        {/* ============================================================== */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          <div
            className={`relative rounded-full pointer-events-none ${
              !prefersReducedMotion ? 'animate-orbit-2' : ''
            } ${isPaused ? 'orbit-paused' : ''}`}
            style={{ width: orbitRadii[2] * 2, height: orbitRadii[2] * 2 }}
          >
            {orbit2Planets.map((planet) => {
              const rad = (planet.angle * Math.PI) / 180;
              const radius = orbitRadii[2];
              const x = Math.round((radius + radius * Math.cos(rad)) * 100) / 100;
              const y = Math.round((radius + radius * Math.sin(rad)) * 100) / 100;

              const isSelected = selectedPlanet?.id === planet.id;
              const isCategoryHighlighted = highlightedCategory
                ? planet.category.toLowerCase().includes(highlightedCategory.toLowerCase())
                : false;

              return (
                <button
                  key={planet.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => onSelectPlanet(isSelected ? null : planet)}
                  aria-label={`Select ${planet.name}`}
                  className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl border transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 h-10 w-10 sm:h-11 sm:w-11 p-1.5 ${
                    isSelected
                      ? 'scale-125 border-cyan-300 bg-cyan-950/90 text-white shadow-[0_0_25px_rgba(0,240,255,0.7)] ring-2 ring-cyan-400 z-50'
                      : isCategoryHighlighted
                      ? 'scale-115 border-purple-400 bg-purple-950/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-40'
                      : 'border-neutral-800/90 bg-neutral-950/90 text-neutral-300 hover:border-cyan-400/70 hover:bg-neutral-900 hover:scale-115 hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span
                    className={`inline-flex items-center justify-center ${
                      !prefersReducedMotion ? 'animate-counter-orbit-2' : ''
                    } ${isPaused ? 'orbit-paused' : ''}`}
                  >
                    {planet.renderLogo('h-6 w-6')}
                  </span>

                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-neutral-950/95 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 opacity-0 shadow-lg pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                    {planet.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROTATING ORBIT 3 (OUTER): Radius 225px                         */}
        {/* ============================================================== */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          <div
            className={`relative rounded-full pointer-events-none ${
              !prefersReducedMotion ? 'animate-orbit-3' : ''
            } ${isPaused ? 'orbit-paused' : ''}`}
            style={{ width: orbitRadii[3] * 2, height: orbitRadii[3] * 2 }}
          >
            {orbit3Planets.map((planet) => {
              const rad = (planet.angle * Math.PI) / 180;
              const radius = orbitRadii[3];
              const x = Math.round((radius + radius * Math.cos(rad)) * 100) / 100;
              const y = Math.round((radius + radius * Math.sin(rad)) * 100) / 100;

              const isSelected = selectedPlanet?.id === planet.id;
              const isCategoryHighlighted = highlightedCategory
                ? planet.category.toLowerCase().includes(highlightedCategory.toLowerCase())
                : false;

              return (
                <button
                  key={planet.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => onSelectPlanet(isSelected ? null : planet)}
                  aria-label={`Select ${planet.name}`}
                  className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl border transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 h-10 w-10 sm:h-11 sm:w-11 p-1.5 ${
                    isSelected
                      ? 'scale-125 border-cyan-300 bg-cyan-950/90 text-white shadow-[0_0_25px_rgba(0,240,255,0.7)] ring-2 ring-cyan-400 z-50'
                      : isCategoryHighlighted
                      ? 'scale-115 border-purple-400 bg-purple-950/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-40'
                      : 'border-neutral-800/90 bg-neutral-950/90 text-neutral-300 hover:border-cyan-400/70 hover:bg-neutral-900 hover:scale-115 hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span
                    className={`inline-flex items-center justify-center ${
                      !prefersReducedMotion ? 'animate-counter-orbit-3' : ''
                    } ${isPaused ? 'orbit-paused' : ''}`}
                  >
                    {planet.renderLogo('h-6 w-6')}
                  </span>

                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-neutral-950/95 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 opacity-0 shadow-lg pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                    {planet.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SELECTED TECHNOLOGY DETAIL HUD CARD (Floats below cleanly)      */}
      {/* ============================================================== */}
      {selectedPlanet ? (
        <div className="mt-4 w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-neutral-950/90 p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 animate-fade-in transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                {selectedPlanet.renderLogo('h-8 w-8')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {selectedPlanet.name}
                  </h4>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                    Orbit {selectedPlanet.orbit}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">
                  {selectedPlanet.category}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlanet(null)}
              className="rounded-lg border border-neutral-800 p-1 text-neutral-400 hover:text-white hover:border-neutral-700 transition"
              aria-label="Close technology inspection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="mt-3 flex items-start gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-2.5 text-[11px] text-neutral-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-200">Verified Application: </span>
              <span>{selectedPlanet.appliedIn}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
          <Sparkles className="h-3 w-3 text-cyan-400/80" />
          <span>Click any revolving technology logo to inspect verified engineering details</span>
        </div>
      )}
    </div>
  );
}

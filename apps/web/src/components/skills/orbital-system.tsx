'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import {
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { SRLogo } from '@/components/brand/sr-logo';

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
  icon: string;
  description: string;
}

export const ORBITAL_PLANETS: TechPlanet[] = [
  // --- Orbit 1: Foundational Core (Radius ~82px, 5 planets) ---
  {
    id: 'python',
    name: 'Python',
    category: 'Programming Languages',
    orbit: 1,
    angle: 0,
    color: '#00f0ff',
    accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: 'Py',
    description: 'Core language for machine learning pipelines, OpenCV vision models, and backend automation.',
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend Development',
    orbit: 1,
    angle: 72,
    color: '#38bdf8',
    accentBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    icon: 'Re',
    description: 'Declarative component architecture for high-performance interactive single-page applications.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Programming Languages',
    orbit: 1,
    angle: 144,
    color: '#3b82f6',
    accentBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: 'TS',
    description: 'Strict type safety across frontend components, BFF contracts, and backend APIs.',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend & APIs',
    orbit: 1,
    angle: 216,
    color: '#10b981',
    accentBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: 'Node',
    description: 'Event-driven, asynchronous JavaScript runtime for high-throughput backend services.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Databases & Storage',
    orbit: 1,
    angle: 288,
    color: '#60a5fa',
    accentBg: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
    icon: 'PG',
    description: 'Advanced relational database powering Neon cloud persistence and transactional consistency.',
  },

  // --- Orbit 2: Frameworks & Intelligent Systems (Radius ~144px, 7 planets) ---
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend Development',
    orbit: 2,
    angle: 25,
    color: '#ffffff',
    accentBg: 'bg-neutral-800 text-white border-cyan-500/30',
    icon: 'Next',
    description: 'Full-stack React framework with App Router, server components, and BFF architecture.',
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend & APIs',
    orbit: 2,
    angle: 76,
    color: '#e11d48',
    accentBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: 'Nest',
    description: 'Enterprise modular backend architecture with dependency injection and TypeScript decorators.',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'AI & Machine Learning',
    orbit: 2,
    angle: 127,
    color: '#a855f7',
    accentBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: 'ML',
    description: 'Applied statistical modeling, neural networks, predictive heuristics, and evaluation metrics.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend Development',
    orbit: 2,
    angle: 178,
    color: '#22d3ee',
    accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: 'TW',
    description: 'Utility-first modern styling system for responsive cyber layouts and custom themes.',
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud & Infrastructure',
    orbit: 2,
    angle: 230,
    color: '#f59e0b',
    accentBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'AWS',
    description: 'Cloud infrastructure hosting EC2 instances, RDS databases, and Amplify web pipelines.',
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    category: 'AI & Machine Learning',
    orbit: 2,
    angle: 282,
    color: '#c084fc',
    accentBg: 'bg-purple-600/20 text-purple-300 border-purple-500/40',
    icon: 'CV',
    description: 'Image preprocessing, feature extraction, OpenCV pipelines, and multispectral analysis.',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Databases & Storage',
    orbit: 2,
    angle: 333,
    color: '#38bdf8',
    accentBg: 'bg-sky-600/20 text-sky-300 border-sky-500/40',
    icon: 'SQL',
    description: 'Relational data modeling, ACID transactions, and optimized SQL index design.',
  },

  // --- Orbit 3: Cloud, Tools & Engineering Infrastructure (Radius ~206px, 8 planets) ---
  {
    id: 'git',
    name: 'Git',
    category: 'Developer Tools',
    orbit: 3,
    angle: 15,
    color: '#f97316',
    accentBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    icon: 'Git',
    description: 'Distributed version control, branch management, cherry-picking, and collaborative workflows.',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Cloud & Infrastructure',
    orbit: 3,
    angle: 60,
    color: '#0284c7',
    accentBg: 'bg-sky-600/20 text-sky-300 border-sky-500/40',
    icon: 'Dock',
    description: 'Containerization, reproducible multi-stage builds, and microservices orchestration.',
  },
  {
    id: 'opencv',
    name: 'OpenCV',
    category: 'AI & Machine Learning',
    orbit: 3,
    angle: 105,
    color: '#ef4444',
    accentBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    icon: 'CV2',
    description: 'Real-time image manipulation, spatial filtering, contour segmentation, and edge detection.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Databases & Storage',
    orbit: 3,
    angle: 150,
    color: '#22c55e',
    accentBg: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
    icon: 'MDB',
    description: 'NoSQL document database, aggregation pipelines, flexible schemas, and indexing.',
  },
  {
    id: 'prisma',
    name: 'Prisma ORM',
    category: 'Databases & Storage',
    orbit: 3,
    angle: 195,
    color: '#06b6d4',
    accentBg: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40',
    icon: 'Pris',
    description: 'Type-safe database ORM with automated schema migrations and connection pooling.',
  },
  {
    id: 'restapi',
    name: 'RESTful APIs',
    category: 'Backend & APIs',
    orbit: 3,
    angle: 240,
    color: '#38bdf8',
    accentBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    icon: 'REST',
    description: 'Stateless API design, HTTP status codes, structured JSON contracts, and Swagger/OpenAPI docs.',
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'Developer Tools',
    orbit: 3,
    angle: 285,
    color: '#f97316',
    accentBg: 'bg-orange-600/20 text-orange-300 border-orange-500/40',
    icon: 'Post',
    description: 'API endpoint validation, automated test collections, and integration workflow debugging.',
  },
  {
    id: 'linux',
    name: 'Linux / Bash',
    category: 'Developer Tools',
    orbit: 3,
    angle: 330,
    color: '#eab308',
    accentBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    icon: 'Bash',
    description: 'Unix shell scripting, process management, SSH remote server administration, and automation.',
  },
];

interface OrbitalSystemProps {
  selectedPlanet: TechPlanet | null;
  onSelectPlanet: (planet: TechPlanet) => void;
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

  // Orbit radius definitions (in pixels for 480x480 container)
  const orbitRadii = {
    1: 82,
    2: 144,
    3: 206,
  };

  const orbit1Planets = useMemo(() => ORBITAL_PLANETS.filter((p) => p.orbit === 1), []);
  const orbit2Planets = useMemo(() => ORBITAL_PLANETS.filter((p) => p.orbit === 2), []);
  const orbit3Planets = useMemo(() => ORBITAL_PLANETS.filter((p) => p.orbit === 3), []);

  const isPaused = isHovering || selectedPlanet !== null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Responsive Scaled Orbital Space Container */}
      <div
        className="relative h-[340px] w-[340px] sm:h-[460px] sm:w-[460px] lg:h-[480px] lg:w-[480px] flex items-center justify-center select-none scale-[0.80] sm:scale-100 transition-transform origin-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background Ambient Cyber Glow Halos */}
        <div className="absolute h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute h-72 w-72 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />

        {/* ============================================================== */}
        {/* ORBITAL PATHS (Static dashed guidelines)                      */}
        {/* ============================================================== */}
        {/* Orbit 1 Ring (Inner) */}
        <div
          className={`absolute rounded-full border border-dashed transition-colors duration-300 pointer-events-none ${
            selectedPlanet?.orbit === 1
              ? 'border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
              : 'border-cyan-500/20'
          }`}
          style={{
            width: orbitRadii[1] * 2,
            height: orbitRadii[1] * 2,
          }}
        />

        {/* Orbit 2 Ring (Middle) */}
        <div
          className={`absolute rounded-full border border-dashed transition-colors duration-300 pointer-events-none ${
            selectedPlanet?.orbit === 2
              ? 'border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
              : 'border-blue-500/20'
          }`}
          style={{
            width: orbitRadii[2] * 2,
            height: orbitRadii[2] * 2,
          }}
        />

        {/* Orbit 3 Ring (Outer) */}
        <div
          className={`absolute rounded-full border border-dashed transition-colors duration-300 pointer-events-none ${
            selectedPlanet?.orbit === 3
              ? 'border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
              : 'border-purple-500/20'
          }`}
          style={{
            width: orbitRadii[3] * 2,
            height: orbitRadii[3] * 2,
          }}
        />

        {/* ============================================================== */}
        {/* CENTRAL SUN: REUSABLE SR LOGO WITH SOLAR CYBER AURA            */}
        {/* ============================================================== */}
        <div className="relative z-20 flex flex-col items-center justify-center pointer-events-auto">
          {/* Pulsing Solar Glow Aura */}
          <div className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-cyan-400/25 to-blue-600/25 blur-xl animate-pulse-subtle pointer-events-none" />

          {/* Central Core Shield */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-cyan-400/60 bg-neutral-950/90 shadow-[0_0_30px_rgba(0,240,255,0.35)] backdrop-blur-xl">
            {/* Corner Cyber Pips */}
            <div className="absolute top-1 left-1 h-1.5 w-1.5 border-t border-l border-cyan-300" />
            <div className="absolute top-1 right-1 h-1.5 w-1.5 border-t border-r border-blue-400" />
            <div className="absolute bottom-1 left-1 h-1.5 w-1.5 border-b border-l border-cyan-300" />
            <div className="absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-blue-400" />

            {/* Vector SR Monogram */}
            <SRLogo size="md" showGlow={true} />
          </div>

          <span className="mt-1 text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SR CORE
          </span>
        </div>

        {/* ============================================================== */}
        {/* ROTATING ORBIT 1 (INNER): Radius ~82px                        */}
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
              // Position relative to orbit box center (radius, radius)
              const x = radius + radius * Math.cos(rad);
              const y = radius + radius * Math.sin(rad);

              const isSelected = selectedPlanet?.id === planet.id;
              const isCategoryHighlighted = highlightedCategory
                ? planet.category.toLowerCase().includes(highlightedCategory.toLowerCase())
                : false;

              return (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => onSelectPlanet(planet)}
                  aria-label={`Inspect ${planet.name} (${planet.category})`}
                  className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl border text-[11px] font-mono font-bold transition-transform duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 h-8 w-8 sm:h-9 sm:w-9 ${
                    isSelected
                      ? 'scale-125 border-cyan-300 bg-cyan-500/30 text-white shadow-[0_0_20px_rgba(0,240,255,0.6)] ring-2 ring-cyan-400 z-50'
                      : isCategoryHighlighted
                      ? 'scale-115 border-purple-400 bg-purple-500/25 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-40'
                      : 'border-neutral-800 bg-neutral-950/90 text-neutral-300 hover:border-cyan-400/60 hover:bg-neutral-900 hover:text-white hover:scale-115 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span
                    className={`inline-block ${
                      !prefersReducedMotion ? 'animate-counter-orbit-1' : ''
                    } ${isPaused ? 'orbit-paused' : ''}`}
                  >
                    {planet.icon}
                  </span>

                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-neutral-950/95 px-2 py-0.5 text-[10px] font-mono text-cyan-300 opacity-0 shadow-lg pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
                    {planet.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROTATING ORBIT 2 (MIDDLE): Radius ~144px                       */}
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
              const x = radius + radius * Math.cos(rad);
              const y = radius + radius * Math.sin(rad);

              const isSelected = selectedPlanet?.id === planet.id;
              const isCategoryHighlighted = highlightedCategory
                ? planet.category.toLowerCase().includes(highlightedCategory.toLowerCase())
                : false;

              return (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => onSelectPlanet(planet)}
                  aria-label={`Inspect ${planet.name} (${planet.category})`}
                  className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl border text-[11px] font-mono font-bold transition-transform duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 h-8 w-8 sm:h-9 sm:w-9 ${
                    isSelected
                      ? 'scale-125 border-cyan-300 bg-cyan-500/30 text-white shadow-[0_0_20px_rgba(0,240,255,0.6)] ring-2 ring-cyan-400 z-50'
                      : isCategoryHighlighted
                      ? 'scale-115 border-purple-400 bg-purple-500/25 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-40'
                      : 'border-neutral-800 bg-neutral-950/90 text-neutral-300 hover:border-cyan-400/60 hover:bg-neutral-900 hover:text-white hover:scale-115 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span
                    className={`inline-block ${
                      !prefersReducedMotion ? 'animate-counter-orbit-2' : ''
                    } ${isPaused ? 'orbit-paused' : ''}`}
                  >
                    {planet.icon}
                  </span>

                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-neutral-950/95 px-2 py-0.5 text-[10px] font-mono text-cyan-300 opacity-0 shadow-lg pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
                    {planet.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROTATING ORBIT 3 (OUTER): Radius ~206px                        */}
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
              const x = radius + radius * Math.cos(rad);
              const y = radius + radius * Math.sin(rad);

              const isSelected = selectedPlanet?.id === planet.id;
              const isCategoryHighlighted = highlightedCategory
                ? planet.category.toLowerCase().includes(highlightedCategory.toLowerCase())
                : false;

              return (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => onSelectPlanet(planet)}
                  aria-label={`Inspect ${planet.name} (${planet.category})`}
                  className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl border text-[10px] sm:text-[11px] font-mono font-bold transition-transform duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 h-7 w-7 sm:h-8 sm:w-8 ${
                    isSelected
                      ? 'scale-125 border-cyan-300 bg-cyan-500/30 text-white shadow-[0_0_20px_rgba(0,240,255,0.6)] ring-2 ring-cyan-400 z-50'
                      : isCategoryHighlighted
                      ? 'scale-115 border-purple-400 bg-purple-500/25 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-40'
                      : 'border-neutral-800 bg-neutral-950/90 text-neutral-300 hover:border-cyan-400/60 hover:bg-neutral-900 hover:text-white hover:scale-115 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span
                    className={`inline-block ${
                      !prefersReducedMotion ? 'animate-counter-orbit-3' : ''
                    } ${isPaused ? 'orbit-paused' : ''}`}
                  >
                    {planet.icon}
                  </span>

                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-neutral-950/95 px-2 py-0.5 text-[10px] font-mono text-cyan-300 opacity-0 shadow-lg pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
                    {planet.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Planet HUD Inspector Card (Directly beneath orbit) */}
      <div className="w-full max-w-md mt-4 rounded-2xl border border-cyan-500/30 bg-neutral-900/60 p-4 backdrop-blur-md transition-all duration-300">
        {selectedPlanet ? (
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/15 font-mono text-sm font-extrabold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {selectedPlanet.icon}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <h4 className="text-sm font-bold text-white tracking-wide truncate">
                    {selectedPlanet.name}
                  </h4>
                  <span className="rounded-full border border-neutral-800 bg-neutral-950/80 px-2 py-0.5 text-[10px] font-mono text-cyan-400 shrink-0">
                    {selectedPlanet.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPlanet(null as any)}
                  className="text-neutral-500 hover:text-neutral-300 transition text-xs font-mono"
                  title="Close inspection"
                >
                  Clear
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedPlanet.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 py-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Click any planet to inspect • Hover to pause orbit</span>
            </div>
            <span className="text-[10px] text-cyan-400/80 font-semibold hidden sm:inline">20 Technologies</span>
          </div>
        )}
      </div>
    </div>
  );
}

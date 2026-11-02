'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  Layers,
  Cpu,
  Cloud,
  Database,
  Wrench,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { TechPlanet } from './orbital-system';

export interface SkillCategoryGroup {
  id: string;
  category: string;
  icon: React.ElementType;
  accent: {
    text: string;
    bg: string;
    border: string;
  };
  skills: {
    name: string;
    focus: string;
  }[];
}

export const VERIFIED_SKILL_CATEGORIES: SkillCategoryGroup[] = [
  {
    id: 'programming',
    category: 'Programming Languages',
    icon: Terminal,
    accent: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
    },
    skills: [
      { name: 'Python', focus: 'AI/ML, OpenCV, Backend & Scripting' },
      { name: 'JavaScript', focus: 'Modern ES6+, Async Event-Loop' },
      { name: 'TypeScript', focus: 'Strict Typing, Interfaces, Generic Types' },
    ],
  },
  {
    id: 'frontend',
    category: 'Frontend Development',
    icon: Code2,
    accent: {
      text: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
    },
    skills: [
      { name: 'React.js', focus: 'Custom Hooks, Context, State Flow' },
      { name: 'Next.js', focus: 'App Router, SSR, Server Actions & BFF' },
      { name: 'HTML5', focus: 'Semantic markup & Web Accessibility' },
      { name: 'CSS3', focus: 'Flexbox, CSS Grid, Transitions & Media Queries' },
      { name: 'Tailwind CSS', focus: 'Utility-first design tokens & dark theme' },
      { name: 'Vite', focus: 'Ultra-fast HMR & production bundling' },
    ],
  },
  {
    id: 'backend',
    category: 'Backend & APIs',
    icon: Layers,
    accent: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    skills: [
      { name: 'Node.js', focus: 'Non-blocking I/O & Microservices' },
      { name: 'NestJS', focus: 'Modular Dependency Injection & Decorators' },
      { name: 'REST APIs', focus: 'Stateless endpoints, DTO validation & Swagger' },
    ],
  },
  {
    id: 'ai-ml',
    category: 'AI & Machine Learning',
    icon: Cpu,
    accent: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
    skills: [
      { name: 'Machine Learning', focus: 'Supervised, Unsupervised & Evaluation' },
      { name: 'Deep Learning Fundamentals', focus: 'Backpropagation, CNNs & Latent Diffusion' },
      { name: 'Computer Vision', focus: 'Image Filtering, Object Detection & Inpainting' },
      { name: 'Image Classification', focus: 'Feature Extraction & Model Fine-tuning' },
      { name: 'Geospatial Analysis', focus: 'Multispectral satellite raster processing' },
    ],
  },
  {
    id: 'cloud',
    category: 'Cloud & Infrastructure',
    icon: Cloud,
    accent: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    skills: [
      { name: 'AWS', focus: 'Core Cloud Architecture & IAM' },
      { name: 'AWS EC2', focus: 'Linux Compute Instances & Security Groups' },
      { name: 'AWS Amplify', focus: 'Full-stack hosting & managed deployments' },
      { name: 'Vercel', focus: 'Serverless Functions & Global Edge Network' },
    ],
  },
  {
    id: 'databases',
    category: 'Databases & Storage',
    icon: Database,
    accent: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    skills: [
      { name: 'MySQL', focus: 'Relational schemas, indexing & queries' },
      { name: 'PostgreSQL', focus: 'ACID compliance, Neon Cloud & migrations' },
      { name: 'Amazon RDS', focus: 'Managed database instances & replication' },
    ],
  },
  {
    id: 'tools',
    category: 'Developer Tools',
    icon: Wrench,
    accent: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
    },
    skills: [
      { name: 'Git', focus: 'Branching, merging, rebasing & version control' },
      { name: 'GitHub', focus: 'Pull requests, issues & repository hosting' },
      { name: 'GitHub Actions', focus: 'Automated CI/CD test and build pipelines' },
      { name: 'VS Code', focus: 'Full-stack IDE workflow & debugging' },
      { name: 'Figma', focus: 'UI/UX mockups, wireframing & design handoff' },
      { name: 'Postman', focus: 'API contract testing & integration suites' },
    ],
  },
  {
    id: 'competencies',
    category: 'Core Engineering Competencies',
    icon: Sparkles,
    accent: {
      text: 'text-cyan-300',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
    },
    skills: [
      { name: 'Responsive Web Design', focus: 'Fluid layouts across mobile, tablet & desktop' },
      { name: 'API Integration', focus: 'Client-server contracts & error handling' },
      { name: 'Debugging & Profiling', focus: 'Root-cause analysis & latency optimization' },
      { name: 'Production Deployment', focus: 'Build optimization & zero-downtime releases' },
      { name: 'Algorithmic Problem Solving', focus: 'Time/space complexity & optimization' },
      { name: 'Data Structures & Algorithms', focus: 'Trees, Graphs, Dynamic Programming & Arrays' },
    ],
  },
];

interface SkillsAccordionProps {
  onHoverCategory?: (categoryName: string | null) => void;
  onSelectSkill?: (skillName: string) => void;
}

export function SkillsAccordion({
  onHoverCategory,
  onSelectSkill,
}: SkillsAccordionProps) {
  // Initially first category or null (accordion expands one at a time)
  const [openCategoryId, setOpenCategoryId] = useState<string | null>('programming');

  const toggleCategory = (id: string) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 pb-1.5 border-b border-neutral-800">
        <span>Verified Category Breakdown</span>
        <span className="text-cyan-400 font-bold">8 Domains</span>
      </div>

      {VERIFIED_SKILL_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isOpen = openCategoryId === cat.id;

        return (
          <div
            key={cat.id}
            onMouseEnter={() => onHoverCategory?.(cat.category)}
            onMouseLeave={() => onHoverCategory?.(null)}
            className={`rounded-xl border transition-all duration-300 ${
              isOpen
                ? `${cat.accent.border} bg-neutral-900/80 shadow-lg shadow-neutral-950/40`
                : 'border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-850/50'
            }`}
          >
            {/* Category Header Button */}
            <button
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className="flex w-full items-center justify-between p-3.5 sm:p-4 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${cat.accent.border} ${cat.accent.bg} ${cat.accent.text}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {cat.category}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {cat.skills.length} competencies
                  </span>
                </div>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>

            {/* Expandable Content Area */}
            {isOpen && (
              <div className="border-t border-neutral-800/70 p-3.5 sm:p-4 pt-3 bg-neutral-950/60 rounded-b-xl space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      onClick={() => onSelectSkill?.(skill.name)}
                      className="group flex flex-col justify-between rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-2.5 transition hover:border-cyan-500/40 hover:bg-neutral-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 leading-tight">
                        {skill.focus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


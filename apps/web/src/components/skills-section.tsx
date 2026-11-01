'use client';

import React from 'react';
import {
  Sparkles,
  Layers,
  Code2,
  Terminal,
  Database,
  Cloud,
  Cpu,
  Wrench,
  CheckCircle,
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

interface SkillsSectionProps {
  skills?: Skill[];
}

// Fallback verified skills matrix as specified
const DEFAULT_SKILL_CATEGORIES: { category: string; skills: string[] }[] = [
  {
    category: 'Programming Languages',
    skills: ['Python', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Frontend Development',
    skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'],
  },
  {
    category: 'Backend & APIs',
    skills: ['Node.js', 'NestJS', 'REST APIs'],
  },
  {
    category: 'Databases & Storage',
    skills: ['MySQL', 'PostgreSQL', 'Amazon RDS'],
  },
  {
    category: 'Cloud & Infrastructure',
    skills: ['AWS', 'AWS EC2', 'AWS Amplify', 'Vercel'],
  },
  {
    category: 'AI & Machine Learning',
    skills: [
      'Machine Learning',
      'Deep Learning Fundamentals',
      'Computer Vision',
      'Image Classification',
      'Geospatial Analysis',
    ],
  },
  {
    category: 'Developer Tools',
    skills: ['Git', 'GitHub', 'GitHub Actions', 'VS Code', 'Figma', 'Postman'],
  },
  {
    category: 'Core Engineering Competencies',
    skills: [
      'Responsive Web Design',
      'API Integration',
      'Debugging',
      'Deployment',
      'Problem Solving',
      'Data Structures and Algorithms',
    ],
  },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  function getCategoryIcon(cat: string) {
    const lower = cat.toLowerCase();
    if (lower.includes('language')) return Terminal;
    if (lower.includes('front')) return Code2;
    if (lower.includes('back')) return Layers;
    if (lower.includes('data')) return Database;
    if (lower.includes('cloud')) return Cloud;
    if (lower.includes('ai') || lower.includes('machine')) return Cpu;
    if (lower.includes('tool')) return Wrench;
    return Sparkles;
  }

  // If skills provided from DB, group them by category; otherwise use DEFAULT_SKILL_CATEGORIES
  const displayCategories =
    skills && skills.length > 0
      ? Array.from(new Set(skills.map((s) => s.category))).map((cat) => ({
          category: cat,
          skills: skills
            .filter((s) => s.category === cat)
            .sort((a, b) => a.order - b.order)
            .map((s) => s.name),
        }))
      : DEFAULT_SKILL_CATEGORIES;

  return (
    <section id="skills" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              <span>Technical Skills</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Verified Technical Stack &amp; Competencies
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Clean categorization of proven technologies, frameworks, and engineering tools without arbitrary percentages.
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {displayCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} Verified Technologies
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayCategories.map(({ category, skills }) => {
            const CategoryIcon = getCategoryIcon(category);

            return (
              <div
                key={category}
                className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-neutral-850/50 hover:shadow-lg hover:shadow-cyan-950/20 flex flex-col justify-between"
              >
                <div>
                  {/* Category Title */}
                  <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      {category}
                    </h3>
                  </div>

                  {/* Badges List */}
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skillName) => (
                      <span
                        key={skillName}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/70 px-2.5 py-1 text-xs text-neutral-300 transition hover:border-cyan-500/40 hover:text-white"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>{skillName}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

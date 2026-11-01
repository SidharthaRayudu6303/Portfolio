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
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Category icon mapping
  function getCategoryIcon(cat: string) {
    const lower = cat.toLowerCase();
    if (lower.includes('language')) return Terminal;
    if (lower.includes('front')) return Code2;
    if (lower.includes('back')) return Layers;
    if (lower.includes('data')) return Database;
    if (lower.includes('cloud')) return Cloud;
    if (lower.includes('ai') || lower.includes('machine')) return Cpu;
    return Sparkles;
  }

  // Get distinct categories preserving skill order
  const categories = Array.from(new Set(skills.map((s) => s.category)));

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
              Core Competencies &amp; Technologies
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {skills.length} Verified Skills
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-16 text-center">
            <Sparkles className="h-8 w-8 text-neutral-500 mb-3" />
            <h3 className="text-sm font-semibold text-white">No skills populated yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const CategoryIcon = getCategoryIcon(cat);
              const categorySkills = skills
                .filter((s) => s.category === cat)
                .sort((a, b) => a.order - b.order);

              return (
                <div
                  key={cat}
                  className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-neutral-850/50 hover:shadow-lg hover:shadow-cyan-950/20"
                >
                  {/* Category Title */}
                  <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3 mb-5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      {cat}
                    </h3>
                  </div>

                  {/* Skills List in Category */}
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-200">{skill.name}</span>
                          <span className="font-mono text-[11px] text-cyan-400 font-medium">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-700"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


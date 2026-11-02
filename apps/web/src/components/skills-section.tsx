'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Code2,
  Terminal,
  Database,
  Cloud,
  Cpu,
  Wrench,
  CheckCircle2,
  Orbit,
} from 'lucide-react';
import {
  OrbitalSystem,
  ORBITAL_PLANETS,
  TechPlanet,
} from './skills/orbital-system';
import {
  SkillsAccordion,
  VERIFIED_SKILL_CATEGORIES,
} from './skills/skills-accordion';

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

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Default selected planet is Python
  const [selectedPlanet, setSelectedPlanet] = useState<TechPlanet | null>(
    ORBITAL_PLANETS[0]
  );
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  // Total verified skills calculated from actual verified categories
  const totalVerifiedCount = VERIFIED_SKILL_CATEGORIES.reduce(
    (acc, cat) => acc + cat.skills.length,
    0
  );

  const handleSelectSkillByName = (name: string) => {
    const match = ORBITAL_PLANETS.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (match) {
      setSelectedPlanet(match);
    }
  };

  return (
    <section id="skills" className="scroll-mt-16 min-h-screen flex flex-col justify-center py-20 border-b border-neutral-800/80 relative">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Orbit className="h-4 w-4" />
              <span>Technical Competencies</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Orbital Technology System
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Explore verified engineering tools, frameworks, and applied AI systems revolving around the SR core. Completely free of arbitrary percentage bars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-mono font-bold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>{totalVerifiedCount} Verified Technologies</span>
            </div>
          </div>
        </div>

        {/* Main Two-Column Layout: Left Wide Orbital System (Unboxed), Right Accordion */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Interactive Orbital Visual System (No restrictive box, wide breathing room) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <OrbitalSystem
              selectedPlanet={selectedPlanet}
              onSelectPlanet={setSelectedPlanet}
              highlightedCategory={highlightedCategory}
            />
          </div>

          {/* Right Column: Expandable Category Accordion */}
          <div className="lg:col-span-5">
            <SkillsAccordion
              onHoverCategory={setHighlightedCategory}
              onSelectSkill={handleSelectSkillByName}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

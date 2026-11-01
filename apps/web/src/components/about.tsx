'use client';

import React from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Compass,
  Code2,
  Cpu,
  Shield,
  Lightbulb,
} from 'lucide-react';

export function About() {
  const pillars = [
    {
      icon: Code2,
      title: 'Full-Stack Engineering',
      description:
        'Building responsive, accessible web applications with React, Next.js, and TypeScript, backed by robust RESTful APIs in NestJS and Node.js.',
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: Cpu,
      title: 'Machine Learning & AI',
      description:
        'Developing computer vision pipelines, diagnostic assessment models, and intelligent generative workflows in Python and modern ML frameworks.',
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Lightbulb,
      title: 'IoT & Hardware Systems',
      description:
        'Connecting edge devices with cloud platforms for real-time telemetry, precision environmental control, and automated robotics in agriculture and automation.',
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Shield,
      title: 'Architecture & Security',
      description:
        'Zero-trust backend-for-frontend (BFF) patterns, double-submit CSRF prevention, strict schema validation, and performant PostgreSQL database structures.',
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section id="about" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <User className="h-4 w-4" />
            <span>About Me</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Passionate Developer Building Purpose-Driven Software
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6 text-sm text-neutral-300 sm:text-base leading-relaxed">
            <p>
              I am <strong className="text-white font-semibold">Sidhartha</strong>, a full-stack developer and technology enthusiast. My journey centers around turning complex ideas into functional, elegant, and secure systems that make a tangible impact.
            </p>

            <p>
              From building computer vision platforms like <span className="text-cyan-400 font-medium">GenVision</span> to designing agricultural robotics with <span className="text-cyan-400 font-medium">BhuYanthra</span> and smart automation hardware in <span className="text-cyan-400 font-medium">Robohatch</span>, I enjoy bridging the gap between web software, intelligent algorithms, and physical systems.
            </p>

            {/* Development Philosophy Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-neutral-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Compass className="h-4 w-4" />
                <span>Development Philosophy</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed sm:text-sm">
                &ldquo;Great software balances speed, simplicity, and rock-solid reliability. I value strict type safety, modular component architectures, thoughtful user experience, and defensive security from the database query up to the rendered pixel.&rdquo;
              </p>
            </div>

            {/* Education & Background Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-xs uppercase tracking-wider mb-3">
                <GraduationCap className="h-4 w-4" />
                <span>Education &amp; Technical Focus</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
                <div className="flex justify-between items-baseline border-b border-neutral-800/80 pb-2">
                  <span className="font-semibold text-white">Computer Science &amp; Engineering</span>
                  <span className="text-xs text-neutral-500 font-mono">Core Focus</span>
                </div>
                <p className="text-xs text-neutral-400 pt-1">
                  Active exploration in distributed backend services, machine learning pipelines, cloud-native deployments, and human-computer interaction.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pillars of Expertise */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-850/60"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${pillar.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Send,
  Linkedin,
  Mail,
  Sparkles,
  FileText,
  MapPin,
  Github,
} from 'lucide-react';
import {
  PROFESSIONAL_TITLE,
  HERO_HEADLINE,
  HERO_SUBTITLE,
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  GITHUB_URL,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
  AVAILABILITY,
} from '@/lib/constants';
import { setCharacterReaction } from '@/lib/character-state';

const CharacterScene = dynamic(
  () => import('@/components/three/character-scene').then((mod) => mod.CharacterScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[440px] sm:h-[480px] lg:h-[520px] w-full max-w-[460px] items-center justify-center font-mono text-xs text-cyan-400">
        <Sparkles className="mr-2 h-4 w-4 animate-spin text-cyan-400" />
        <span>Initializing 3D Rig...</span>
      </div>
    ),
  }
);

interface HeroProps {
  projectCount?: number;
  skillCount?: number;
}

export function Hero({ projectCount = 6, skillCount = 32 }: HeroProps) {
  const router = useRouter();
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const id = targetId.replace(/^\/?#/, '');
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -76;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen lg:h-screen flex flex-col justify-center overflow-hidden border-b border-neutral-800/80 pt-20 pb-12 scroll-mt-16"
    >
      {/* Background Lighting Effects with Subtle Movement */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Cinematic Depth Container */}
      <div
        className={`relative mx-auto max-w-7xl px-6 w-full transition-all duration-700 ease-out ${
          isSettled ? 'scale-100 opacity-100' : 'scale-[1.01] opacity-95'
        }`}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Bio & Hero Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Greeting & Location Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-semibold">
                Hello, I&apos;m
              </span>
              <span className="text-neutral-600">•</span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>{CONTACT_LOCATION}</span>
              </div>
            </div>

            {/* Prominent Name with Balanced Complementary Typography */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-none text-white">
                <span className="tracking-tight text-white font-extrabold mr-3 sm:mr-4">
                  SIDHARTHA
                </span>
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent font-medium tracking-wide">
                  RAYUDU
                </span>
              </h1>

              {/* Verified Availability Status */}
              {AVAILABILITY && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Open to opportunities</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    Software Development · AI/ML
                  </span>
                </div>
              )}
            </div>

            {/* Main Title */}
            <div>
              <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold tracking-tight text-neutral-200">
                {PROFESSIONAL_TITLE}
              </h2>
            </div>

            {/* Core Headline & Tagline */}
            <div className="space-y-2 max-w-2xl">
              <p className="text-base sm:text-lg font-semibold text-neutral-300 leading-snug">
                {HERO_HEADLINE}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                {HERO_SUBTITLE}
              </p>
            </div>

            {/* Call to Actions & Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* View Projects CTA Button */}
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                onMouseEnter={() => setCharacterReaction('projects')}
                onMouseLeave={() => setCharacterReaction('idle')}
                data-magnetic="true"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Download Resume Button */}
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCharacterReaction('resume')}
                onMouseLeave={() => setCharacterReaction('idle')}
                data-magnetic="true"
                className="group inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-5 py-3 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400"
                title="Download Active Resume PDF"
              >
                <FileText className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Download Resume</span>
              </a>

              {/* Contact Me CTA Button */}
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                onMouseEnter={() => setCharacterReaction('contact')}
                onMouseLeave={() => setCharacterReaction('idle')}
                data-magnetic="true"
                className="group inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-3 text-xs font-bold text-neutral-200 transition hover:border-cyan-500/40 hover:bg-neutral-800 hover:text-white cursor-pointer"
              >
                <Send className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Contact Me</span>
              </a>

              {/* Social Channels */}
              <div className="flex items-center gap-2 border-l border-neutral-800 pl-3 ml-1">
                {GITHUB_URL && (
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="true"
                    className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
                    title="GitHub Profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-cyan-400"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={LEETCODE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-amber-400"
                  title="LeetCode Profile"
                >
                  LC
                </a>
                <a
                  href={HACKERRANK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-emerald-400"
                  title="HackerRank Profile"
                >
                  HR
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-magnetic="true"
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-400 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-cyan-400"
                  title="Send Direct Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D Holographic AI Robot Companion (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Lighting Orbs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />
              <div className="h-60 w-60 rounded-full bg-blue-600/15 blur-[70px]" />
            </div>

            {/* Seamless Floating 3D AI Robot Companion */}
            <div className="w-full flex justify-center">
              <CharacterScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

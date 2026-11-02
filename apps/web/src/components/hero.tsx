'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Send,
  Linkedin,
  Mail,
  ChevronDown,
  Terminal,
  Sparkles,
  ShieldCheck,
  Code2,
  Eye,
  FileText,
  MapPin,
  Github,
  Trophy,
  Award,
} from 'lucide-react';
import {
  DISPLAY_NAME,
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

const CharacterScene = dynamic(
  () => import('@/components/three/character-scene').then((mod) => mod.CharacterScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[440px] w-full max-w-[420px] items-center justify-center rounded-2xl border border-cyan-500/20 bg-neutral-950/60 font-mono text-xs text-cyan-400">
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

// Viewport-triggered animated counter with ease-out
function CountUp({
  end,
  suffix = '',
  duration = 1400,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setCount(end);
      }, 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, end]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
}

export function Hero({ projectCount = 6, skillCount = 32 }: HeroProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'3d' | 'telemetry'>('3d');
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  const FULL_TYPING_TARGET = "Hello, I'm Sidhartha Rayudu";

  // Typing effect and cinematic settle
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const t = setTimeout(() => {
        setTypedText(FULL_TYPING_TARGET);
        setIsTypingDone(true);
        setIsSettled(true);
      }, 0);
      return () => clearTimeout(t);
    }

    // Cinematic depth lens settle
    const settleTimer = setTimeout(() => {
      setIsSettled(true);
    }, 80);

    // Typing animation: ~38ms per char
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= FULL_TYPING_TARGET.length) {
        setTypedText(FULL_TYPING_TARGET.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingDone(true);
      }
    }, 38);

    return () => {
      clearTimeout(settleTimer);
      clearInterval(typingInterval);
    };
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
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden border-b border-neutral-800/80 pt-24 pb-16"
    >
      {/* Background Lighting Effects with Subtle Movement */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Cinematic Depth Container */}
      <div
        className={`relative mx-auto max-w-7xl px-6 w-full transition-all duration-1000 ease-out ${
          isSettled ? 'scale-100 opacity-100 blur-0' : 'scale-[1.02] opacity-90 blur-[0.4px]'
        }`}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Bio & Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span>{AVAILABILITY}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>{CONTACT_LOCATION}</span>
              </div>
            </div>

            {/* Main Headline with Typewriter Introduction */}
            <div className="space-y-3">
              {/* Typing Introduction */}
              <div className="min-h-[2.5rem] sm:min-h-[3.5rem] flex items-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl">
                  <span>{typedText}</span>
                  <span
                    className={`inline-block w-1.5 h-8 sm:h-11 ml-1.5 align-middle bg-cyan-400 ${
                      isTypingDone ? 'animate-pulse' : 'opacity-100'
                    }`}
                  />
                </h1>
              </div>

              {/* Revealed Professional Title */}
              <div
                className={`transition-all duration-700 ease-out ${
                  isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 sm:text-2xl xl:text-3xl">
                  {PROFESSIONAL_TITLE}
                </h2>
              </div>
            </div>

            {/* Core Message & Supporting Description */}
            <div
              className={`space-y-2 max-w-2xl transition-all duration-700 delay-100 ease-out ${
                isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-base sm:text-lg font-semibold text-neutral-200">
                {HERO_HEADLINE}
              </p>
              <p className="text-sm text-neutral-300 sm:text-base leading-relaxed">
                {HERO_SUBTITLE}
              </p>
            </div>

            {/* Call to Actions & Social Links */}
            <div
              className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-700 delay-200 ease-out ${
                isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {/* View Projects CTA Button */}
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
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

          {/* Right Column: 3D Interactive Cyber Rig & Telemetry */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* View Switcher Controls */}
            <div className="mb-3 flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/70 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono transition-all ${
                  activeTab === '3d'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                <span>3D Cyber Rig</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('telemetry')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-mono transition-all ${
                  activeTab === 'telemetry'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>Telemetry</span>
              </button>
            </div>

            {/* Ambient Lighting Orbs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px] animate-pulse-subtle" />
              <div className="h-60 w-60 rounded-full bg-blue-600/15 blur-[70px]" />
            </div>

            {/* Dynamic View: 3D Scene or Terminal */}
            {activeTab === '3d' ? (
              <div className="w-full flex justify-center">
                <CharacterScene />
              </div>
            ) : (
              <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/30 bg-neutral-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                    <span>sidhartha@dev:~</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-[10px] text-cyan-400">LIVE</span>
                  </div>
                </div>

                <div className="font-mono text-xs space-y-3">
                  <div className="text-neutral-400">
                    <span className="text-cyan-400">$</span> fetch profile --engineer &quot;Sidhartha&quot;
                  </div>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 space-y-2 text-neutral-300">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">ROLE:</span>
                      <span className="text-white font-semibold">{PROFESSIONAL_TITLE}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">LOCATION:</span>
                      <span className="text-cyan-400">Kakinada, AP, India</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">DATABASE:</span>
                      <span className="text-emerald-400">Neon Cloud PostgreSQL</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">SECURITY:</span>
                      <span className="text-purple-400">Zero-Trust BFF + CSRF</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-neutral-500 text-[11px]">{`// Verified Repositories:`}</span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2.5">
                        <span className="block text-[10px] uppercase font-bold text-cyan-400">GenVision</span>
                        <span className="block text-[10px] text-neutral-400">AI Computer Vision</span>
                      </div>
                      <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-2.5">
                        <span className="block text-[10px] uppercase font-bold text-blue-400">BhuYanthra</span>
                        <span className="block text-[10px] text-neutral-400">Agri Robotics &amp; IoT</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Architecture v7.2 Verified • Ready to Deploy</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 6: NEW HOMEPAGE STATISTIC CARDS (REPLACED)       */}
        {/* ======================================================== */}
        <div className="mt-16 pt-8 border-t border-neutral-800/80">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Card 1: Total Projects (6 Verified) */}
            <div className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-neutral-900/70 hover:shadow-lg hover:shadow-cyan-950/20">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Code2 className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Total Projects
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <CountUp end={6} duration={1200} />
              </div>
              <span className="block text-xs text-neutral-400 mt-1.5 leading-snug">
                GenVision, BhuYanthra &amp; 4 More
              </span>
            </div>

            {/* Card 2: Total Hackathons (2 Verified - NCAT Excluded) */}
            <div className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-neutral-900/70 hover:shadow-lg hover:shadow-blue-950/20">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Trophy className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Total Hackathons
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <CountUp end={2} duration={1000} />
              </div>
              <span className="block text-xs text-neutral-400 mt-1.5 leading-snug">
                ISRO BAH &apos;26 &amp; CAT Hackathon
              </span>
            </div>

            {/* Card 3: Total Certifications (9 Verified Technical - NCAT Excluded) */}
            <div className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:bg-neutral-900/70 hover:shadow-lg hover:shadow-purple-950/20">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Award className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Total Certifications
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <CountUp end={9} duration={1300} />
              </div>
              <span className="block text-xs text-neutral-400 mt-1.5 leading-snug">
                Udemy, TCS, Infosys &amp; CodeTantra
              </span>
            </div>

            {/* Card 4: Python Proficiency (70% Self-Assessed) */}
            <div className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-neutral-900/70 hover:shadow-lg hover:shadow-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Terminal className="h-4 w-4" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Python Proficiency
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <CountUp end={70} suffix="%" duration={1500} />
              </div>
              <span className="block text-xs text-neutral-400 mt-1.5 leading-snug">
                AI/ML, OpenCV &amp; Automation
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 flex justify-center">
          <a
            href="#about"
            onClick={(e) => handleScrollTo(e, '#about')}
            className="group flex flex-col items-center gap-1.5 text-xs text-neutral-500 hover:text-cyan-400 transition cursor-pointer"
            aria-label="Scroll to About section"
          >
            <span className="font-mono text-[11px] tracking-wider uppercase">Explore</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-cyan-400" />
          </a>
        </div>
      </div>
    </section>
  );
}

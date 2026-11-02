'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';
import { SRLogo } from '@/components/brand/sr-logo';
import { DISPLAY_NAME, PROFESSIONAL_TITLE } from '@/lib/constants';

interface CinematicLoaderProps {
  onComplete?: () => void;
}

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING NEURAL INTERFACE...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const finishLoader = useCallback(() => {
    sessionStorage.setItem('sr_cinematic_loader_seen', 'true');
    setIsFadingOut(true);
    setTimeout(() => {
      setActive(false);
      onComplete?.();
    }, 450);
  }, [onComplete]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcePreview = params.get('previewLoader') === 'true';
    const seen = sessionStorage.getItem('sr_cinematic_loader_seen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!forcePreview && (seen === 'true' || prefersReducedMotion)) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setActive(true);
    }, 0);

    // Escape key listener to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishLoader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, finishLoader]);

  // Ambient floating background particles
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface AmbientParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }

    const particles: AmbientParticle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.5,
      color: Math.random() > 0.4 ? '#00f0ff' : '#3b82f6',
    }));

    let animId: number;
    const startTime = performance.now();
    const duration = 2100;

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(1, elapsed / duration);
      const currentPct = Math.round(progressRatio * 100);
      setProgress(currentPct);

      if (progressRatio > 0.85) {
        setStatusText('SYSTEM OPERATIONAL • WELCOME');
      } else if (progressRatio > 0.6) {
        setStatusText('ACTIVATING SIDHARTHA RAYUDU BRAND RIG...');
      } else if (progressRatio > 0.3) {
        setStatusText('SYNCHRONIZING ARCHITECTURE v7.2...');
      } else {
        setStatusText('CALIBRATING NEURAL INTERFACE...');
      }

      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      });

      if (elapsed < duration) {
        animId = requestAnimationFrame(render);
      } else {
        finishLoader();
      }
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, finishLoader]);

  if (!active) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-between bg-[#050505] p-6 sm:p-8 transition-all duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Interactive Ambient Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">
            SR BOOT SEQUENCE v7.2
          </span>
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={finishLoader}
          className="group flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1.5 font-mono text-xs text-neutral-400 transition hover:border-cyan-500/50 hover:bg-neutral-800 hover:text-cyan-400"
          title="Skip Intro Animation"
        >
          <span>Skip [ESC]</span>
          <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
        </button>
      </div>

      {/* Centerpiece: Prominent SR Monogram Logo & Cyber Aura */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        {/* Ambient Pulsing Glow Halo */}
        <div className="absolute h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-transparent blur-3xl pointer-events-none animate-pulse-subtle" />

        {/* Outer Cyber Tech Ring Frame */}
        <div className="relative flex items-center justify-center p-8 sm:p-10 rounded-3xl border border-cyan-500/20 bg-neutral-950/80 shadow-[0_0_50px_rgba(0,240,255,0.15)] backdrop-blur-xl">
          <div className="absolute top-2 left-2 h-2 w-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 h-2 w-2 border-t-2 border-r-2 border-blue-400" />
          <div className="absolute bottom-2 left-2 h-2 w-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 h-2 w-2 border-b-2 border-r-2 border-blue-400" />

          {/* Centered Large Vector SR Monogram Logo */}
          <SRLogo size="xl" showGlow={true} animated={false} />
        </div>

        {/* Brand Display Name & Title Under Logo */}
        <div className="mt-6 text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">
            {DISPLAY_NAME}
          </h1>
          <p className="font-mono text-xs tracking-widest text-cyan-400 uppercase">
            {PROFESSIONAL_TITLE}
          </p>
        </div>
      </div>

      {/* Bottom Telemetry & Progress Bar */}
      <div className="relative z-10 w-full max-w-md space-y-3 pb-4 text-center">
        <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="h-3 w-3" />
            <span>{statusText}</span>
          </span>
          <span className="text-white font-bold">{progress}%</span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-900 border border-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,240,255,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
          <span>Kakinada, AP, India</span>
          <span>Neon DB • Next.js 16</span>
        </div>
      </div>
    </div>
  );
}

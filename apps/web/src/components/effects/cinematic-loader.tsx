'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { SRLogo } from '@/components/brand/sr-logo';
import { DISPLAY_NAME } from '@/lib/constants';

interface CinematicLoaderProps {
  onComplete?: () => void;
}

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [active, setActive] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const finishLoader = useCallback(() => {
    sessionStorage.setItem('sr_loader_seen', 'true');
    setIsFadingOut(true);
    setTimeout(() => {
      setActive(false);
      onComplete?.();
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcePreview = params.get('previewLoader') === 'true';
    const seen = sessionStorage.getItem('sr_loader_seen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Do not show if already seen in session or user prefers reduced motion
    if (!forcePreview && (seen === 'true' || prefersReducedMotion)) {
      onComplete?.();
      return;
    }

    const initTimer = setTimeout(() => {
      setActive(true);
    }, 0);

    // Fast, elegant 850ms duration
    const timer = setTimeout(() => {
      finishLoader();
    }, 850);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishLoader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, finishLoader]);

  if (!active) return null;

  return (
    <div
      role="status"
      aria-label="Loading portfolio experience"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-350 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient Radial Glow */}
      <div className="absolute h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />
      <div className="absolute h-64 w-64 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />

      {/* Central SR Brand Identity */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-500/30 bg-neutral-950/80 p-3 shadow-[0_0_35px_rgba(0,240,255,0.25)] backdrop-blur-md">
          <SRLogo size="lg" showGlow={true} animated={false} />
        </div>

        <div className="text-center space-y-1">
          <span className="block text-sm font-bold tracking-widest text-white uppercase">
            {DISPLAY_NAME}
          </span>
          <span className="block text-[10px] font-mono tracking-widest text-cyan-400">
            SYSTEM READY
          </span>
        </div>
      </div>
    </div>
  );
}

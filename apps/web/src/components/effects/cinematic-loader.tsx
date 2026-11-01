'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete?: () => void;
}

function MonogramCanvas({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING NEURAL RIG...');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate Particle Coordinates for Monogram "S R"
    const targetPoints: { x: number; y: number }[] = [];
    const scale = Math.min(width, height) * 0.0016;
    const cx = width / 2;
    const cy = height / 2 - 20;

    // --- Letter 'S' Target Points ---
    const sOffsetX = -80 * scale;
    for (let t = 0; t <= Math.PI; t += 0.08) {
      targetPoints.push({
        x: cx + sOffsetX + Math.cos(t) * 35 * scale,
        y: cy - 35 * scale + Math.sin(t) * 35 * scale,
      });
      targetPoints.push({
        x: cx + sOffsetX - Math.cos(t) * 35 * scale,
        y: cy + 35 * scale - Math.sin(t) * 35 * scale,
      });
    }

    // --- Letter 'R' Target Points ---
    const rOffsetX = 70 * scale;
    for (let y = -70; y <= 70; y += 4.5) {
      targetPoints.push({
        x: cx + rOffsetX - 35 * scale,
        y: cy + y * scale,
      });
    }
    for (let t = -Math.PI / 2; t <= Math.PI / 2; t += 0.08) {
      targetPoints.push({
        x: cx + rOffsetX - 35 * scale + Math.cos(t) * 38 * scale,
        y: cy - 35 * scale + Math.sin(t) * 35 * scale,
      });
    }
    for (let d = 0; d <= 70; d += 4.5) {
      targetPoints.push({
        x: cx + rOffsetX - 25 * scale + d * scale,
        y: cy + d * scale,
      });
    }

    interface Particle {
      x: number;
      y: number;
      startX: number;
      startY: number;
      targetX: number;
      targetY: number;
      radius: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = targetPoints.map((target) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 400 + Math.random() * 600;
      const startX = cx + Math.cos(angle) * distance;
      const startY = cy + Math.sin(angle) * distance;
      const isCyan = Math.random() > 0.35;

      return {
        x: startX,
        y: startY,
        startX,
        startY,
        targetX: target.x,
        targetY: target.y,
        radius: 1.5 + Math.random() * 2,
        color: isCyan ? '#00f0ff' : '#3b82f6',
        alpha: 0.2 + Math.random() * 0.8,
      };
    });

    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 2400;

    const render = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(1, elapsed / duration);
      setProgress(Math.round(progressRatio * 100));

      if (progressRatio > 0.75) {
        setStatusText('READY • ARCHITECTURE v7.2 VERIFIED');
      } else if (progressRatio > 0.45) {
        setStatusText('ASSEMBLING MONOGRAM PARTICLES...');
      } else if (progressRatio > 0.2) {
        setStatusText('SYNCING NEON POSTGRESQL CLUSTER...');
      }

      ctx.clearRect(0, 0, width, height);

      // Radial background
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, 'rgba(5, 5, 5, 0.98)');
      bgGrad.addColorStop(1, '#050505');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle center bloom
      const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220 * scale);
      bloomGrad.addColorStop(0, 'rgba(0, 240, 255, 0.14)');
      bloomGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.05)');
      bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, 0, width, height);

      const t = Math.min(1, elapsed / 1600);
      const ease = 1 - Math.pow(1 - t, 3);

      particles.forEach((p) => {
        p.x = p.startX + (p.targetX - p.startX) * ease;
        p.y = p.startY + (p.targetY - p.startY) * ease;

        if (ease > 0.8) {
          p.x += (Math.random() - 0.5) * 1.2;
          p.y += (Math.random() - 0.5) * 1.2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      });

      // Connecting energy arcs
      if (ease > 0.7) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        for (let i = 0; i < particles.length; i += 6) {
          for (let j = i + 1; j < particles.length; j += 6) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 28 * scale) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        sessionStorage.setItem('sr_cinematic_loader_seen', 'true');
        setTimeout(() => {
          onComplete?.();
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

      {/* Bottom Telemetry & Progress Bar */}
      <div className="relative z-10 w-full max-w-md space-y-3 pb-6 text-center">
        <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="h-3 w-3" />
            <span>{statusText}</span>
          </span>
          <span className="text-white font-bold">{progress}%</span>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
          Sidhartha • Portfolio 2026
        </p>
      </div>
    </>
  );
}

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [active, setActive] = useState(false);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sessionStorage.setItem('sr_cinematic_loader_seen', 'true');
        setActive(false);
        onComplete?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('sr_cinematic_loader_seen', 'true');
    setActive(false);
    onComplete?.();
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-between bg-[#050505] p-8 transition-opacity duration-500">
      {/* Top Header */}
      <div className="flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">
            SYSTEM BOOT SEQUENCE
          </span>
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="group flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1.5 font-mono text-xs text-neutral-400 transition hover:border-cyan-500/50 hover:bg-neutral-800 hover:text-cyan-400"
          title="Skip Intro Animation"
        >
          <span>Skip [ESC]</span>
          <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
        </button>
      </div>

      <MonogramCanvas onComplete={handleSkip} />
    </div>
  );
}

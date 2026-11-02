'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Cpu } from 'lucide-react';

interface ProjectArtworkProps {
  src?: string | null;
  alt: string;
  title: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function ProjectArtwork({
  src,
  alt,
  title,
  priority = false,
  className = 'object-cover transition-transform duration-700 group-hover:scale-105',
  sizes = '(max-width: 768px) 92vw, 680px',
}: ProjectArtworkProps) {
  const [hasError, setHasError] = useState(false);

  // If no source or error triggered, render graceful fallback
  if (!src || hasError) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6 text-center border-b border-neutral-800">
        {/* Subtle Background Grid & Glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.15) 0%, transparent 65%), linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
            backgroundSize: '100% 100%, 24px 24px, 24px 24px',
          }}
        />

        {/* Icon & Label */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-md">
            <Cpu className="h-7 w-7 text-cyan-400" />
          </div>
          <span className="font-mono text-[11px] font-semibold tracking-wider text-cyan-400/90 uppercase mb-1">
            Visual Architecture
          </span>
          <h4 className="max-w-[85%] text-sm sm:text-base font-bold text-neutral-200 line-clamp-1">
            {title}
          </h4>
        </div>
      </div>
    );
  }

  const isSvg = src.toLowerCase().endsWith('.svg');

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized={isSvg}
      onError={() => setHasError(true)}
    />
  );
}


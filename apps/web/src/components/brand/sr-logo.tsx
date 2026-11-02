'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SRLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
  animated?: boolean;
}

const sizeMap = {
  xs: { width: 24, height: 24, strokeWidth: 8 },
  sm: { width: 34, height: 34, strokeWidth: 8.5 },
  md: { width: 44, height: 44, strokeWidth: 9 },
  lg: { width: 68, height: 68, strokeWidth: 9.5 },
  xl: { width: 120, height: 120, strokeWidth: 10 },
};

export function SRLogo({
  size = 'sm',
  className = '',
  showGlow = true,
  animated = false,
}: SRLogoProps) {
  const config = sizeMap[size];
  const filterId = `sr-glow-${size}`;
  const cyanGradId = `cyan-grad-${size}`;
  const blueGradId = `blue-grad-${size}`;
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: config.width, height: config.height }}
      aria-label="Sidhartha Rayudu (SR) Official Logo"
    >
      {/* 1. Official Uploaded SR Logo Image (if available in public/brand/sr-logo.png) */}
      {!imageError ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/brand/sr-logo.png"
            alt="Sidhartha Rayudu (SR) Official Logo"
            width={config.width}
            height={config.height}
            className={`w-full h-full object-contain ${
              animated ? 'transition-transform duration-300 hover:scale-105' : ''
            }`}
            onError={() => setImageError(true)}
            priority
          />
          {showGlow && (
            <div
              className="absolute inset-0 rounded-full blur-md -z-10 pointer-events-none opacity-40 bg-gradient-to-tr from-cyan-400 to-purple-500"
            />
          )}
        </div>
      ) : (
        /* 2. Scalable Futuristic Monogram Fallback (S in Cyan, R in Blue/Purple) */
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full overflow-visible ${
            animated ? 'transition-transform duration-300 hover:scale-105' : ''
          }`}
        >
          <defs>
            {/* Electric Cyan Gradient for 'S' */}
            <linearGradient id={cyanGradId} x1="12" y1="20" x2="48" y2="82" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="60%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Electric Purple/Royal Blue Gradient for 'R' */}
            <linearGradient id={blueGradId} x1="52" y1="20" x2="88" y2="84" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Subtle Cyber Neon Glow Filter */}
            {showGlow && (
              <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Ambient Glow Backplate */}
          {showGlow && (
            <g opacity={size === 'xl' ? '0.45' : '0.3'} filter={`url(#${filterId})`}>
              <path
                d="M 44 24 H 24 L 14 34 V 44 L 22 52 H 36 L 44 60 V 72 L 34 82 H 14"
                stroke="#00f0ff"
                strokeWidth={config.strokeWidth + 3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 56 24 V 82 M 56 24 H 74 L 84 34 V 42 L 74 52 H 56 M 68 52 L 86 82"
                stroke="#a855f7"
                strokeWidth={config.strokeWidth + 3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Foreground Monogram: Distinct S & R with Orbital Halo */}
          <g id="sr-monogram-foreground">
            {/* Orbital Element Ring */}
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              strokeOpacity="0.4"
            />

            {/* LETTER 'S' (Electric Cyan) */}
            <path
              d="M 44 24 H 24 L 14 34 V 44 L 22 52 H 36 L 44 60 V 72 L 34 82 H 14"
              stroke={`url(#${cyanGradId})`}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            <circle cx="44" cy="24" r="2.2" fill="#ffffff" opacity="0.9" />

            {/* LETTER 'R' (Purple/Blue) */}
            <path
              d="M 56 24 V 82"
              stroke={`url(#${blueGradId})`}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            <path
              d="M 56 24 H 74 L 84 34 V 42 L 74 52 H 56"
              stroke={`url(#${blueGradId})`}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            <path
              d="M 68 52 L 86 82"
              stroke={`url(#${blueGradId})`}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            <circle cx="86" cy="82" r="2.2" fill="#c084fc" opacity="0.9" />
          </g>
        </svg>
      )}
    </div>
  );
}

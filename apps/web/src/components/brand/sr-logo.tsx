import React from 'react';

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

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: config.width, height: config.height }}
      aria-label="Sidhartha Rayudu (SR) Logo"
    >
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

          {/* Electric / Royal Blue Gradient for 'R' */}
          <linearGradient id={blueGradId} x1="52" y1="20" x2="88" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
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

        {/* Ambient Glow Backplate (Subtle neon bloom behind monogram) */}
        {showGlow && (
          <g opacity={size === 'xl' ? '0.45' : '0.3'} filter={`url(#${filterId})`}>
            {/* Letter 'S' Glow Silhouette */}
            <path
              d="M 44 24 H 24 L 14 34 V 44 L 22 52 H 36 L 44 60 V 72 L 34 82 H 14"
              stroke="#00f0ff"
              strokeWidth={config.strokeWidth + 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Letter 'R' Glow Silhouette */}
            <path
              d="M 56 24 V 82 M 56 24 H 74 L 84 34 V 42 L 74 52 H 56 M 68 52 L 86 82"
              stroke="#3b82f6"
              strokeWidth={config.strokeWidth + 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Foreground Sharp Monogram: Distinct S & R */}
        <g id="sr-monogram-foreground">
          {/* === LETTER 'S' (Electric Cyan) === */}
          <path
            d="M 44 24 H 24 L 14 34 V 44 L 22 52 H 36 L 44 60 V 72 L 34 82 H 14"
            stroke={`url(#${cyanGradId})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* S Accent Node: Upper corner tech pip */}
          <circle cx="44" cy="24" r="2.2" fill="#ffffff" opacity="0.9" />

          {/* === LETTER 'R' (Electric Blue) === */}
          {/* Vertical Stem */}
          <path
            d="M 56 24 V 82"
            stroke={`url(#${blueGradId})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Upper Loop */}
          <path
            d="M 56 24 H 74 L 84 34 V 42 L 74 52 H 56"
            stroke={`url(#${blueGradId})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Diagonal Kick Leg */}
          <path
            d="M 68 52 L 86 82"
            stroke={`url(#${blueGradId})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* R Accent Node: Diagonal terminal tech pip */}
          <circle cx="86" cy="82" r="2.2" fill="#93c5fd" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}


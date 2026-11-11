'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CinematicLoader } from './cinematic-loader';
import { CustomCursor } from './custom-cursor';
import { ScrollProgress } from './scroll-progress';
import { ScrollAnimator } from './scroll-animator';

const AuroraWaves = dynamic(
  () => import('@/components/three/particle-universe').then((m) => m.AuroraWaves),
  { ssr: false }
);

export function InteractiveUniverse() {
  return (
    <>
      <CinematicLoader />
      <CustomCursor />
      <ScrollProgress />
      <ScrollAnimator />
      <AuroraWaves />
    </>
  );
}


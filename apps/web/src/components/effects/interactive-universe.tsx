'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CinematicLoader } from './cinematic-loader';
import { CustomCursor } from './custom-cursor';
import { ScrollProgress } from './scroll-progress';
import { ScrollAnimator } from './scroll-animator';

const ParticleUniverse = dynamic(
  () => import('@/components/three/particle-universe').then((m) => m.ParticleUniverse),
  { ssr: false }
);

export function InteractiveUniverse() {
  return (
    <>
      <CinematicLoader />
      <CustomCursor />
      <ScrollProgress />
      <ScrollAnimator />
      <ParticleUniverse />
    </>
  );
}


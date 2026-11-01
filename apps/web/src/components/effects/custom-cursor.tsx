'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // 1. Verify Desktop Fine-Pointer & Reduced Motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    let mouseX = -100;
    let mouseY = -100;
    let currentRingX = -100;
    let currentRingY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setCursorPos({ x: mouseX, y: mouseY });
      if (!visible) setVisible(true);
    };

    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);

    // Magnetic interaction listener for interactive targets
    let activeMagneticElem: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'a, button, input, textarea, select, [role="button"], [data-magnetic="true"]'
      ) as HTMLElement | null;

      if (target) {
        setHovered(true);
        if (target.dataset.magnetic === 'true' || target.tagName === 'BUTTON' || target.tagName === 'A') {
          activeMagneticElem = target;
        }
      } else {
        setHovered(false);
        if (activeMagneticElem) {
          activeMagneticElem.style.transform = '';
          activeMagneticElem = null;
        }
      }
    };

    // Smooth Lerp loop for trailing outer ring and magnetic attraction
    const updateRing = () => {
      animationFrameId = requestAnimationFrame(updateRing);

      let targetX = mouseX;
      let targetY = mouseY;

      // Magnetic attraction to button center if active
      if (activeMagneticElem) {
        const rect = activeMagneticElem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // Pull magnetic element slightly toward mouse (max 8px displacement)
        const pullFactor = 0.22;
        const maxDisplacement = 8;
        const elemMoveX = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaX * pullFactor));
        const elemMoveY = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaY * pullFactor));
        activeMagneticElem.style.transform = `translate(${elemMoveX}px, ${elemMoveY}px)`;
        activeMagneticElem.style.transition = 'transform 0.1s ease-out';

        // Snap ring closer to center of element
        targetX = centerX + deltaX * 0.4;
        targetY = centerY + deltaY * 0.4;
      }

      currentRingX += (targetX - currentRingX) * 0.18;
      currentRingY += (targetY - currentRingY) * 0.18;

      setRingPos({ x: currentRingX, y: currentRingY });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    animationFrameId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (activeMagneticElem) {
        activeMagneticElem.style.transform = '';
      }
    };
  }, [visible]);

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Precision Inner Dot (follows mouse instantly) */}
      <div
        className="pointer-events-none fixed z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] transition-transform duration-75 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 0.6 : 1})`,
        }}
        aria-hidden="true"
      />

      {/* Trailing Ambient Ring / Glowing Aura */}
      <div
        className={`pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out ${
          hovered
            ? 'h-12 w-12 border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,240,255,0.35)]'
            : 'h-8 w-8 border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
        }`}
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 1.25 : 1})`,
        }}
        aria-hidden="true"
      />
    </>
  );
}

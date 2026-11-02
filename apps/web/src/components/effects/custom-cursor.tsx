'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';

function subscribePointer(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mqPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  mqPointer.addEventListener('change', callback);
  mqMotion.addEventListener('change', callback);
  return () => {
    mqPointer.removeEventListener('change', callback);
    mqMotion.removeEventListener('change', callback);
  };
}

function getPointerSnapshot() {
  if (typeof window === 'undefined') return false;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return hasFinePointer && !prefersReducedMotion;
}

function getPointerServerSnapshot() {
  return false;
}

/**
 * High-performance, zero-lag custom cursor.
 * - Updates DOM directly via requestAnimationFrame (0 React re-renders during mouse movement).
 * - Instant precision dot with zero latency.
 * - Responsive, snappy outer ring with GPU-accelerated lerp (no fighting CSS transitions).
 * - Fully disabled on touch / coarse pointer devices and with prefers-reduced-motion.
 * - Guaranteed pointer-events: none to avoid interference with clicks, selections, or scroll.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getPointerServerSnapshot
  );

  useEffect(() => {
    if (!enabled) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHoveringInteractive = false;
    let rafId: number;

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;

    // Single consolidated pointermove listener
    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (dotEl) dotEl.style.opacity = '1';
        if (ringEl) ringEl.style.opacity = '1';
      }

      // Direct instant translation for the precision dot
      if (dotEl) {
        dotEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${
          isHoveringInteractive ? 0.6 : 1
        })`;
      }
    };

    const onPointerDown = () => {
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(0.85)`;
      }
    };

    const onPointerUp = () => {
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
          isHoveringInteractive ? 1.4 : 1
        })`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(
        'a, button, input, textarea, select, [role="button"], [data-magnetic="true"], [tabindex="0"]'
      );

      if (target) {
        isHoveringInteractive = true;
        if (ringEl) {
          ringEl.classList.add('cursor-hovered');
        }
      } else {
        isHoveringInteractive = false;
        if (ringEl) {
          ringEl.classList.remove('cursor-hovered');
        }
      }
    };

    const onMouseLeaveDoc = () => {
      isVisible = false;
      if (dotEl) dotEl.style.opacity = '0';
      if (ringEl) ringEl.style.opacity = '0';
    };

    const onMouseEnterDoc = () => {
      isVisible = true;
      if (dotEl) dotEl.style.opacity = '1';
      if (ringEl) ringEl.style.opacity = '1';
    };

    // Snappy, continuous 60-120fps lerp loop for the trailing ambient ring
    const renderLoop = () => {
      const lerpFactor = 0.32;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      if (ringEl && isVisible) {
        const scale = isHoveringInteractive ? 1.35 : 1;
        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveDoc);
    document.addEventListener('mouseenter', onMouseEnterDoc);

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveDoc);
      document.removeEventListener('mouseenter', onMouseEnterDoc);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Precision Inner Dot (Follows mouse immediately with 0ms lag) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-cyan-400 opacity-0 shadow-[0_0_8px_#00f0ff] will-change-transform"
        style={{
          transition: 'opacity 0.15s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Responsive Trailing Halo Ring (Snappy GPU-accelerated lerp) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-8 w-8 rounded-full border border-cyan-400/50 bg-cyan-500/10 opacity-0 shadow-[0_0_12px_rgba(0,240,255,0.2)] will-change-transform backdrop-blur-[0.5px]"
        style={{
          transition: 'border-color 0.2s ease, background-color 0.2s ease, opacity 0.15s ease-out',
        }}
        aria-hidden="true"
      />
    </>
  );
}

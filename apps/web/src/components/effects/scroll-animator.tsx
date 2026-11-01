'use client';

import React, { useEffect } from 'react';

export function ScrollAnimator() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Reveal on Scroll Observer
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');

            // Broadcast active section to navbar
            const id = entry.target.getAttribute('id');
            if (id) {
              window.dispatchEvent(
                new CustomEvent('active-section-change', { detail: { id } })
              );
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    sections.forEach((sec) => {
      if (!prefersReducedMotion) {
        sec.classList.add('transition-all', 'duration-700', 'ease-out');
        // Let #home remain visible initially
        if (sec.id !== 'home') {
          sec.classList.add('opacity-0', 'translate-y-8');
        }
      }
      observer.observe(sec);
    });

    // 2. Smooth Anchor Navigation Interceptor
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!target) return;

      const hash = target.getAttribute('href');
      if (!hash || hash === '#') return;

      const element = document.querySelector(hash);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
        window.history.pushState(null, '', hash);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
}


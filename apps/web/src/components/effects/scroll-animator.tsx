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

    const scrollToTargetId = (id: string, updateHistory = true) => {
      const cleanId = id.replace(/^\/?#/, '');
      if (!cleanId) return;

      const element = document.getElementById(cleanId);
      if (element) {
        // Offset for fixed navbar (64px) + breathing room (14px)
        const yOffset = -78;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        if (updateHistory) {
          window.history.pushState(null, '', `#${cleanId}`);
        }
      }
    };

    // 2. Smooth Anchor Navigation Interceptor (Catches #contact, /#contact, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null;
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Check if it's an in-page anchor (#section or /#section)
      if (href.startsWith('#') || (href.startsWith('/#') && (window.location.pathname === '/' || window.location.pathname === ''))) {
        e.preventDefault();
        const hash = href.replace(/^\/?#/, '');
        scrollToTargetId(hash, true);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // 3. Handle initial landing on URL with hash (e.g., http://localhost:3000/#contact)
    if (window.location.hash) {
      const initialHash = window.location.hash;
      const initialTimer = setTimeout(() => {
        scrollToTargetId(initialHash, false);
      }, 350);

      return () => {
        observer.disconnect();
        document.removeEventListener('click', handleAnchorClick);
        clearTimeout(initialTimer);
      };
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
}

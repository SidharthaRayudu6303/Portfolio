'use client';

import React, { useEffect } from 'react';

const SECTION_IDS = [
  'home',
  'about',
  'education',
  'skills',
  'projects',
  'experience',
  'hackathons',
  'certifications',
  'contact',
];

export function ScrollAnimator() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Reveal on Scroll Observer & Active Section Broadcaster
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');

            // Broadcast active section to navbar and screen dots
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
        threshold: 0.25,
        rootMargin: '-60px 0px -20% 0px',
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
        const yOffset = -76;
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

      if (
        href.startsWith('#') ||
        (href.startsWith('/#') && (window.location.pathname === '/' || window.location.pathname === ''))
      ) {
        e.preventDefault();
        const hash = href.replace(/^\/?#/, '');
        scrollToTargetId(hash, true);
      }
    };

    // 3. Browser Back / Forward History Navigation
    const handlePopState = () => {
      if (window.location.hash) {
        scrollToTargetId(window.location.hash, false);
      } else {
        scrollToTargetId('home', false);
      }
    };

    // 4. Keyboard Navigation (PageUp / PageDown / ArrowDown / ArrowUp)
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      // Find current section index
      let currentHash = window.location.hash.replace('#', '') || 'home';
      let currentIndex = SECTION_IDS.indexOf(currentHash);
      if (currentIndex === -1) currentIndex = 0;

      if (e.key === 'PageDown' || (e.key === 'ArrowDown' && e.shiftKey)) {
        e.preventDefault();
        const nextIndex = Math.min(SECTION_IDS.length - 1, currentIndex + 1);
        scrollToTargetId(SECTION_IDS[nextIndex], true);
      } else if (e.key === 'PageUp' || (e.key === 'ArrowUp' && e.shiftKey)) {
        e.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        scrollToTargetId(SECTION_IDS[prevIndex], true);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    // 5. Initial landing on URL with hash (e.g. #projects)
    if (window.location.hash) {
      const initialHash = window.location.hash;
      setTimeout(() => {
        scrollToTargetId(initialHash, false);
      }, 350);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past home section (>420px)
      if (window.scrollY > 420) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHome = () => {
    const homeEl = document.getElementById('home');
    if (homeEl) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '#home');
      window.dispatchEvent(
        new CustomEvent('active-section-change', { detail: { id: 'home' } })
      );
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToHome}
      aria-label="Return to top of page"
      className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-neutral-950/85 text-cyan-400 backdrop-blur-md shadow-lg shadow-black/50 transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500/15 hover:shadow-[0_0_16px_rgba(0,240,255,0.4)] hover:text-white cursor-pointer focus:outline-none ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}


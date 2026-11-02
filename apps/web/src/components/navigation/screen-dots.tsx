'use client';

import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'home', label: '01 Home' },
  { id: 'about', label: '02 About' },
  { id: 'education', label: '03 Education' },
  { id: 'skills', label: '04 Skills' },
  { id: 'projects', label: '05 Projects' },
  { id: 'experience', label: '06 Experience' },
  { id: 'hackathons', label: '07 Achievements' },
  { id: 'certifications', label: '08 Certifications' },
  { id: 'contact', label: '09 Contact' },
];

export function ScreenDots() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    function handleActiveSection(e: Event) {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) {
        setActiveSection(customEvent.detail.id);
      }
    }

    window.addEventListener('active-section-change', handleActiveSection);

    // Initial check from hash
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      if (SECTIONS.some((s) => s.id === hashId)) {
        setTimeout(() => setActiveSection(hashId), 0);
      }
    }

    return () => {
      window.removeEventListener('active-section-change', handleActiveSection);
    };
  }, []);

  const handleGlide = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2.5 rounded-full border border-neutral-800/80 bg-neutral-950/70 py-3.5 px-2 backdrop-blur-md shadow-2xl shadow-cyan-950/20"
      aria-label="Section Quick Navigation"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => handleGlide(sec.id)}
            className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
            aria-label={`Navigate to ${sec.label}`}
          >
            {/* Glowing Active Ring or Inactive Pip */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-3 w-3 bg-cyan-400 shadow-[0_0_12px_#00f0ff] ring-2 ring-cyan-400/40'
                  : 'h-1.5 w-1.5 bg-neutral-600 hover:bg-neutral-300 hover:scale-150'
              }`}
            />

            {/* Hover Tooltip on Left */}
            <span className="absolute right-7 rounded-md border border-cyan-500/30 bg-neutral-950/95 px-2.5 py-1 text-[10px] font-mono text-cyan-300 whitespace-nowrap opacity-0 shadow-xl pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
              {sec.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}


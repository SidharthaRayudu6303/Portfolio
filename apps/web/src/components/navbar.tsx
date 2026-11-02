'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { DISPLAY_NAME } from '@/lib/constants';
import { SRLogo } from '@/components/brand/sr-logo';
import { setCharacterReaction, CharacterReaction } from '@/lib/character-state';

interface NavLinkItem {
  label: string;
  href: string;
  reaction?: CharacterReaction;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '#home', reaction: 'home' },
  { label: 'About', href: '#about', reaction: 'about' },
  { label: 'Education', href: '#education', reaction: 'idle' },
  { label: 'Skills', href: '#skills', reaction: 'skills' },
  { label: 'Projects', href: '#projects', reaction: 'projects' },
  { label: 'Experience', href: '#experience', reaction: 'experience' },
  { label: 'Achievements', href: '#hackathons', reaction: 'idle' },
  { label: 'Certifications', href: '#certifications', reaction: 'idle' },
  { label: 'Contact', href: '#contact', reaction: 'contact' },
];

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Laser beam coordinates relative to the nav container
  const navContainerRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [laserStyle, setLaserStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const isProgrammaticScroll = useRef(false);
  const programmaticScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const activeSectionRef = useRef('home');

  const updateLaserPosition = useCallback((sectionId: string) => {
    let targetId = sectionId;
    // Map hackathons section to achievements if referenced
    if (!linkRefs.current[targetId]) {
      if (targetId === 'hackathons') targetId = 'hackathons';
      else targetId = 'home';
    }
    const activeEl = linkRefs.current[targetId] || linkRefs.current['home'];
    const container = navContainerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      if (activeRect.width > 0) {
        setLaserStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          opacity: 1,
        });
      }
    }
  }, []);

  // 1. Direct Continuous Scroll Observer for Active Section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (isProgrammaticScroll.current) return;

      const scrollPos = window.scrollY + 110;
      let matchedId = 'home';

      for (let i = 0; i < NAV_LINKS.length; i++) {
        const id = NAV_LINKS[i].href.replace(/^\/?#/, '');
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            matchedId = id;
          }
        }
      }

      if (matchedId !== activeSectionRef.current) {
        activeSectionRef.current = matchedId;
        setActiveSection(matchedId);
        updateLaserPosition(matchedId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateLaserPosition]);

  // 2. Active Section Event Listener (from scroll-animator or ScreenDots)
  useEffect(() => {
    function handleActiveSection(e: Event) {
      if (isProgrammaticScroll.current) return;
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) {
        const id = customEvent.detail.id;
        activeSectionRef.current = id;
        setActiveSection(id);
        updateLaserPosition(id);
      }
    }

    window.addEventListener('active-section-change', handleActiveSection);
    return () => window.removeEventListener('active-section-change', handleActiveSection);
  }, [updateLaserPosition]);

  // 3. Responsive ResizeObserver, URL Hash & Browser History Listener
  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateLaserPosition(activeSectionRef.current);
    });
    resizeObserver.observe(container);

    const initialHash = window.location.hash.replace('#', '') || 'home';
    activeSectionRef.current = initialHash;
    const initTimer = setTimeout(() => {
      setActiveSection(initialHash);
      updateLaserPosition(initialHash);
    }, 60);

    const handleHistoryNav = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      activeSectionRef.current = hash;
      setActiveSection(hash);
      updateLaserPosition(hash);
    };

    window.addEventListener('popstate', handleHistoryNav);
    window.addEventListener('hashchange', handleHistoryNav);

    return () => {
      clearTimeout(initTimer);
      if (programmaticScrollTimer.current) {
        clearTimeout(programmaticScrollTimer.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('popstate', handleHistoryNav);
      window.removeEventListener('hashchange', handleHistoryNav);
    };
  }, [updateLaserPosition]);

  // Guaranteed smooth-scroll navigation that never gets eaten by router
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') || href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace(/^\/?#/, '');
      const element = document.getElementById(id);

      // Lock scroll observer to prevent indicator jitter during programmatic smooth scroll
      isProgrammaticScroll.current = true;
      if (programmaticScrollTimer.current) {
        clearTimeout(programmaticScrollTimer.current);
      }
      programmaticScrollTimer.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 800);

      activeSectionRef.current = id;
      setActiveSection(id);
      updateLaserPosition(id);

      if (element) {
        // Compensate for fixed navbar height (64px) with breathing space
        const yOffset = -76;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.pushState(null, '', `#${id}`);
      } else {
        router.push(`/#${id}`);
      }
      setMobileMenuOpen(false);
    }
  };

  const handleLinkHover = (reaction?: CharacterReaction) => {
    if (reaction && reaction !== 'idle') {
      setCharacterReaction(reaction);
    }
  };

  const handleLinkLeave = () => {
    setCharacterReaction('idle');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-cyan-500/20 bg-neutral-950/90 shadow-lg shadow-cyan-950/20 backdrop-blur-md'
          : 'border-b border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo with Custom SR Monogram */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="group flex items-center gap-3 text-decoration-none cursor-pointer"
        >
          <div className="relative flex items-center justify-center rounded-xl border border-cyan-500/30 bg-neutral-900/60 p-1.5 transition-all group-hover:border-cyan-400/60 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_16px_rgba(0,240,255,0.3)]">
            <SRLogo size="sm" showGlow={true} animated={true} />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white transition group-hover:text-cyan-400">
              {DISPLAY_NAME}
            </span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              Full-Stack &amp; AI/ML
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links with Horizontal Laser-Light Beam */}
        <nav
          ref={navContainerRef}
          className="relative hidden lg:flex items-center gap-1 rounded-full border border-neutral-800/80 bg-neutral-900/70 px-3 py-1.5 backdrop-blur-md"
        >
          {NAV_LINKS.map((link) => {
            const linkId = link.href.replace('#', '');
            const isActive = activeSection === linkId;
            return (
              <a
                key={link.label}
                ref={(el) => {
                  linkRefs.current[linkId] = el;
                }}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                onMouseEnter={() => handleLinkHover(link.reaction)}
                onMouseLeave={handleLinkLeave}
                className={`relative z-10 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-neutral-300 hover:text-cyan-400'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          {/* ============================================================== */}
          {/* LASER-LIGHT BEAM ACTIVE INDICATOR                              */}
          {/* ============================================================== */}
          <div
            className="absolute bottom-0 pointer-events-none transition-all duration-300 ease-out"
            style={{
              transform: `translateX(${laserStyle.left}px)`,
              width: `${laserStyle.width}px`,
              opacity: laserStyle.opacity,
            }}
          >
            {/* 1. Diffused Outer Soft Blue Glow */}
            <div className="absolute -inset-x-3 -top-[4px] h-[8px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent blur-[6px]" />

            {/* 2. Focused Cyan Neon Glow */}
            <div className="absolute -inset-x-1.5 -top-[2px] h-[5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[2.5px] opacity-90" />

            {/* 3. Core Laser Filament Line */}
            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_8px_#00f0ff]" />

            {/* 4. Center Hot-Spot Light Point */}
            <div className="absolute left-1/2 -top-[1px] h-[4px] w-[14px] -translate-x-1/2 rounded-full bg-white blur-[0.8px] shadow-[0_0_10px_#ffffff]" />
          </div>
        </nav>

        {/* Action Buttons: Admin Portal Only (Public Terminal Removed) */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-mono text-neutral-400 transition hover:border-cyan-500/40 hover:bg-neutral-800 hover:text-white"
            title="Admin CMS Access"
          >
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-400 lg:hidden hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950/95 px-6 py-4 lg:hidden backdrop-blur-xl">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const linkId = link.href.replace('#', '');
              const isActive = activeSection === linkId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="pt-2 border-t border-neutral-800/80">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Menu,
  X,
  Lock,
  ExternalLink,
  Code2,
  Search,
} from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    function handleActiveSection(e: Event) {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) {
        setActiveSection(customEvent.detail.id);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('active-section-change', handleActiveSection);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('active-section-change', handleActiveSection);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Certifications', href: '/#certifications' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-cyan-500/20 bg-neutral-950/90 shadow-lg shadow-cyan-950/20 backdrop-blur-md'
          : 'border-b border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 text-decoration-none"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30 transition group-hover:bg-cyan-500/20 group-hover:ring-cyan-400/60">
            <Terminal className="h-4 w-4 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white transition group-hover:text-cyan-400">
              Sidhartha
            </span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              Dev • Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-neutral-800/80 bg-neutral-900/60 px-3 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = link.href === `#${activeSection}`;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)] border border-cyan-500/40'
                    : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-cyan-400'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            data-magnetic="true"
            className="group flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-mono text-neutral-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            title="Search & Quick Actions (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden xl:inline text-[11px]">QuickNav</span>
            <kbd className="rounded border border-neutral-800 bg-neutral-950 px-1.5 py-0.2 text-[9px] text-neutral-400">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-developer-terminal'))}
            data-magnetic="true"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            title="Interactive Developer Terminal"
          >
            <Code2 className="h-4 w-4" />
          </button>

          <Link
            href="/admin"
            data-magnetic="true"
            className="group flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            title="Admin CMS Portal"
          >
            <Lock className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:scale-110" />
            <span>Admin</span>
          </Link>
          <Link
            href="/#contact"
            data-magnetic="true"
            className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <span>Let&apos;s Connect</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-xl border border-neutral-800 bg-neutral-900/80 p-2 text-neutral-300 hover:text-white focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950/95 px-6 py-6 backdrop-blur-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-cyan-400 transition"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-command-palette'));
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-medium text-neutral-300"
              >
                <Search className="h-3.5 w-3.5 text-cyan-400" />
                <span>Command Palette (⌘K)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-developer-terminal'));
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-medium text-neutral-300"
              >
                <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Interactive Terminal</span>
              </button>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-medium text-neutral-300"
              >
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Admin CMS Portal</span>
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-neutral-950"
              >
                Let&apos;s Connect
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


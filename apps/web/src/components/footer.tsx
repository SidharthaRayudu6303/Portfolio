'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Linkedin,
  Mail,
  Lock,
  Github,
} from 'lucide-react';
import {
  DISPLAY_NAME,
  PROFESSIONAL_TITLE,
  PROFESSIONAL_TAGLINE,
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
} from '@/lib/constants';
import { SRLogo } from '@/components/brand/sr-logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-neutral-800/80 bg-neutral-950/90 py-12 text-neutral-400 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand & Tagline with SR Logo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center rounded-lg border border-cyan-500/30 bg-neutral-900/60 p-1">
                <SRLogo size="xs" showGlow={true} />
              </div>
              <span className="text-base font-bold text-white tracking-wider">{DISPLAY_NAME}</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              {PROFESSIONAL_TITLE} • {PROFESSIONAL_TAGLINE}
            </p>
          </div>

          {/* Quick Links (Blog removed completely) */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <a href="#home" className="hover:text-cyan-400 transition">
              Home
            </a>
            <a href="#about" className="hover:text-cyan-400 transition">
              About
            </a>
            <a href="#education" className="hover:text-cyan-400 transition">
              Education
            </a>
            <a href="#skills" className="hover:text-cyan-400 transition">
              Skills
            </a>
            <a href="#projects" className="hover:text-cyan-400 transition">
              Projects
            </a>
            <a href="#experience" className="hover:text-cyan-400 transition">
              Experience
            </a>
            <a href="#hackathons" className="hover:text-cyan-400 transition">
              Achievements
            </a>
            <a href="#certifications" className="hover:text-cyan-400 transition">
              Certifications
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition">
              Contact
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-white transition"
            >
              <Lock className="h-3 w-3 text-cyan-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {GITHUB_URL && (
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition"
                title="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-cyan-400 transition"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={LEETCODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-800 px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-400 hover:bg-neutral-900 hover:text-amber-400 transition"
              title="LeetCode Profile"
            >
              LC
            </a>
            <a
              href={HACKERRANK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-800 px-2.5 py-1.5 text-xs font-mono font-bold text-neutral-400 hover:bg-neutral-900 hover:text-emerald-400 transition"
              title="HackerRank Profile"
            >
              HR
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-cyan-400 transition"
              title="Direct Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom Metadata & System Status */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/60 pt-6 text-[11px] text-neutral-400 sm:flex-row">
          <p>© {currentYear} {DISPLAY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Full-Stack &amp; AI Engineering Portfolio</span>
            </span>
            <span>•</span>
            <span className="font-mono text-neutral-400">Architecture v7.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Terminal,
  ShieldCheck,
  Linkedin,
  Mail,
  Lock,
  Code,
  Github,
  Terminal as TerminalIcon,
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

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-wider">{DISPLAY_NAME}</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              {PROFESSIONAL_TITLE} • {PROFESSIONAL_TAGLINE}
            </p>
          </div>

          {/* Quick Links */}
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
            <Link href="/#experience" className="hover:text-cyan-400 transition">
              Experience
            </Link>
            <Link href="/#hackathons" className="hover:text-cyan-400 transition">
              Achievements
            </Link>
            <Link href="/#certifications" className="hover:text-cyan-400 transition">
              Certifications
            </Link>
            <Link href="/#coding-profiles" className="hover:text-cyan-400 transition">
              Coding
            </Link>
            <Link href="/blog" className="hover:text-cyan-400 transition">
              Blog
            </Link>
            <Link href="/#contact" className="hover:text-cyan-400 transition">
              Contact
            </Link>
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
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-amber-400 transition font-mono text-xs font-bold"
              title="LeetCode Profile"
            >
              LC
            </a>
            <a
              href={HACKERRANK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-emerald-400 transition font-mono text-xs font-bold"
              title="HackerRank Profile"
            >
              HR
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-cyan-400 transition"
              title="Send Direct Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-neutral-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {currentYear} {DISPLAY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Architecture v7.2 • Next.js &amp; Neon PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

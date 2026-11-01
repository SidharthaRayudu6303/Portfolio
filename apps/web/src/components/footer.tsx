'use client';

import React from 'react';
import Link from 'next/link';
import {
  Terminal,
  ShieldCheck,
  Github,
  Linkedin,
  Mail,
  Lock,
} from 'lucide-react';

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
              <span className="text-base font-bold text-white">Sidhartha</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Full Stack Developer &amp; Tech Enthusiast • Building reliable, high-performance web applications and intelligent systems.
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
            <a href="#projects" className="hover:text-cyan-400 transition">
              Projects
            </a>
            <a href="#skills" className="hover:text-cyan-400 transition">
              Skills
            </a>
            <Link href="/#experience" className="hover:text-cyan-400 transition">
              Experience
            </Link>
            <Link href="/#certifications" className="hover:text-cyan-400 transition">
              Certifications
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
            <a
              href="https://github.com/sidhartha"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/sidhartha"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-blue-400 transition"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:contact@sidhartha.dev"
              className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:bg-neutral-900 hover:text-cyan-400 transition"
              title="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-neutral-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {currentYear} Sidhartha. All rights reserved.</p>
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Architecture v7.2 • Powered by Next.js &amp; Neon PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


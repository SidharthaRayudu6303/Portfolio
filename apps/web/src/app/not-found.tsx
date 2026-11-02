'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Mail, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex items-center justify-center p-6 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-lg text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-mono font-medium text-rose-400">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Error 404 • Route Disconnected</span>
        </div>

        {/* 404 Glitch Text */}
        <h1 className="text-7xl sm:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600 font-mono">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Resource Out of Scope
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
            The requested path does not exist or has been relocated within the portfolio registry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <Home className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 text-xs font-medium text-neutral-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Me</span>
          </Link>

          
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BlogPostDto } from '@portfolio/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  BookOpen,
  User,
} from 'lucide-react';

interface ArticleViewProps {
  post: BlogPostDto | null;
}

export function ArticleView({ post }: ArticleViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center text-neutral-100">
        <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Article Not Found</h1>
        <p className="text-xs text-neutral-400 max-w-sm mb-6">
          The requested article may have been moved, unpublished, or does not exist.
        </p>
        <Link
          href="/blog"
          className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full" />
      </div>

      <article className="relative z-10 mx-auto max-w-3xl px-6 py-12 sm:py-20">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Articles</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-10 border-b border-neutral-800/80 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono text-cyan-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              {calculateReadTime(post.content)}
            </span>
          </div>

          {post.excerpt && (
            <p className="text-sm sm:text-base text-neutral-300 font-sans italic border-l-2 border-cyan-500 pl-4 py-1">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-neutral-300 space-y-5 text-sm sm:text-base leading-relaxed">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-white pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl font-bold text-white pt-6 border-t border-neutral-800">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('```')) {
              const code = paragraph.replace(/```[a-z]*\n?/g, '').trim();
              return (
                <pre
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs overflow-x-auto text-cyan-300"
                >
                  <code>{code}</code>
                </pre>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Author Card Footer */}
        <footer className="mt-14 border-t border-neutral-800/80 pt-8">
          <div className="flex items-center gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">Sidhartha</h4>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Author</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Full-Stack Software Engineer & AI Developer building high-performance web systems, machine learning applications, and interactive 3D graphics.
              </p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}


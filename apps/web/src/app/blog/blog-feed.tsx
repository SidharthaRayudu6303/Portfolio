'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BlogPostDto } from '@portfolio/types';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function BlogFeed() {
  const [posts, setPosts] = useState<BlogPostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    fetch('/api/blog')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load posts');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPosts([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-20">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Technical Writing & Insights</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineering Logs & Deep Dives
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed">
            In-depth architectural breakdowns, lessons from scaling machine learning platforms,
            interactive 3D web implementations, and full-stack software design.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, topic, or tag..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedTag('all')}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  selectedTag === 'all'
                    ? 'border border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                    : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-lg px-3 py-1.5 font-medium transition ${
                    selectedTag === tag
                      ? 'border border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                      : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Post Feed */}
        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-500 flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span>Loading technical articles...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Articles In Preparation
            </h3>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              New deep dives covering GenVision computer vision pipelines, full-stack Next.js/NestJS architecture,
              and 3D particle physics are currently being authored and verified.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-xs font-mono text-cyan-400">
              <span>Status: Editorial Review • Check back soon</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:bg-neutral-900/80 hover:shadow-xl hover:shadow-cyan-950/30"
              >
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-cyan-400" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      {calculateReadTime(post.content)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-white transition group-hover:text-cyan-300 mb-2.5">
                    {post.title}
                  </h2>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[10px] font-mono text-neutral-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


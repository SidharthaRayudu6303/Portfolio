'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Terminal,
  Sparkles,
  ExternalLink,
  Lock,
  Mail,
  Home,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  BookOpen,
  ArrowRight,
  Check,
  Code2,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Projects' | 'Tools & Actions';
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen to keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery('');
            setSelectedIndex(0);
          }
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    function handleOpenPalette() {
      setQuery('');
      setSelectedIndex(0);
      setIsOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenPalette);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenPalette);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const copyEmail = () => {
    navigator.clipboard.writeText('sidhartha.contact.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setIsOpen(false), 800);
  };

  const paletteItems: PaletteItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-home',
        category: 'Navigation',
        title: 'Home / Hero',
        description: 'Scroll to top hero section and 3D character',
        icon: <Home className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#home');
          setIsOpen(false);
        },
        keywords: ['home', 'hero', '3d', 'character', 'top'],
      },
      {
        id: 'nav-about',
        category: 'Navigation',
        title: 'About Sidhartha',
        description: 'Bio, architectural philosophy, and engineering background',
        icon: <User className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#about');
          setIsOpen(false);
        },
        keywords: ['about', 'bio', 'who', 'me', 'background'],
      },
      {
        id: 'nav-projects',
        category: 'Navigation',
        title: 'Featured Projects',
        description: 'View full-stack and machine learning applications',
        icon: <FolderGit2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['projects', 'work', 'code', 'apps', 'demos'],
      },
      {
        id: 'nav-skills',
        category: 'Navigation',
        title: 'Technical Skills',
        description: 'React, Next.js, TypeScript, NestJS, Python, AWS, ML',
        icon: <Cpu className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#skills');
          setIsOpen(false);
        },
        keywords: ['skills', 'tech', 'stack', 'languages', 'frameworks'],
      },
      {
        id: 'nav-experience',
        category: 'Navigation',
        title: 'Experience & History',
        description: 'Engineering journey and milestone projects',
        icon: <Briefcase className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#experience');
          setIsOpen(false);
        },
        keywords: ['experience', 'career', 'jobs', 'history'],
      },
      {
        id: 'nav-blog',
        category: 'Navigation',
        title: 'Technical Blog',
        description: 'Deep dives on engineering, ML, and 3D web experiences',
        icon: <BookOpen className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/blog');
          setIsOpen(false);
        },
        keywords: ['blog', 'articles', 'writing', 'posts', 'guides'],
      },
      {
        id: 'nav-contact',
        category: 'Navigation',
        title: 'Contact Form',
        description: 'Send a verified direct message to Sidhartha',
        icon: <Mail className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#contact');
          setIsOpen(false);
        },
        keywords: ['contact', 'email', 'message', 'hire', 'reach'],
      },

      // Projects
      {
        id: 'p-genvision',
        category: 'Projects',
        title: 'GenVision',
        description: 'Computer Vision & Generative AI Platform (Python, ML, Next.js)',
        icon: <Code2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['genvision', 'ai', 'computer vision', 'python', 'fastapi'],
      },
      {
        id: 'p-bhuyanthra',
        category: 'Projects',
        title: 'BhuYanthra',
        description: 'Geospatial Analytics & Telemetry Platform (TypeScript, React, SQL, AWS)',
        icon: <Code2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['bhuyanthra', 'gis', 'maps', 'geospatial', 'telemetry'],
      },
      {
        id: 'p-robohatch',
        category: 'Projects',
        title: 'Robohatch',
        description: 'Robotics Orchestration & Intelligent Control (Python, ML, Node.js)',
        icon: <Code2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['robohatch', 'robotics', 'automation', 'hardware'],
      },
      {
        id: 'p-smartdonum',
        category: 'Projects',
        title: 'SmartDonum',
        description: 'Transparent Donation & Resource Allocation Platform (Next.js, SQL, AWS)',
        icon: <Code2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['smartdonum', 'donation', 'tracking', 'resource allocation'],
      },
      {
        id: 'p-autism-screening',
        category: 'Projects',
        title: 'Autism Screening Platform',
        description: 'Early Digital Behavioral Screening using Machine Learning Models',
        icon: <Code2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['autism', 'screening', 'healthcare', 'ml', 'machine learning'],
      },
      {
        id: 'p-rental',
        category: 'Projects',
        title: 'Smart Rental Platform',
        description: 'Property Management Platform with Verified Workflows (NestJS, SQL, AWS)',
        icon: <Code2 className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/#projects');
          setIsOpen(false);
        },
        keywords: ['rental', 'property', 'real estate', 'nestjs'],
      },

      // Tools & Actions
      {
        id: 'tool-ai',
        category: 'Tools & Actions',
        title: 'Ask AI Portfolio Assistant',
        description: 'Open conversational AI grounded in verified profile data',
        icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent('open-portfolio-assistant'));
        },
        keywords: ['ai', 'assistant', 'chat', 'bot', 'gemini'],
      },
      {
        id: 'tool-terminal',
        category: 'Tools & Actions',
        title: 'Open Developer Terminal',
        description: 'Interactive CLI shell with portfolio query commands',
        icon: <Terminal className="h-4 w-4 text-cyan-400" />,
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent('open-developer-terminal'));
        },
        keywords: ['terminal', 'cli', 'bash', 'shell', 'developer', 'console'],
      },
      {
        id: 'tool-copy-email',
        category: 'Tools & Actions',
        title: copied ? 'Email Copied!' : 'Copy Contact Email',
        description: 'sidhartha.contact.dev@gmail.com',
        icon: copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Mail className="h-4 w-4 text-cyan-400" />,
        action: copyEmail,
        keywords: ['email', 'copy', 'address', 'contact'],
      },
      {
        id: 'tool-github',
        category: 'Tools & Actions',
        title: 'GitHub Profile',
        description: 'Explore open source repositories and contributions',
        icon: <ExternalLink className="h-4 w-4 text-cyan-400" />,
        action: () => {
          window.open('https://github.com', '_blank');
          setIsOpen(false);
        },
        keywords: ['github', 'git', 'repo', 'open source'],
      },
      {
        id: 'tool-admin',
        category: 'Tools & Actions',
        title: 'Admin CMS Portal',
        description: 'Authenticated dashboard for managing portfolio content',
        icon: <Lock className="h-4 w-4 text-cyan-400" />,
        action: () => {
          router.push('/admin');
          setIsOpen(false);
        },
        keywords: ['admin', 'login', 'cms', 'manage', 'auth'],
      },
    ],
    [copied, router],
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return paletteItems;
    const q = query.toLowerCase();
    return paletteItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [paletteItems, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-28"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Palette Container */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/40 bg-neutral-950/95 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-neutral-800/80 px-4 py-3.5">
          <Search className="h-5 w-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search portfolio... (Press Esc to close)"
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No matching commands or sections found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition ${
                      isSelected
                        ? 'border border-cyan-500/40 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'border border-transparent text-neutral-300 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                          isSelected
                            ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
                            : 'border-neutral-800 bg-neutral-900/60 text-neutral-400'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-100">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-cyan-400/80">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate max-w-sm sm:max-w-md">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                          <span>Enter</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="flex items-center justify-between border-t border-neutral-900 bg-neutral-900/50 px-4 py-2.5 text-[11px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">
                ESC
              </kbd>
              Close
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/70">
            <span>Portfolio QuickNav</span>
          </div>
        </div>
      </div>
    </div>
  );
}

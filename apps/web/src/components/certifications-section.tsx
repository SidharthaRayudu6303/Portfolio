'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  Award,
  ShieldCheck,
  Calendar,
  ExternalLink,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Pause,
  Play,
  Sparkles,
  FileCheck,
  Search,
} from 'lucide-react';

export type CertificateCategory = 'All' | 'Programming' | 'AI / Machine Learning' | 'Professional Skills';

export interface VerifiedCertification {
  id: string;
  title: string;
  issuer: string;
  category: 'Programming' | 'AI / Machine Learning' | 'Professional Skills';
  issueDate: string;
  displayDate: string;
  credentialId: string;
  credentialUrl?: string | null;
  imageUrl: string;
  pdfUrl?: string | null;
  skills: string[];
  description: string;
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
  category?: string;
  pdfUrl?: string | null;
  credentialId?: string;
  skills?: string[];
  description?: string;
}

interface CertificationsSectionProps {
  certifications?: Certification[];
}

// 9 Verified Ground-Truth Credentials directly tied to original documents in public/certificates/
const VERIFIED_CERTIFICATIONS: VerifiedCertification[] = [
  {
    id: 'cert-codetantra-python',
    title: 'Python Programming Course',
    issuer: 'CodeTantra & Sathyabama Institute of Science and Technology',
    category: 'Programming',
    issueDate: '2025-10-14',
    displayDate: 'October 14, 2025',
    credentialId: 'CT1814-uRoRzTo-cdZ',
    credentialUrl: 'https://codetantra.com',
    imageUrl: '/certificates/codetantra-python.png',
    pdfUrl: null,
    skills: ['Python 3', 'Data Structures', 'Functions & Recursion', 'File I/O', 'Algorithmic Problem Solving'],
    description:
      'Rigorous evaluation in Python programming in association with Sathyabama Institute of Science and Technology, validating foundational programming paradigms, data structures, and algorithmic execution.',
    order: 1,
  },
  {
    id: 'cert-infosys-python-basics',
    title: 'Basics of Python',
    issuer: 'Infosys Springboard',
    category: 'Programming',
    issueDate: '2025-06-19',
    displayDate: 'June 19, 2025',
    credentialId: 'INFOSYS-PY-BASICS-2025',
    credentialUrl: 'https://verify.onwingspan.com',
    imageUrl: '/certificates/infosys-python-basics.png',
    pdfUrl: '/certificates/infosys-python-basics.pdf',
    skills: ['Python Fundamentals', 'Conditional Logic', 'Collections & Iteration', 'Computational Logic'],
    description:
      'Comprehensive coursework certified by Infosys Springboard covering procedural syntax, logical branching, data collections, and foundational computational problem solving.',
    order: 2,
  },
  {
    id: 'cert-infosys-python-intro',
    title: 'Introduction to Python',
    issuer: 'Infosys Springboard',
    category: 'Programming',
    issueDate: '2025-06-08',
    displayDate: 'June 8, 2025',
    credentialId: 'INFOSYS-PY-INTRO-2025',
    credentialUrl: 'https://verify.onwingspan.com',
    imageUrl: '/certificates/infosys-python-intro.png',
    pdfUrl: '/certificates/infosys-python-intro.pdf',
    skills: ['Python Syntax', 'Variables & Operators', 'Control Structures', 'Standard Libraries'],
    description:
      'Foundational programming curriculum covering Python environment execution, core control statements, data types, and modular code development.',
    order: 3,
  },
  {
    id: 'cert-oneroadmap-frontend',
    title: 'Frontend Development',
    issuer: 'One Roadmap',
    category: 'Programming',
    issueDate: '2025-09-03',
    displayDate: 'September 3, 2025',
    credentialId: 'CERT-5360A1EB',
    credentialUrl: 'https://oneroadmap.io/skills/frontend/certificate/CERT-5360A1EB',
    imageUrl: '/certificates/oneroadmap-frontend.png',
    pdfUrl: '/certificates/oneroadmap-frontend.pdf',
    skills: ['Modern JavaScript / ES6+', 'HTML5 & Semantic Web', 'CSS3 & Responsive Layouts', 'DOM Manipulation'],
    description:
      'Professional frontend development certification assessing modern client-side architecture, reactive UI patterns, DOM engineering, and web standards compliance.',
    order: 4,
  },
  {
    id: 'cert-mongodb-basics',
    title: 'MongoDB Basics for Students',
    issuer: 'MongoDB, Inc. (MongoDB University)',
    category: 'Programming',
    issueDate: '2025-06-21',
    displayDate: 'June 21, 2025',
    credentialId: 'MDB7j9d1ig1cc',
    credentialUrl: 'https://university.mongodb.com',
    imageUrl: '/certificates/mongodb-basics.png',
    pdfUrl: '/certificates/mongodb-basics.pdf',
    skills: ['NoSQL Architecture', 'CRUD Operations', 'Aggregation Pipeline', 'Document Indexing'],
    description:
      'Official MongoDB developer certification covering BSON document data modeling, query optimization, aggregation pipelines, and production database indexing.',
    order: 5,
  },
  {
    id: 'cert-udemy-chatgpt-genai',
    title: 'ChatGPT Generative AI For Business Leaders | Gen AI Primer',
    issuer: 'Udemy',
    category: 'AI / Machine Learning',
    issueDate: '2025-06-06',
    displayDate: 'June 6, 2025',
    credentialId: 'UC-8c1701c2-8e24-4e32-9068-4fc7a1aaffa4',
    credentialUrl: 'https://ude.my/UC-8c1701c2-8e24-4e32-9068-4fc7a1aaffa4',
    imageUrl: '/certificates/udemy-chatgpt-genai.png',
    pdfUrl: '/certificates/udemy-chatgpt-genai.pdf',
    skills: ['Generative AI', 'Large Language Models (LLMs)', 'Prompt Engineering', 'AI Business Transformation'],
    description:
      'In-depth specialization on generative models, Transformer foundation models, prompt engineering methodologies, and high-impact AI implementation strategies.',
    order: 6,
  },
  {
    id: 'cert-tcs-career-edge',
    title: 'TCS iON Career Edge — Young Professional',
    issuer: 'Tata Consultancy Services (TCS iON)',
    category: 'Professional Skills',
    issueDate: '2025-06-03',
    displayDate: 'June 3, 2025',
    credentialId: '240640-28089178-1016',
    credentialUrl: 'https://learning.tcsionhub.in',
    imageUrl: '/certificates/tcs-career-edge.png',
    pdfUrl: '/certificates/tcs-career-edge.pdf',
    skills: ['Corporate Readiness', 'Business Communication', 'IT & Foundational Analytics', 'Presentation Skills'],
    description:
      'Intensive 14-day professional development program covering corporate communication, presentation mastery, business etiquette, and workplace readiness standards.',
    order: 7,
  },
  {
    id: 'cert-infosys-email-writing',
    title: 'Email Writing Skills',
    issuer: 'Infosys Springboard',
    category: 'Professional Skills',
    issueDate: '2025-06-23',
    displayDate: 'June 23, 2025',
    credentialId: 'INFOSYS-EMAIL-2025',
    credentialUrl: 'https://verify.onwingspan.com',
    imageUrl: '/certificates/infosys-email-writing.png',
    pdfUrl: '/certificates/infosys-email-writing.pdf',
    skills: ['Business Communication', 'Corporate Email Etiquette', 'Tone Modulation', 'Stakeholder Communication'],
    description:
      'Executive communication credential specializing in structured email architecture, professional tone modulation, and cross-functional corporate correspondence.',
    order: 8,
  },
  {
    id: 'cert-infosys-time-management',
    title: 'Time Management',
    issuer: 'Infosys Springboard',
    category: 'Professional Skills',
    issueDate: '2025-06-06',
    displayDate: 'June 6, 2025',
    credentialId: 'INFOSYS-TIME-2025',
    credentialUrl: 'https://verify.onwingspan.com',
    imageUrl: '/certificates/infosys-time-management.png',
    pdfUrl: '/certificates/infosys-time-management.pdf',
    skills: ['Priority Matrix', 'Agile Timeboxing', 'Productivity Optimization', 'Task Planning'],
    description:
      'Operational excellence training focused on Eisenhower matrix prioritization, agile time allocation, milestone tracking, and distraction mitigation.',
    order: 9,
  },
];

// Helper to resolve category badge styles
function getCategoryBadgeStyle(category: string) {
  switch (category) {
    case 'Programming':
      return {
        border: 'border-cyan-500/30',
        bg: 'bg-cyan-950/40',
        text: 'text-cyan-300',
        dot: 'bg-cyan-400',
      };
    case 'AI / Machine Learning':
      return {
        border: 'border-purple-500/30',
        bg: 'bg-purple-950/40',
        text: 'text-purple-300',
        dot: 'bg-purple-400',
      };
    case 'Professional Skills':
    default:
      return {
        border: 'border-blue-500/30',
        bg: 'bg-blue-950/40',
        text: 'text-blue-300',
        dot: 'bg-blue-400',
      };
  }
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  // Merge or fallback to verified database
  const allItems: VerifiedCertification[] = useMemo(() => {
    if (!certifications || certifications.length === 0) {
      return VERIFIED_CERTIFICATIONS;
    }

    // Merge incoming dynamic API items with verified records
    return VERIFIED_CERTIFICATIONS.map((verified) => {
      const match = certifications.find(
        (c) => c.title.toLowerCase() === verified.title.toLowerCase() || c.id === verified.id
      );
      if (!match) return verified;
      return {
        ...verified,
        credentialUrl: match.credentialUrl ?? verified.credentialUrl,
        imageUrl: match.imageUrl ?? verified.imageUrl,
        order: match.order ?? verified.order,
      };
    });
  }, [certifications]);

  // State
  const [activeCategory, setActiveCategory] = useState<CertificateCategory>('All');
  const [selectedCert, setSelectedCert] = useState<VerifiedCertification | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Subscribe to prefers-reduced-motion safely
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Modal Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Refs
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: allItems.length,
      Programming: allItems.filter((c) => c.category === 'Programming').length,
      'AI / Machine Learning': allItems.filter((c) => c.category === 'AI / Machine Learning').length,
      'Professional Skills': allItems.filter((c) => c.category === 'Professional Skills').length,
    };
  }, [allItems]);

  // Filtered certificates
  const filteredCerts = useMemo(() => {
    if (activeCategory === 'All') return allItems;
    return allItems.filter((c) => c.category === activeCategory);
  }, [allItems, activeCategory]);

  // Continuous marquee animation loop via requestAnimationFrame
  useEffect(() => {
    if (prefersReducedMotion || isPaused || isHovered) return;

    const container = marqueeContainerRef.current;
    if (!container) return;

    let animId: number;
    let lastTimestamp = performance.now();
    const speed = 45; // Pixels per second: smooth, legible glide

    const step = (currentTimestamp: number) => {
      const delta = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;

      if (container) {
        container.scrollLeft += speed * delta;
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion, isPaused, isHovered, activeCategory, filteredCerts]);

  // Manual scroll controls
  const handleScrollManual = useCallback((direction: 'left' | 'right') => {
    const container = marqueeContainerRef.current;
    if (!container) return;
    const scrollAmount = 380;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  // Modal navigation
  const openModal = useCallback((cert: VerifiedCertification) => {
    setSelectedCert(cert);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedCert(null);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    document.body.style.overflow = '';
  }, []);

  const goToAdjacentCert = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedCert) return;
      const currentIndex = filteredCerts.findIndex((c) => c.id === selectedCert.id);
      if (currentIndex === -1) return;

      let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex >= filteredCerts.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = filteredCerts.length - 1;

      setSelectedCert(filteredCerts[nextIndex]);
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    },
    [selectedCert, filteredCerts]
  );

  // Zoom helpers
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const next = Math.max(1, +(prev - 0.25).toFixed(2));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation for Modal
  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        goToAdjacentCert('prev');
      } else if (e.key === 'ArrowRight') {
        goToAdjacentCert('next');
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert, closeModal, goToAdjacentCert, handleZoomIn, handleZoomOut, handleResetZoom]);

  // Pan / Drag handling when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomLevel <= 1) return;
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch pan handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 || e.touches.length === 0) return;
    setIsPanning(true);
    panStartRef.current = {
      x: e.touches[0].clientX - pan.x,
      y: e.touches[0].clientY - pan.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || zoomLevel <= 1 || e.touches.length === 0) return;
    setPan({
      x: e.touches[0].clientX - panStartRef.current.x,
      y: e.touches[0].clientY - panStartRef.current.y,
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Ensure marquee list has sufficient length to seamlessly loop
  const marqueeItems = useMemo(() => {
    let base = filteredCerts;
    while (base.length < 8) {
      base = [...base, ...filteredCerts];
    }
    // Duplicate 2x for continuous seamless right-to-left marquee wrap
    return [...base, ...base];
  }, [filteredCerts]);

  const categories: CertificateCategory[] = [
    'All',
    'Programming',
    'AI / Machine Learning',
    'Professional Skills',
  ];

  return (
    <section
      id="certifications"
      className="scroll-mt-24 py-24 border-b border-neutral-800/80 relative overflow-hidden bg-[#050505]"
    >
      {/* Ambient Cyber Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* ======================================================== */}
        {/* SECTION HEADER                                           */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <Award className="h-3.5 w-3.5 text-cyan-400" />
              <span>ACCREDITATIONS &amp; CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Verified Industry{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Certifications
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Authentic credentials earned from premier technology institutions and global industry leaders in
              Python Software Engineering, Generative AI &amp; LLMs, NoSQL Systems, and Professional Leadership.
            </p>
          </div>

          {/* Verification Badge & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2 text-xs font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{allItems.length} Authenticated Records</span>
            </div>

            {/* Play / Pause Toggle Button */}
            {!prefersReducedMotion && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs font-mono text-neutral-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
                title={isPaused ? 'Resume marquee motion' : 'Pause marquee motion'}
                aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              >
                {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-400" /> : <Pause className="h-3.5 w-3.5 text-cyan-400" />}
                <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            {/* Manual Left/Right Chevrons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScrollManual('left')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-cyan-500/50 hover:bg-neutral-800 hover:text-cyan-300 transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollManual('right')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-cyan-500/50 hover:bg-neutral-800 hover:text-cyan-300 transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CATEGORY FILTER TABS                                     */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'border border-neutral-800/90 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 hover:bg-neutral-850/60'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-mono font-bold ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* HORIZONTAL CONTINUOUS MARQUEE CAROUSEL                   */}
      {/* ======================================================== */}
      <div
        className="w-full relative py-4 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsHovered(false), 2000);
        }}
      >
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-20" />

        {/* Scrollable track containing duplicated marquee items */}
        <div
          ref={marqueeContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none px-6 select-none"
          style={{ scrollBehavior: 'auto' }}
        >
          {marqueeItems.map((cert, index) => {
            const badgeStyle = getCategoryBadgeStyle(cert.category);
            return (
              <div
                key={`${cert.id}-${index}`}
                onClick={() => openModal(cert)}
                className="group relative w-[310px] sm:w-[360px] shrink-0 rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:bg-neutral-900/90 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                {/* Certificate Preview Image Frame */}
                <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950/90 mb-4 group-hover:border-cyan-500/40 transition">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 640px) 310px, 360px"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    priority={index < 4}
                  />

                  {/* Top Floating Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase border backdrop-blur-md ${badgeStyle.border} ${badgeStyle.bg} ${badgeStyle.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
                      {cert.category}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border border-emerald-500/40 bg-emerald-950/80 text-emerald-400 backdrop-blur-md shadow-sm shadow-emerald-950/40">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Hover Overlay with Inspect Icon */}
                  <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-cyan-300 font-mono text-xs font-semibold">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/50">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                    <span>Click to Inspect High-Def</span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="flex-1 flex flex-col">
                  {/* Issue Date & ID Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      <span>{cert.displayDate}</span>
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[140px]">
                      {cert.credentialId}
                    </span>
                  </div>

                  {/* Certificate Title */}
                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition">
                    {cert.title}
                  </h3>

                  {/* Issuer */}
                  <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1.5 line-clamp-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{cert.issuer}</span>
                  </p>

                  {/* Core Skills Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-neutral-800 bg-neutral-900/90 px-2 py-0.5 text-[10px] font-mono text-neutral-400 group-hover:border-cyan-500/20 group-hover:text-neutral-300 transition"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="rounded-md border border-neutral-800 bg-neutral-900/90 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                        +{cert.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-medium inline-flex items-center gap-1 group-hover:underline">
                    <span>Inspect Credential</span>
                    <ZoomIn className="h-3 w-3" />
                  </span>

                  <div className="flex items-center gap-2">
                    {cert.pdfUrl && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-400" title="Original PDF available">
                        <FileText className="h-3.5 w-3.5 text-red-400" />
                        <span className="hidden sm:inline">PDF</span>
                      </span>
                    )}
                    {cert.credentialUrl && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-400" title="Online verification available">
                        <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Verify</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* HIGH-DEFINITION DETAIL MODAL / VIEWER                    */}
      {/* ======================================================== */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-cert-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-hidden animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-neutral-950/95 shadow-2xl shadow-cyan-950/40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800/90 px-4 sm:px-6 py-3.5 bg-neutral-900/60 backdrop-blur-md">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40">
                  <Award className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <h3 id="modal-cert-title" className="text-sm sm:text-base font-bold text-white truncate">
                    {selectedCert.title}
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-400 truncate flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{selectedCert.issuer}</span>
                  </p>
                </div>
              </div>

              {/* Zoom & Close Toolbar */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    title="Zoom out (-)"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>

                  <span className="font-mono text-xs text-neutral-300 px-2 min-w-[48px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    title="Zoom in (+)"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    title="Reset zoom (0)"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:border-neutral-700 hover:text-white transition"
                  title="Close modal (Esc)"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split between High-Definition Viewer and Metadata Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
              {/* Left / Top: Interactive Certificate Viewer */}
              <div
                className="lg:col-span-7 bg-[#030303] flex items-center justify-center p-4 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] border-b lg:border-b-0 lg:border-r border-neutral-800/80 overflow-hidden select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
              >
                {/* Floating Navigation Controls on Viewer */}
                <button
                  type="button"
                  onClick={() => goToAdjacentCert('prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-white shadow-lg backdrop-blur-md hover:border-cyan-400 hover:bg-neutral-800 transition"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => goToAdjacentCert('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-white shadow-lg backdrop-blur-md hover:border-cyan-400 hover:bg-neutral-800 transition"
                  aria-label="Next certificate"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* High-Definition Certificate Image with Zoom & Pan Transform */}
                <div
                  className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="relative w-full max-w-[620px] aspect-[16/11] rounded-xl overflow-hidden border border-neutral-800/90 shadow-2xl shadow-black/80 bg-neutral-950">
                    <Image
                      src={selectedCert.imageUrl}
                      alt={selectedCert.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 650px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Zoom / Pan Help Hint */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none rounded-full bg-neutral-900/80 border border-neutral-800 px-3 py-1 text-[10px] font-mono text-neutral-400 backdrop-blur-md">
                  {zoomLevel > 1 ? 'Drag image to pan fine print' : 'Use + / - buttons to inspect details'}
                </div>
              </div>

              {/* Right / Bottom: Detailed Metadata & Action Drawer */}
              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-neutral-950/70 overflow-y-auto">
                <div className="space-y-5">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      <span>{selectedCert.category}</span>
                    </span>

                    <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Verified Document</span>
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {selectedCert.title}
                    </h4>
                    <div className="mt-1 flex items-start gap-1.5 text-xs text-neutral-300">
                      <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{selectedCert.issuer}</span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <span>Issue Date</span>
                      </span>
                      <span className="font-mono text-white font-medium">{selectedCert.displayDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/80">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <FileCheck className="h-3.5 w-3.5 text-neutral-400" />
                        <span>Credential ID</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-semibold text-[11px] truncate max-w-[140px]">
                          {selectedCert.credentialId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(selectedCert.credentialId)}
                          className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:text-cyan-300 transition"
                          title="Copy Credential ID"
                          aria-label="Copy ID"
                        >
                          {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Academic / Technical Curriculum Overview */}
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Curriculum &amp; Evaluation
                    </h5>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {selectedCert.description}
                    </p>
                  </div>

                  {/* Skills Validated */}
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Validated Technical Skills
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 px-2.5 py-1 text-xs font-mono text-cyan-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5">
                  {selectedCert.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition shadow-lg shadow-cyan-950/30"
                    >
                      <span>Verify on Official Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {selectedCert.pdfUrl ? (
                      <>
                        <a
                          href={selectedCert.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900/80 hover:border-neutral-500 px-3 py-2 text-xs font-medium text-neutral-200 transition"
                        >
                          <FileText className="h-3.5 w-3.5 text-red-400" />
                          <span>View PDF</span>
                        </a>

                        <a
                          href={selectedCert.pdfUrl}
                          download
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900/80 hover:border-neutral-500 px-3 py-2 text-xs font-medium text-neutral-200 transition"
                        >
                          <Download className="h-3.5 w-3.5 text-neutral-400" />
                          <span>Download</span>
                        </a>
                      </>
                    ) : (
                      <a
                        href={selectedCert.imageUrl}
                        download
                        className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900/80 hover:border-neutral-500 px-3 py-2 text-xs font-medium text-neutral-200 transition"
                      >
                        <Download className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Download High-Definition Image</span>
                      </a>
                    )}
                  </div>

                  {/* Step Indicator */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2">
                    <span>
                      Certificate {filteredCerts.findIndex((c) => c.id === selectedCert.id) + 1} of{' '}
                      {filteredCerts.length}
                    </span>
                    <span className="text-[10px]">Use ← / → keys to navigate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

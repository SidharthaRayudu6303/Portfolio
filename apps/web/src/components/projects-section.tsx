'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectArtwork } from './project-artwork';
import {
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  ArrowUpRight,
  Star,
  Sparkles,
  Layers,
  Code2,
} from 'lucide-react';
import { ProjectModal, Project } from './project-modal';

interface ProjectsSectionProps {
  projects?: Project[];
}

// 6 verified projects with complete confirmed specifications
export const VERIFIED_DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-genvision',
    title: 'GenVision: A Cloud Severity-Aware Transformer-Diffusion Framework',
    slug: 'genvision',
    imageUrl: '/projects/genvision.svg',
    description:
      'An AI/ML-based satellite image reconstruction framework designed to recover cloud-obscured regions in satellite imagery and support agricultural analysis.',
    problemSolved:
      'Cloud coverage in satellite images can hide important geographical information, affecting remote sensing and agricultural monitoring.',
    whyBuilt:
      'To explore how AI and deep learning can reconstruct missing satellite image regions and improve the usability of remote sensing data.',
    myContribution:
      'Research, System architecture, AI/ML workflow, Frontend development, and Integration.',
    features: [
      'Cloud detection',
      'Cloud severity analysis',
      'Satellite image reconstruction',
      'Temporal image analysis',
      'Agricultural analysis',
    ],
    techStack: [
      'Next.js',
      'React',
      'Python processing services',
      'Transformers',
      'Diffusion Models',
      'Computer Vision',
      'Image Inpainting',
    ],
    status: 'Final-year project — In Development',
    featured: true,
    order: 1,
    liveUrl: 'https://gen-vision-nu.vercel.app/',
    githubUrl: null, // Intentionally left empty as instructed
  },
  {
    id: 'proj-bhuyanthra',
    title: 'BhuYanthra — AI-Powered Agricultural Intelligence Platform',
    slug: 'bhuyanthra',
    imageUrl: '/projects/bhuyanthra.svg',
    description:
      'An agricultural intelligence platform that uses satellite imagery and geospatial analysis to support agricultural monitoring and decision-making.',
    problemSolved:
      'Lack of accessible satellite-based agricultural insights and difficulties monitoring agricultural land over time.',
    whyBuilt:
      'To explore how satellite data and AI can help improve agricultural monitoring and decision-making (BAH \'26).',
    myContribution:
      'Frontend development, Integration of geospatial data, and Platform development.',
    features: [
      'Satellite imagery visualization',
      'Agricultural monitoring',
      'Geospatial analysis',
      'Remote sensing data integration',
    ],
    techStack: [
      'Next.js',
      'React',
      'Python',
      'ISRO Bhuvan',
      'Sentinel-2',
      'Geospatial Analysis',
    ],
    status: 'In Development',
    featured: true,
    order: 2,
    liveUrl: null,
    githubUrl: null,
  },
  {
    id: 'proj-robohatch',
    title: 'Robohatch — 3D Printed Products E-commerce Platform',
    slug: 'robohatch',
    imageUrl: '/projects/robohatch.svg',
    description:
      'An e-commerce platform designed for showcasing and selling 3D-printed products through an intuitive online shopping experience.',
    myContribution:
      'Full-stack development, Frontend implementation, Backend API integration, and Cloud deployment.',
    features: [
      'Product listings',
      'Product details',
      'Shopping experience',
      'Backend API integration',
      'Responsive interface',
    ],
    techStack: ['Next.js', 'NestJS', 'TypeScript', 'REST APIs', 'AWS', 'Vercel'],
    status: 'Developed / Deployed',
    featured: true,
    order: 3,
    liveUrl: 'https://robohatch-platform-web.vercel.app/',
    githubUrl: 'https://github.com/Chandrasekhar246800/robohatch-platform.git',
  },
  {
    id: 'proj-smartdonum',
    title: 'SmartDonum — Donation Management Platform',
    slug: 'smartdonum',
    imageUrl: '/projects/smartdonum.svg',
    description:
      'A donation management platform connecting donors and beneficiaries to make donations of food, clothing, and books more accessible and organized.',
    myContribution:
      'Frontend development, Application design, API integration, and Platform development.',
    features: [
      'Donation management',
      'Donor & beneficiary workflows',
      'Donation listings',
      'Responsive user interface',
    ],
    techStack: ['React.js', 'Next.js', 'REST APIs', 'MySQL'],
    status: 'Developed / Deployed',
    featured: true,
    order: 4,
    liveUrl: 'https://smartdonum.vercel.app/',
    githubUrl: 'https://github.com/Chandrasekhar246800/smartdonum.git',
  },
  {
    id: 'proj-autism',
    title: 'Autism Screening Platform',
    slug: 'autism-screening-platform',
    imageUrl: '/projects/autism-screening.svg',
    description:
      'A web-based autism screening platform designed to provide an accessible interface for screening-related assessments and media submissions.',
    problemSolved:
      'Provides an accessible digital interface for early screening assessments and media submissions (non-clinical screening evaluation tool).',
    myContribution:
      'Frontend development and implementation of application workflows.',
    features: [
      'Landing page',
      'Account creation',
      'Dashboard',
      'Camera scanning interface',
      'Video upload functionality',
    ],
    techStack: ['React', 'Vite', 'TypeScript'],
    status: 'Developed / Deployed',
    featured: false,
    order: 5,
    liveUrl: 'https://autism-screening-platform.vercel.app/',
    githubUrl: 'https://github.com/SidharthaRayudu6303/autism_screening_platform.git',
  },
  {
    id: 'proj-rental',
    title: 'Smart Rental Platform — Equipment & Fleet Management Dashboard',
    slug: 'smart-rental-platform',
    imageUrl: '/projects/smart-rental.svg',
    description:
      'An equipment and fleet management platform designed to help monitor rental equipment, track operations, and visualize key business information.',
    problemSolved:
      'Built during CAT Hackathon to streamline rental telematics, predictive utilization, and operational diagnostics.',
    myContribution:
      'Frontend development, Dashboard implementation, API integration, and Application development.',
    features: [
      'Equipment tracking',
      'Fleet management dashboard',
      'Analytics & telemetry',
      'Forecasting',
      'Alerts',
    ],
    techStack: ['React.js', 'Next.js', 'REST APIs', 'Vercel'],
    status: 'Developed / Deployed',
    featured: false,
    order: 6,
    liveUrl: 'https://cat-hackathon-nu.vercel.app/dashboard',
    githubUrl: 'https://github.com/SidharthaRayudu6303/CAT_Hackathon.git',
  },
];

type CategoryFilter = 'All' | 'AI/ML' | 'Full-Stack' | 'Web' | 'Hackathons';

const CATEGORIES: CategoryFilter[] = ['All', 'AI/ML', 'Full-Stack', 'Web', 'Hackathons'];

function getProjectCategories(project: Project): CategoryFilter[] {
  const cats: CategoryFilter[] = ['All'];
  const slug = project.slug.toLowerCase();
  const tech = project.techStack.map((t) => t.toLowerCase());
  const title = project.title.toLowerCase();
  const desc = project.description.toLowerCase();

  // AI/ML
  if (
    slug.includes('genvision') ||
    slug.includes('bhuyanthra') ||
    tech.some(
      (t) =>
        t.includes('transformer') ||
        t.includes('diffusion') ||
        t.includes('vision') ||
        t.includes('geospatial')
    )
  ) {
    cats.push('AI/ML');
  }

  // Full-Stack
  if (
    slug.includes('robohatch') ||
    slug.includes('smartdonum') ||
    slug.includes('rental') ||
    tech.some((t) => t.includes('nestjs') || t.includes('mysql') || t.includes('aws') || t.includes('rest'))
  ) {
    cats.push('Full-Stack');
  }

  // Web
  if (
    slug.includes('genvision') ||
    slug.includes('robohatch') ||
    slug.includes('smartdonum') ||
    slug.includes('autism') ||
    slug.includes('rental') ||
    tech.some((t) => t.includes('react') || t.includes('next.js') || t.includes('vite'))
  ) {
    cats.push('Web');
  }

  // Hackathons
  if (
    slug.includes('bhuyanthra') ||
    slug.includes('rental') ||
    title.includes('hackathon') ||
    desc.includes('hackathon') ||
    project.whyBuilt?.toLowerCase().includes('bah')
  ) {
    cats.push('Hackathons');
  }

  return cats;
}

function getProjectImage(slug: string, explicitImg?: string | null): string {
  if (explicitImg && explicitImg.trim() !== '') return explicitImg;
  const s = slug.toLowerCase();
  if (s.includes('genvision')) return '/projects/genvision.svg';
  if (s.includes('bhuyanthra')) return '/projects/bhuyanthra.svg';
  if (s.includes('robohatch')) return '/projects/robohatch.svg';
  if (s.includes('smartdonum')) return '/projects/smartdonum.svg';
  if (s.includes('autism')) return '/projects/autism-screening.svg';
  if (s.includes('rental')) return '/projects/smart-rental.svg';
  return '/projects/genvision.svg';
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // If projects exist from DB, use them; otherwise use VERIFIED_DEFAULT_PROJECTS
  const allProjects =
    projects && projects.length > 0 ? projects : VERIFIED_DEFAULT_PROJECTS;

  // Filter projects based on active category
  const filteredProjects = allProjects.filter((project) =>
    getProjectCategories(project).includes(activeCategory)
  );

  const total = filteredProjects.length;

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = setTimeout(() => {
      setPrefersReducedMotion(mediaQuery.matches);
    }, 0);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // Reset active index when category changes
  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setActiveIndex(0);
  };

  // Next / Prev handlers
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return; // Do not navigate carousel when modal is open
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, selectedProject]);

  // Touch / Swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    if (deltaX > 50) {
      handleNext();
    } else if (deltaX < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section id="projects" className="scroll-mt-16 min-h-screen flex flex-col justify-center py-20 border-b border-neutral-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-blue-600/5 blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        {/* ========================================================= */}
        {/* Section Header                                             */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3.5 py-1 text-xs font-mono font-bold tracking-widest text-cyan-400 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>MY PROJECTS</span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Featured Work
          </h2>

          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-neutral-400">
            Interactive 3D showcase of verified full-stack applications, AI frameworks, and engineering platforms.
          </p>
        </div>

        {/* ========================================================= */}
        {/* Category Filter Pills                                      */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
          {CATEGORIES.map((cat) => {
            const count = allProjects.filter((p) =>
              getProjectCategories(p).includes(cat)
            ).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`group flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono transition-all duration-300 ${
                  isActive
                    ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] font-semibold'
                    : 'border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white hover:bg-neutral-850/80'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? 'bg-cyan-400/30 text-cyan-200'
                      : 'bg-neutral-800 text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3D Interactive Carousel Container                          */}
        {/* ========================================================= */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full py-6 select-none"
          style={{ perspective: prefersReducedMotion ? 'none' : '1200px' }}
        >
          {total === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-800 text-center text-neutral-400">
              <Code2 className="h-10 w-10 text-neutral-600 mb-2" />
              <p className="text-sm">No projects found in this category.</p>
            </div>
          ) : (
            <>
              {/* Carousel Stage (Height matches tallest card to prevent layout shift) */}
              <div className="relative w-full h-[580px] sm:h-[620px] md:h-[660px] flex items-center justify-center overflow-visible">
                {filteredProjects.map((project, index) => {
                  // Compute circular distance
                  let diff = (index - activeIndex) % total;
                  if (diff < -Math.floor(total / 2)) diff += total;
                  if (diff > Math.floor(total / 2)) diff -= total;

                  const isActive = diff === 0;
                  const isPrev = diff === -1;
                  const isNext = diff === 1;
                  const isVisible = Math.abs(diff) <= 1;

                  // 3D Transform calculations
                  let transform = '';
                  let opacity = 0;
                  let zIndex = 10;
                  let pointerEvents: 'auto' | 'none' = 'none';

                  if (prefersReducedMotion) {
                    // 2D fallback for accessibility
                    if (isActive) {
                      transform = 'translateX(0%) scale(1)';
                      opacity = 1;
                      zIndex = 30;
                      pointerEvents = 'auto';
                    } else if (isPrev) {
                      transform = 'translateX(-52%) scale(0.86)';
                      opacity = 0.45;
                      zIndex = 20;
                      pointerEvents = 'auto';
                    } else if (isNext) {
                      transform = 'translateX(52%) scale(0.86)';
                      opacity = 0.45;
                      zIndex = 20;
                      pointerEvents = 'auto';
                    } else {
                      transform = `translateX(${diff > 0 ? 100 : -100}%) scale(0.7)`;
                      opacity = 0;
                    }
                  } else {
                    // Full 3D perspective - perfectly centered and balanced
                    if (isActive) {
                      transform =
                        'translateX(0%) scale(1) translateZ(0px) rotateY(0deg)';
                      opacity = 1;
                      zIndex = 30;
                      pointerEvents = 'auto';
                    } else if (isPrev) {
                      transform =
                        'translateX(-52%) scale(0.84) translateZ(-80px) rotateY(18deg)';
                      opacity = 0.6;
                      zIndex = 20;
                      pointerEvents = 'auto';
                    } else if (isNext) {
                      transform =
                        'translateX(52%) scale(0.84) translateZ(-80px) rotateY(-18deg)';
                      opacity = 0.6;
                      zIndex = 20;
                      pointerEvents = 'auto';
                    } else {
                      transform = `translateX(${
                        diff > 0 ? 105 : -105
                      }%) scale(0.68) translateZ(-160px) rotateY(${
                        diff > 0 ? -28 : 28
                      }deg)`;
                      opacity = 0;
                    }
                  }

                  const projectImage = getProjectImage(project.slug, project.imageUrl);
                  const isDev = project.status?.toLowerCase().includes('development');

                  return (
                    <div
                      key={project.id}
                      onClick={() => {
                        if (!isActive) {
                          setActiveIndex(index);
                        }
                      }}
                      className="absolute top-0 left-1/2 w-[90vw] max-w-[640px] transition-all duration-500 ease-out will-change-transform"
                      style={{
                        transform: `translateX(-50%) ${transform}`,
                        transformOrigin: 'center center',
                        opacity,
                        zIndex,
                        pointerEvents,
                        cursor: !isActive && isVisible ? 'pointer' : 'default',
                      }}
                    >
                      {/* Card Shell */}
                      <div
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl transition-all duration-500 ${
                          isActive
                            ? 'border-2 border-cyan-400 bg-neutral-900/95 shadow-[0_0_45px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400/50'
                            : 'border border-neutral-700/60 bg-neutral-900/80 shadow-2xl hover:border-cyan-500/40'
                        }`}
                      >
                        {/* Overlay on inactive cards to visually push them into background */}
                        {!isActive && (
                          <div className="absolute inset-0 z-30 bg-neutral-950/45 transition-colors hover:bg-neutral-950/25" />
                        )}

                        {/* Top: 16:9 Artwork Preview Banner */}
                        <div className="relative w-full aspect-video sm:h-64 overflow-hidden border-b border-neutral-800 bg-neutral-950">
                          <ProjectArtwork
                            src={projectImage}
                            alt={project.title}
                            title={project.title}
                            priority={isActive}
                            sizes="(max-width: 768px) 92vw, 680px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Gradient Vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent pointer-events-none" />

                          {/* Floating Top Badges */}
                          <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                              {project.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                  <Star className="h-3 w-3 fill-cyan-400 text-cyan-400" />
                                  <span>Featured</span>
                                </span>
                              )}
                              {project.status && (
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono backdrop-blur-md ${
                                    isDev
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  }`}
                                >
                                  {project.status}
                                </span>
                              )}
                            </div>

                            {/* Slide Counter */}
                            <span className="rounded-full bg-neutral-950/80 px-2.5 py-0.5 font-mono text-[11px] text-neutral-300 border border-neutral-800 backdrop-blur-md">
                              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 sm:p-6 space-y-4">
                          {/* Title */}
                          <div>
                            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          {/* Problem statement teaser if available */}
                          {project.problemSolved && (
                            <p className="text-xs text-neutral-400 border-l-2 border-cyan-500/50 pl-3 italic line-clamp-1">
                              &ldquo;{project.problemSolved}&rdquo;
                            </p>
                          )}

                          {/* Tech Stack Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.techStack.slice(0, 6).map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-0.5 text-[11px] font-mono text-neutral-300 group-hover:border-neutral-700"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 6 && (
                              <span className="rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-0.5 text-[11px] font-mono text-cyan-400">
                                +{project.techStack.length - 6} more
                              </span>
                            )}
                          </div>

                          {/* Action Buttons Row */}
                          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                            {/* Inspect Architecture / Details button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-xs font-mono font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                              <span>Inspect Details</span>
                            </button>

                            {/* External Links: GitHub & Live Demo */}
                            <div className="flex items-center gap-2">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-xs font-mono text-neutral-300 hover:border-neutral-700 hover:text-white hover:bg-neutral-850 transition"
                                  title="View GitHub Repository"
                                >
                                  <Github className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Code</span>
                                </a>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 rounded-xl border border-cyan-500/30 bg-neutral-950/80 px-3 py-2 text-xs font-mono font-medium text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition"
                                  title="Open Live Deployment"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Live</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls: Arrows & Indicators */}
              <div className="mt-8 flex flex-col items-center gap-4">
                {/* Arrow Buttons & Slide Number */}
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={total <= 1}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-neutral-850 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Previous project slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Slide Indicator Dots */}
                  <div className="flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-900/60 px-3 py-2 backdrop-blur-md">
                    {filteredProjects.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={`transition-all duration-300 ${
                          i === activeIndex
                            ? 'h-2 w-7 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]'
                            : 'h-2 w-2 rounded-full bg-neutral-700 hover:bg-neutral-500'
                        }`}
                        aria-label={`Jump to project slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={total <= 1}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-neutral-850 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Next project slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Subtitle helper */}
                <p className="font-mono text-[11px] text-neutral-500">
                  Use arrow keys or swipe to navigate • Click side cards to rotate
                </p>
              </div>
            </>
          )}
        </div>

        {/* Deep Dive Inspect Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}

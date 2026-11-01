import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { ViewTracker } from '@/components/effects/view-tracker';
import { PortfolioAssistant } from '@/components/assistant/portfolio-assistant';
import { CommandPalette } from '@/components/palette/command-palette';
import { DeveloperTerminal } from '@/components/terminal/developer-terminal';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sidhartha-portfolio.vercel.app';

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sidhartha | Full-Stack Software Engineer & AI Developer',
    template: '%s | Sidhartha',
  },
  description:
    'Verified personal portfolio of Sidhartha featuring high-performance full-stack web platforms, machine learning architectures, and interactive 3D graphics.',
  keywords: [
    'Sidhartha',
    'Full-Stack Developer',
    'Software Engineer',
    'React',
    'Next.js 16',
    'TypeScript',
    'NestJS 11',
    'Python',
    'Machine Learning',
    'Computer Vision',
    'GenVision',
    'BhuYanthra',
    'Three.js',
    'PostgreSQL',
    'Neon',
  ],
  authors: [{ name: 'Sidhartha', url: siteUrl }],
  creator: 'Sidhartha',
  publisher: 'Sidhartha',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Sidhartha | Full-Stack Software Engineer & AI Developer',
    description:
      'Explore verified portfolio projects (GenVision, BhuYanthra), neural machine learning platforms, and interactive 3D web experiences.',
    siteName: 'Sidhartha Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sidhartha - Full-Stack Software Engineer & AI Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sidhartha | Full-Stack Software Engineer & AI Developer',
    description:
      'High-performance web applications, machine learning architectures, and interactive 3D graphics.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Sidhartha',
      jobTitle: 'Full-Stack Software Engineer & AI Developer',
      description:
        'Full-stack software engineer specializing in scalable web platforms, high-performance backends, machine learning applications, and interactive 3D web experiences.',
      url: siteUrl,
      sameAs: [
        'https://github.com/sidhartha',
        'https://linkedin.com/in/sidhartha',
      ],
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Node.js',
        'NestJS',
        'Python',
        'SQL',
        'AWS',
        'Machine Learning',
        'Computer Vision',
        'Three.js',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Sidhartha Portfolio',
      description: 'Personal portfolio of Sidhartha',
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-black text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <ViewTracker />
        {children}
        <PortfolioAssistant />
        <CommandPalette />
        <DeveloperTerminal />
      </body>
    </html>
  );
}

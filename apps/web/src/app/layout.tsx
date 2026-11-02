import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { ViewTracker } from '@/components/effects/view-tracker';
import { PortfolioAssistant } from '@/components/assistant/portfolio-assistant';
import {
  DISPLAY_NAME,
  FULL_LEGAL_NAME,
  PROFESSIONAL_TITLE,
  PROFESSIONAL_TAGLINE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_LOCATION,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
  EDUCATION_DATA,
} from '@/lib/constants';

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
    default: `${DISPLAY_NAME} | ${PROFESSIONAL_TITLE}`,
    template: `%s | ${DISPLAY_NAME}`,
  },
  description: `${PROFESSIONAL_TAGLINE} Computer Science and Engineering student at ${EDUCATION_DATA.institution}.`,
  keywords: [
    'Sidhartha Rayudu',
    'Madhavarapu Sidhartha Rayudu',
    'Full-Stack Developer',
    'AI ML Engineer',
    'React.js',
    'Next.js 16',
    'TypeScript',
    'Python',
    'NestJS 11',
    'Machine Learning',
    'Computer Vision',
    'GenVision',
    'BhuYanthra',
    'Robohatch',
    'SmartDonum',
    'PostgreSQL',
    'Sathyabama Institute of Science and Technology',
    'Kakinada',
  ],
  authors: [{ name: DISPLAY_NAME, url: siteUrl }],
  creator: DISPLAY_NAME,
  publisher: DISPLAY_NAME,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: `${DISPLAY_NAME} | ${PROFESSIONAL_TITLE}`,
    description: PROFESSIONAL_TAGLINE,
    siteName: `${DISPLAY_NAME} Portfolio`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${DISPLAY_NAME} - ${PROFESSIONAL_TITLE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${DISPLAY_NAME} | ${PROFESSIONAL_TITLE}`,
    description: PROFESSIONAL_TAGLINE,
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
      name: FULL_LEGAL_NAME,
      alternateName: DISPLAY_NAME,
      jobTitle: PROFESSIONAL_TITLE,
      description: PROFESSIONAL_TAGLINE,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kakinada',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'India',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: EDUCATION_DATA.institution,
      },
      url: siteUrl,
      sameAs: [
        LINKEDIN_URL,
        LEETCODE_URL,
        HACKERRANK_URL,
      ],
      knowsAbout: [
        'Python',
        'JavaScript',
        'TypeScript',
        'React.js',
        'Next.js',
        'Node.js',
        'NestJS',
        'MySQL',
        'PostgreSQL',
        'AWS',
        'Machine Learning',
        'Computer Vision',
        'Geospatial Analysis',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: `${DISPLAY_NAME} Portfolio`,
      description: `Official personal engineering portfolio of ${DISPLAY_NAME}`,
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
      </body>
    </html>
  );
}

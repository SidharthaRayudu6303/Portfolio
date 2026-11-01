import type { Metadata } from 'next';
import React from 'react';
import { BlogFeed } from './blog-feed';

export const metadata: Metadata = {
  title: 'Technical Blog & Engineering Logs',
  description:
    'In-depth architectural breakdowns, computer vision and machine learning platform designs, and interactive 3D web engineering by Sidhartha.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Technical Blog & Engineering Logs | Sidhartha',
    description:
      'In-depth architectural breakdowns, computer vision and machine learning platform designs, and interactive 3D web engineering by Sidhartha.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Blog & Engineering Logs | Sidhartha',
    description:
      'In-depth architectural breakdowns, machine learning platforms, and 3D web engineering by Sidhartha.',
  },
};

export default function BlogListingPage() {
  return <BlogFeed />;
}

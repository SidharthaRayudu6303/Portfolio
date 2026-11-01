import type { Metadata } from 'next';
import React from 'react';
import { BACKEND_API_URL } from '@/lib/constants';
import { BlogPostDto } from '@portfolio/types';
import { ArticleView } from './article-view';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPostDto | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/blog/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested technical blog post could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sidhartha-portfolio.vercel.app';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: 'Sidhartha' }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: `${post.title} | Sidhartha`,
      description: post.excerpt,
      url: postUrl,
      publishedTime: post.publishedAt || post.createdAt,
      authors: ['Sidhartha'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  return <ArticleView post={post} />;
}

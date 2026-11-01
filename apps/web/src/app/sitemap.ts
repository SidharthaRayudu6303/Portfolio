import { MetadataRoute } from 'next';
import { BACKEND_API_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sidhartha-portfolio.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const res = await fetch(`${BACKEND_API_URL}/blog`, {
      cache: 'no-store',
    });

    if (!res.ok) return staticRoutes;

    const posts = await res.json();
    if (!Array.isArray(posts)) return staticRoutes;

    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}


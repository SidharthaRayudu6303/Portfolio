import { NextRequest } from 'next/server.js';
import { proxyPublicGet } from '@/lib/bff-proxy';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxyPublicGet(`/blog/${slug}`);
}


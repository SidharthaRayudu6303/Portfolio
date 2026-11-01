import { NextRequest, NextResponse } from 'next/server.js';
import { BACKEND_API_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    const backendRes = await fetch(`${BACKEND_API_URL}/analytics/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
        'user-agent': userAgent,
      },
      body: JSON.stringify({
        path: body.path || '/',
        referrer: body.referrer || null,
        device: body.device || 'desktop',
      }),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json({ recorded: false }, { status: 200 }); // Do not throw on analytics
  }
}


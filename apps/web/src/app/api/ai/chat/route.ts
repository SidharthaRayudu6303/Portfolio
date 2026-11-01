import { NextRequest, NextResponse } from 'next/server.js';
import { BACKEND_API_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return NextResponse.json(
        { error: 'Valid prompt message is required.' },
        { status: 400 },
      );
    }

    if (body.message.length > 500) {
      return NextResponse.json(
        { error: 'Message must not exceed 500 characters.' },
        { status: 400 },
      );
    }

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const backendRes = await fetch(`${BACKEND_API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify({ message: body.message.trim() }),
    });

    if (backendRes.status === 429) {
      return NextResponse.json(
        {
          text: 'Assistant rate limit reached. Please wait a moment before sending another message.',
          source: 'local_fallback',
        },
        { status: 429 },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      {
        text: 'The portfolio assistant is currently temporarily unavailable. Please explore the portfolio sections directly.',
        source: 'local_fallback',
      },
      { status: 503 },
    );
  }
}


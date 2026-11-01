import { NextRequest, NextResponse } from 'next/server.js';
import { BACKEND_API_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Silent Bot Honeypot Trap
    if (body.website || body.honeypot || body.company_fax) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been received successfully. Thank you for reaching out!',
      });
    }

    // 2. Basic payload validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 },
      );
    }

    if (typeof body.name !== 'string' || body.name.length > 100) {
      return NextResponse.json({ error: 'Name must not exceed 100 characters.' }, { status: 400 });
    }

    if (typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    if (typeof body.message !== 'string' || body.message.length > 3000) {
      return NextResponse.json(
        { error: 'Message must not exceed 3000 characters.' },
        { status: 400 },
      );
    }

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const backendRes = await fetch(`${BACKEND_API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify({
        name: body.name.trim(),
        email: body.email.trim(),
        message: body.message.trim(),
      }),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('Contact BFF error:', err?.message || err);
    return NextResponse.json(
      { error: 'Contact service unavailable. Please reach out via email directly.' },
      { status: 503 },
    );
  }
}

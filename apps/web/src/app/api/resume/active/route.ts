import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/resume/active`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ available: false }, { status: 200 });
  }
}


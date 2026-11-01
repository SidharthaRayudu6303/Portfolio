import { NextRequest, NextResponse } from 'next/server.js';
import { verifyCsrfToken } from './csrf.ts';
import { ADMIN_SESSION_COOKIE, CSRF_COOKIE, BACKEND_API_URL } from './constants.ts';

/**
 * Proxies public GET requests to the backend API without exposing internal backend URLs.
 */
export async function proxyPublicGet(backendPath: string) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${backendPath}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
  }
}

/**
 * Proxies authenticated admin GET requests (e.g. analytics stats).
 * Enforces:
 * 1. HttpOnly session cookie extraction.
 * 2. Backend JwtAuthGuard verification.
 */
export async function proxyAdminGet(req: NextRequest, backendPath: string) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required' },
      { status: 401 },
    );
  }

  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}${backendPath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-forwarded-for': clientIp,
      },
      cache: 'no-store',
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      { error: 'Backend operation failed' },
      { status: 503 },
    );
  }
}

/**
 * Proxies authenticated admin mutations (POST, PUT, DELETE).
 * Enforces:
 * 1. CSRF double-submit token validation.
 * 2. HttpOnly session cookie extraction (never trust client-supplied tokens).
 * 3. Client IP forwarding.
 * 4. Backend JwtAuthGuard verification.
 */
export async function proxyAdminMutation(
  req: NextRequest,
  backendPath: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
) {
  // 1. Enforce CSRF protection on mutating requests
  const cookieCsrfToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerCsrfToken = req.headers.get('x-csrf-token');

  if (!verifyCsrfToken(cookieCsrfToken, headerCsrfToken)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 },
    );
  }

  // 2. Enforce admin session cookie
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required' },
      { status: 401 },
    );
  }

  // 3. Parse body for POST / PUT / PATCH
  let bodyPayload: any = undefined;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    try {
      bodyPayload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request JSON body' }, { status: 400 });
    }
  }

  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}${backendPath}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-forwarded-for': clientIp,
      },
      body: bodyPayload !== undefined ? JSON.stringify(bodyPayload) : undefined,
    });

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      { error: 'Backend operation failed' },
      { status: 503 },
    );
  }
}

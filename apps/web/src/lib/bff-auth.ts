import { NextRequest, NextResponse } from 'next/server.js';
import { generateCsrfToken, verifyCsrfToken } from './csrf.ts';
import { ADMIN_SESSION_COOKIE, CSRF_COOKIE, BACKEND_API_URL } from './constants.ts';

/**
 * BFF Handler for issuing CSRF double-submit token.
 */
export async function handleBffCsrf() {
  const csrfToken = generateCsrfToken();
  const isProduction = process.env.NODE_ENV === 'production';

  const response = NextResponse.json({ csrfToken });

  response.cookies.set({
    name: CSRF_COOKIE,
    value: csrfToken,
    httpOnly: false, // Must be readable by client script to send in x-csrf-token header
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 3600, // 8 hours
  });

  return response;
}

/**
 * BFF Handler for Admin Login:
 * Enforces CSRF token, forwards credentials + client IP to backend,
 * and sets HttpOnly session cookie without leaking accessToken in JSON body.
 */
export async function handleBffLogin(req: NextRequest) {
  // 1. Enforce CSRF protection on mutating login request
  const cookieCsrfToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerCsrfToken = req.headers.get('x-csrf-token');

  if (!verifyCsrfToken(cookieCsrfToken, headerCsrfToken)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token. Please refresh and try again.' },
      { status: 403 },
    );
  }

  // 2. Parse body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // 3. Extract client IP to forward to backend rate limiter
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  try {
    // 4. Contact NestJS backend
    const backendRes = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': clientIp,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.message || 'Authentication failed' },
        { status: backendRes.status },
      );
    }

    const { accessToken, user } = data;
    const isProduction = process.env.NODE_ENV === 'production';

    // 5. Build response without exposing accessToken in JSON payload
    const response = NextResponse.json({
      success: true,
      user,
    });

    // 6. Set secure HttpOnly session cookie
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 3600, // 8 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 503 },
    );
  }
}

/**
 * BFF Handler for Admin Logout:
 * Enforces CSRF, invalidates session on backend (tokenVersion bump), and clears HttpOnly cookie.
 */
export async function handleBffLogout(req: NextRequest) {
  // 1. Enforce CSRF protection on mutating logout request
  const cookieCsrfToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerCsrfToken = req.headers.get('x-csrf-token');

  if (!verifyCsrfToken(cookieCsrfToken, headerCsrfToken)) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 },
    );
  }

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 2. Invalidate session on backend if token exists
  if (token) {
    try {
      await fetch(`${BACKEND_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-forwarded-for': clientIp,
        },
      });
    } catch {
      // Proceed with clearing client session
    }
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully. Session invalidated.',
  });

  // 3. Clear HttpOnly session cookie
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}

/**
 * BFF Handler for Admin Session Profile (Me):
 * Reads HttpOnly cookie and validates session against backend.
 */
export async function handleBffMe(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, error: 'No active session' },
      { status: 401 },
    );
  }

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!backendRes.ok) {
      // Session expired or revoked on backend: clear cookie
      const response = NextResponse.json(
        { authenticated: false, error: 'Session expired or revoked' },
        { status: 401 },
      );
      response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    const user = await backendRes.json();
    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, error: 'Authentication service temporarily unreachable' },
      { status: 503 },
    );
  }
}


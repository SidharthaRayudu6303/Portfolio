import test, { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from 'next/server.js';
import {
  handleBffLogin,
  handleBffLogout,
  handleBffMe,
  handleBffCsrf,
} from './bff-auth.ts';
import { ADMIN_SESSION_COOKIE, CSRF_COOKIE } from './constants.ts';

describe('BFF Authentication & Cookie Handling', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('CSRF handler should issue a fresh CSRF token and set lax cookie', async () => {
    const res = await handleBffCsrf();
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(typeof body.csrfToken, 'string');
    assert.strictEqual(body.csrfToken.length, 64);

    const setCookie = res.cookies.get(CSRF_COOKIE);
    assert.ok(setCookie);
    assert.strictEqual(setCookie.value, body.csrfToken);
    assert.strictEqual(setCookie.httpOnly, false); // Client must read it to send header
  });

  it('Login handler should reject request without valid CSRF tokens', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@portfolio.dev', password: 'Password123!' }),
    });

    const res = await handleBffLogin(req);
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.match(body.error, /CSRF/i);
  });

  it('Login handler should forward credentials and set HttpOnly session cookie without leaking accessToken', async () => {
    const validCsrf = 'a'.repeat(64);

    // Mock successful backend response
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          accessToken: 'mock.super.secret.jwt.token',
          user: { id: 'admin-1', email: 'admin@portfolio.dev', role: 'admin' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': validCsrf,
        cookie: `${CSRF_COOKIE}=${validCsrf}`,
      },
      body: JSON.stringify({ email: 'admin@portfolio.dev', password: 'ValidPassword123!' }),
    });

    const res = await handleBffLogin(req);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.user.email, 'admin@portfolio.dev');
    // Security Rule: Access token must NEVER be returned in response body!
    assert.strictEqual(body.accessToken, undefined);

    // Cookie Verification
    const sessionCookie = res.cookies.get(ADMIN_SESSION_COOKIE);
    assert.ok(sessionCookie);
    assert.strictEqual(sessionCookie.value, 'mock.super.secret.jwt.token');
    assert.strictEqual(sessionCookie.httpOnly, true);
    assert.strictEqual(sessionCookie.sameSite, 'lax');
    assert.strictEqual(sessionCookie.maxAge, 8 * 3600);
  });

  it('Login handler should propagate backend 429 lockout status to client', async () => {
    const validCsrf = 'b'.repeat(64);

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          statusCode: 429,
          message: 'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': validCsrf,
        cookie: `${CSRF_COOKIE}=${validCsrf}`,
      },
      body: JSON.stringify({ email: 'admin@portfolio.dev', password: 'Password123!' }),
    });

    const res = await handleBffLogin(req);
    assert.strictEqual(res.status, 429);
    const body = await res.json();
    assert.match(body.error, /Too many failed login attempts/i);
  });

  it('Logout handler should invalidate backend session and clear HttpOnly cookie', async () => {
    const validCsrf = 'c'.repeat(64);
    let backendLogoutCalled = false;

    globalThis.fetch = async (url) => {
      if (url.toString().includes('/auth/logout')) {
        backendLogoutCalled = true;
      }
      return new Response(JSON.stringify({ message: 'Logged out' }), { status: 200 });
    };

    const req = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: {
        'x-csrf-token': validCsrf,
        cookie: `${CSRF_COOKIE}=${validCsrf}; ${ADMIN_SESSION_COOKIE}=mock.active.token`,
      },
    });

    const res = await handleBffLogout(req);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(backendLogoutCalled, true);

    const clearedCookie = res.cookies.get(ADMIN_SESSION_COOKIE);
    assert.ok(clearedCookie);
    assert.strictEqual(clearedCookie.maxAge, 0);
  });

  it('Me handler should reject with 401 when session cookie is absent', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
    });

    const res = await handleBffMe(req);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.authenticated, false);
  });

  it('Me handler should return user profile when session cookie is valid', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({ id: 'admin-1', email: 'admin@portfolio.dev', role: 'admin' }),
        { status: 200 },
      );

    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        cookie: `${ADMIN_SESSION_COOKIE}=valid.token`,
      },
    });

    const res = await handleBffMe(req);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.authenticated, true);
    assert.strictEqual(body.user.email, 'admin@portfolio.dev');
  });

  it('Me handler should clear session cookie and return 401 if backend reports session revoked', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({ statusCode: 401, message: 'Session has been revoked.' }),
        { status: 401 },
      );

    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        cookie: `${ADMIN_SESSION_COOKIE}=revoked.token`,
      },
    });

    const res = await handleBffMe(req);
    assert.strictEqual(res.status, 401);
    const clearedCookie = res.cookies.get(ADMIN_SESSION_COOKIE);
    assert.ok(clearedCookie);
    assert.strictEqual(clearedCookie.maxAge, 0);
  });
});

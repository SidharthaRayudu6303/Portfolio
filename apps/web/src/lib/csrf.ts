import crypto from 'node:crypto';

/**
 * Generates a cryptographically secure random token for CSRF defense.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validates CSRF double-submit token comparing header value to cookie value
 * using timingSafeEqual to avoid timing side-channel attacks.
 */
export function verifyCsrfToken(cookieToken?: string | null, headerToken?: string | null): boolean {
  if (!cookieToken || !headerToken) {
    return false;
  }

  if (typeof cookieToken !== 'string' || typeof headerToken !== 'string') {
    return false;
  }

  const cookieBuf = Buffer.from(cookieToken, 'utf-8');
  const headerBuf = Buffer.from(headerToken, 'utf-8');

  if (cookieBuf.length !== headerBuf.length || cookieBuf.length === 0) {
    return false;
  }

  return crypto.timingSafeEqual(cookieBuf, headerBuf);
}


/**
 * Client-side utility for authenticated BFF mutations with double-submit CSRF protection.
 */
export async function getCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/csrf');
    if (!res.ok) return null;
    const data = await res.json();
    return data.csrfToken || null;
  } catch {
    return null;
  }
}

export const getClientCsrfToken = getCsrfToken;

export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const csrfToken = await getCsrfToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (csrfToken) {
    headers.set('x-csrf-token', csrfToken);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}


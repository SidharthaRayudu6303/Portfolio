import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/constants';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    // If attempting to access login page while already authenticated
    if (isLoginPage && sessionToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // If attempting to access protected admin pages without session cookie
    if (!isLoginPage && !sessionToken) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};


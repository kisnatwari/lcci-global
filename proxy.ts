import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken } from './lib/auth/token';
import { getServerSessionData } from './lib/auth/cookies-server';
import { getSessionCookieName } from './lib/auth/session';

/**
 * Next.js 16 Proxy - Replaces deprecated middleware.ts
 * Protects /admin routes by validating authentication and role
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Get encrypted session from cookie
    const encryptedSession = request.cookies.get(getSessionCookieName())?.value;
    
    if (!encryptedSession) {
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('login', 'true');
      homeUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(homeUrl);
    }

    // Decrypt session
    const session = getServerSessionData(request.cookies);
    if (!session || !session.accessToken) {
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('login', 'true');
      homeUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(homeUrl);
    }

    const token = session.accessToken;

    // Validate token
    try {
      const payload = await validateToken(token);
      
      // If token is invalid or expired
      if (!payload) {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('login', 'true');
        homeUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(homeUrl);
      }

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('login', 'true');
        homeUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(homeUrl);
      }

      // Check if user is admin (use role from session or token payload)
      const userRole = (session.role || payload.role || '').toLowerCase();
      if (userRole !== 'admin') {
        // Not an admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Token is valid and user is admin, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Proxy token validation error:', error);
      // Token validation failed, redirect to home with login modal
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('login', 'true');
      homeUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes to run proxy on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};


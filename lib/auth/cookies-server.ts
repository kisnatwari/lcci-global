/**
 * Server-Side Cookie Management
 * 
 * Server-only functions for reading encrypted session cookies.
 * These functions work with Next.js cookies() API.
 */

import { getSession } from './session';
import { getSessionCookieName } from './session';
import type { SessionData } from './session';

/**
 * Get session from cookies (server-side)
 * Note: This is a server-side only function that takes cookieStore as parameter
 */
export function getServerSessionData(cookieStore: any): SessionData | null {
  const encryptedSession = cookieStore.get(getSessionCookieName())?.value;
  if (!encryptedSession) {
    return null;
  }
  
  return getSession(encryptedSession);
}

/**
 * Get access token from session (server-side)
 */
export function getServerAuthToken(cookieStore: any): string | null {
  const session = getServerSessionData(cookieStore);
  return session?.accessToken || null;
}

/**
 * Get refresh token from session (server-side)
 */
export function getServerRefreshToken(cookieStore: any): string | null {
  const session = getServerSessionData(cookieStore);
  return session?.refreshToken || null;
}

/**
 * Get user role from session (server-side)
 */
export function getServerUserRole(cookieStore: any): string | null {
  const session = getServerSessionData(cookieStore);
  return session?.role || null;
}


'use client';

/**
 * Cookie Management for Authentication
 * 
 * Handles encrypted session storage in cookies for both client and server-side access.
 * Session data is encrypted before storage and decrypted when retrieved.
 */

import Cookies from 'js-cookie';
import { createSession, getSession, getSessionCookieName, type SessionData } from './session';

// Cookie security options
const cookieOptions = {
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const, // CSRF protection
  path: '/', // Available site-wide
  httpOnly: false, // Must be false for client-side JavaScript access
};

/**
 * Set encrypted session cookie (client-side)
 */
export function setAuthSession(
  accessToken: string, 
  refreshToken: string, 
  role: string, 
  userId?: string,
  userName?: string,
  userEmail?: string
) {
  const sessionData: SessionData = {
    accessToken,
    refreshToken,
    role,
    userId,
    userName,
    userEmail,
    expiresAt: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };

  const encryptedSession = createSession(sessionData);
  
  Cookies.set(getSessionCookieName(), encryptedSession, {
    ...cookieOptions,
    expires: 7, // 7 days
  });
}

/**
 * Get session from cookies (client-side)
 */
export function getAuthSession(): SessionData | null {
  const encryptedSession = Cookies.get(getSessionCookieName());
  if (!encryptedSession) {
    return null;
  }
  
  return getSession(encryptedSession);
}

/**
 * Get access token from session (client-side)
 */
export function getAuthToken(): string | undefined {
  const session = getAuthSession();
  return session?.accessToken;
}

/**
 * Get refresh token from session (client-side)
 */
export function getRefreshToken(): string | undefined {
  const session = getAuthSession();
  return session?.refreshToken;
}

/**
 * Get user role from session (client-side)
 */
export function getUserRole(): string | undefined {
  const session = getAuthSession();
  return session?.role;
}

/**
 * Clear authentication session (client-side)
 */
export function clearAuthSession() {
  Cookies.remove(getSessionCookieName(), { path: '/' });
  // Also clear old cookies if they exist (for migration)
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  Cookies.remove('userRole', { path: '/' });
}

// Server-side cookie functions are in cookies-server.ts
// Import from '@/lib/auth/cookies-server' in Server Components and proxy.ts


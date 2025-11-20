/**
 * Server-Side Authentication Helpers
 * 
 * Functions for checking authentication and role in Server Components.
 * These functions read from encrypted session cookies and validate tokens.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateToken, type TokenPayload } from './token';
import { getServerSessionData } from './cookies-server';

export interface ServerSession {
  token: string;
  payload: TokenPayload;
  userId: string;
  role: string;
}

/**
 * Get server session from encrypted cookie
 * Returns null if not authenticated
 */
export async function getServerSession(): Promise<ServerSession | null> {
  try {
    const cookieStore = await cookies();
    const session = getServerSessionData(cookieStore);

    if (!session || !session.accessToken) {
      return null;
    }

    // Validate token
    const payload = await validateToken(session.accessToken);
    if (!payload) {
      return null;
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt && session.expiresAt < currentTime) {
      return null;
    }

    return {
      token: session.accessToken,
      payload,
      userId: session.userId || payload.sub || '',
      role: session.role || payload.role || '',
    };
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

/**
 * Require authentication - throws error or redirects if not authenticated
 */
export async function requireAuth(): Promise<ServerSession> {
  const session = await getServerSession();
  if (!session) {
    redirect('/?login=true');
  }
  return session;
}

/**
 * Require specific role - throws error or redirects if role doesn't match
 */
export async function requireRole(requiredRole: string): Promise<ServerSession> {
  const session = await requireAuth();
  
  if (session.role !== requiredRole) {
    redirect('/');
  }
  
  return session;
}

/**
 * Check if user has specific role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const session = await getServerSession();
  return session?.role === requiredRole;
}


/**
 * Authentication System - Main Entry Point
 * 
 * This file re-exports client-side auth functions for easier imports.
 * 
 * NOTE: Server-side functions are NOT exported here to prevent importing
 * server-only code in client components. Import them directly from their files
 * when needed in Server Components.
 */

// Session Management (client-safe)
export { 
  createSession, 
  getSession, 
  getSessionCookieName,
  type SessionData 
} from './session';

// Cookie Management (client-side only)
export {
  setAuthSession,
  getAuthSession,
  getAuthToken,
  getRefreshToken,
  getUserRole,
  clearAuthSession,
} from './cookies';

// Token Validation (client-safe utilities)
export {
  decodeToken,
  isTokenExpired,
  getTokenRole,
  getTokenUserId,
  type TokenPayload,
} from './token';

// Logout (client-side)
export { logout } from './logout';

// Server-side functions - import directly from their files:
// - getServerSession, requireAuth, requireRole: import from '@/lib/auth/server-auth'
// - getServerSessionData, getServerAuthToken, etc.: import from '@/lib/auth/cookies-server'
// - validateToken: import from '@/lib/auth/token' (server-side validation)


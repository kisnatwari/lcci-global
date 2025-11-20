// Use simple encryption that works in both browser and Node.js
import { encrypt, decrypt } from './simple-encrypt';

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  role: string;
  userId?: string;
  userName?: string; // User's full name from login
  userEmail?: string; // User's email from login
  expiresAt?: number;
}

const SESSION_COOKIE_NAME = 'auth.session';

/**
 * Create encrypted session data (synchronous)
 */
export function createSession(data: SessionData): string {
  const sessionData = JSON.stringify(data);
  return encrypt(sessionData);
}

/**
 * Decrypt and parse session data (synchronous)
 */
export function getSession(encryptedSession: string): SessionData | null {
  try {
    const decrypted = decrypt(encryptedSession);
    return JSON.parse(decrypted) as SessionData;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Get session cookie name
 */
export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

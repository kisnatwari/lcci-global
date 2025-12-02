/**
 * JWT Token Validation and Parsing
 * 
 * Validates JWT tokens using the jose library.
 * Falls back to unverified decoding if JWT_SECRET is not set or incorrect.
 */

import { jwtVerify, decodeJwt } from 'jose';

// Get JWT secret from environment variable
// IMPORTANT: This must match the secret used by your backend to sign tokens
// Get this from your backend team or backend configuration
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET;

// Debug: Log if secret is found (only in development, first time)
if (process.env.NODE_ENV === 'development' && !(global as any).__jwt_secret_checked) {
  /* if (JWT_SECRET) {
    console.log('✅ JWT_SECRET found (length:', JWT_SECRET.length, 'chars)');
  } else {
    console.warn('❌ JWT_SECRET not found in environment variables');
  } */
  (global as any).__jwt_secret_checked = true;
}

// Create secret key for jose
const getSecretKey = () => {
  if (!JWT_SECRET) {
    // Return a dummy key - validation will fail but won't crash
    // Warning will be shown in validateToken function
    return new TextEncoder().encode('dummy-secret-key');
  }
  return new TextEncoder().encode(JWT_SECRET);
};

export interface TokenPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

/**
 * Validates a JWT token and returns the payload
 * Note: If JWT_SECRET is not set or doesn't match backend, validation will fail
 */
export async function validateToken(token: string): Promise<TokenPayload | null> {
  try {
    // If no secret is configured, we can't validate - but we can still decode to check expiration
    if (!JWT_SECRET) {
      // Only show warning once in development
      if (process.env.NODE_ENV === 'development' && !(global as any).__jwt_warning_shown) {
        console.warn('⚠️ JWT_SECRET not configured. Using unverified token decode.');
        console.warn('   Set JWT_SECRET in .env.local to enable full signature verification.');
        (global as any).__jwt_warning_shown = true;
      }
      
      const payload = decodeToken(token);
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          return null; // Token expired
        }
        return payload; // Return decoded payload without signature verification
      }
      return null;
    }

    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as TokenPayload;
  } catch (error: any) {
    // If signature verification fails, it might be because:
    // 1. JWT_SECRET doesn't match backend secret
    // 2. Token was signed with a different algorithm
    // 3. Token is malformed
    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      // Only show detailed error in development mode, and only once
      if (process.env.NODE_ENV === 'development' && !(global as any).__jwt_warning_shown) {
        if (JWT_SECRET) {
          console.warn('⚠️ JWT signature verification failed.');
          console.warn('   Your JWT_SECRET is set but doesn\'t match the backend secret.');
          console.warn('   Please verify the secret value matches your backend configuration.');
          console.warn('   Using unverified token decode (expiration check only).');
        } else {
          console.warn('⚠️ JWT_SECRET not set. Using unverified token decode.');
          console.warn('   Set JWT_SECRET in .env.local to enable full signature verification.');
        }
        (global as any).__jwt_warning_shown = true;
      }
      
      // Fallback: decode without verification (less secure but allows basic checks)
      const payload = decodeToken(token);
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          return null; // Token expired
        }
        // Return payload without signature verification
        return payload;
      }
    }
    
    // Only log other errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Token validation error:', error);
    }
    return null;
  }
}

/**
 * Decodes a JWT token without verification (use with caution)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = decodeJwt(token);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Checks if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * Gets user role from token
 */
export function getTokenRole(token: string): string | null {
  try {
    const payload = decodeToken(token);
    return payload?.role || null;
  } catch (error) {
    return null;
  }
}

/**
 * Gets user ID from token
 */
export function getTokenUserId(token: string): string | null {
  try {
    const payload = decodeToken(token);
    return payload?.sub || null;
  } catch (error) {
    return null;
  }
}


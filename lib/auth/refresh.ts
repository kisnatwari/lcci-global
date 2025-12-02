'use client';

/**
 * Token Refresh Function
 * 
 * Uses the refresh token to get a new access token when the current one expires.
 * This allows users to stay logged in without re-entering credentials.
 */

import { API_BASE_URL } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/config';
import { getAuthSession, setAuthSession, clearAuthSession, getUserRole } from './cookies';

/**
 * Refresh the access token using the refresh token
 * @returns New access token or null if refresh failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const session = getAuthSession();
    
    if (!session || !session.refreshToken) {
      //console.log('No refresh token available');
      return null;
    }

    // Call refresh endpoint directly (don't use apiClient to avoid circular dependency)
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.auth.refresh()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: session.refreshToken,
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Token refresh failed');
    }
    
    if (responseData.success && responseData.data?.accessToken) {
      const newAccessToken = responseData.data.accessToken;
      const newRefreshToken = responseData.data.refreshToken || session.refreshToken; // Use new refresh token if provided, otherwise keep old one
      
      // Extract userId from new token if available
      let userId: string | undefined = session.userId;
      try {
        const tokenParts = newAccessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          userId = payload.sub || session.userId;
        }
      } catch (e) {
        // Keep existing userId if can't extract
      }

      // Update session with new tokens, preserving user info
      const role = getUserRole() || session.role || 'user';
      setAuthSession(
        newAccessToken,
        newRefreshToken,
        role,
        userId,
        session.userName, // Preserve user name
        session.userEmail // Preserve user email
      );

      return newAccessToken;
    }

    return null;
  } catch (error: any) {
    console.error('Token refresh failed:', error);
    
    // If refresh fails, clear session (user needs to log in again)
    if (error.message === 'Unauthorized' || error.response?.status === 401) {
      clearAuthSession();
    }
    
    return null;
  }
}

/**
 * Check if token is about to expire soon (within next 2 minutes)
 * Useful for proactive token refresh
 */
export function shouldRefreshToken(token: string): boolean {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return false;
    
    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload.exp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Refresh if token expires in less than 2 minutes
    return timeUntilExpiry < 120;
  } catch (error) {
    return false;
  }
}


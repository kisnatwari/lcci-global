'use client';

import { clearAuthSession } from './cookies';

/**
 * Logout function - clears all auth data from cookies
 * No backend API call needed - just removes tokens from local cookies
 */
export async function logout() {
    // Clear local session data (cookies)
    clearAuthSession();
    
    // Clear localStorage (for backward compatibility)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    
    // Note: Redirect removed - let the component handle navigation
    // This allows testing without automatic redirect
}


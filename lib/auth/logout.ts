'use client';

import { clearAuthSession } from './cookies';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/config';

/**
 * Logout function - clears all auth data
 * Note: API logout endpoint may or may not exist
 */
export async function logout() {
    try {
        // Try to call logout API endpoint (if it exists)
        // This will fail silently if endpoint doesn't exist
        try {
            await apiClient.post(ENDPOINTS.auth.logout?.() || '/api/auth/logout');
        } catch (error) {
            // Endpoint might not exist, that's okay
            console.log('Logout API endpoint not available or failed');
        }
    } catch (error) {
        // Ignore API errors
    } finally {
        // Always clear local session data
        clearAuthSession();
        
        // Clear localStorage (for backward compatibility)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        
        // Note: Redirect removed - let the component handle navigation
        // This allows testing without automatic redirect
    }
}


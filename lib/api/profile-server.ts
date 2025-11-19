/**
 * Server-Side Profile API
 * 
 * This file contains server-only profile functions.
 * Import directly from this file in Server Components.
 */

import { getServerApiClient } from './server-client';
import { ENDPOINTS } from './config';
import type { UserProfile } from './profile';

/**
 * Get user profile (server-side)
 */
export async function getServerProfile(): Promise<UserProfile | null> {
  try {
    const client = await getServerApiClient();
    const response = await client.get(ENDPOINTS.profile.get());
    return response.data || response;
  } catch (error) {
    console.error('Failed to get server profile:', error);
    return null;
  }
}


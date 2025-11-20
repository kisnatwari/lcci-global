import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface UserProfile {
  profileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user profile (client-side)
 */
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const response = await apiClient.get(ENDPOINTS.profile.me());
    return response.data || response;
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}

// Server-side profile functions are in profile-server.ts
// Import from '@/lib/api/profile-server' in Server Components


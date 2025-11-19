/**
 * API Client System - Main Entry Point
 * 
 * This file re-exports client-side API functions for easier imports.
 * 
 * NOTE: Server-side functions (getServerApiClient, getServerProfile) are NOT exported here
 * to prevent importing server-only code in client components.
 * Import them directly from their files when needed in Server Components.
 */

// API Configuration
export { API_BASE_URL, ENDPOINTS } from './config';

// Client-Side API Client (safe for client components)
export { apiClient } from './client';

// Profile API (client-side only)
export {
  getProfile,
  type UserProfile,
} from './profile';

// Server-side functions - import directly from their files:
// - getServerApiClient: import from '@/lib/api/server-client'
// - getServerProfile: import from '@/lib/api/profile-server'


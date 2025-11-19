/**
 * Client-Side API Client
 * 
 * Automatically includes authentication token from encrypted session cookie
 * in all API requests. Handles 401 errors (unauthorized).
 */

import { API_BASE_URL } from "./config";
import { getAuthSession } from "@/lib/auth/cookies";

/**
 * Get authentication headers with token from encrypted session
 */
const getAuthHeaders = () => {
    const session = getAuthSession();
    const token = session?.accessToken;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export const apiClient = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getAuthHeaders(),
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    post: async (endpoint: string, data?: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    put: async (endpoint: string, data?: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    delete: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
};

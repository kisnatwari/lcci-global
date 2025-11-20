/**
 * Client-Side API Client
 * 
 * Automatically includes authentication token from encrypted session cookie
 * in all API requests. Handles 401 errors (unauthorized) by automatically
 * refreshing the token using the refresh token.
 */

import { API_BASE_URL } from "./config";
import { getAuthSession, getAuthToken } from "@/lib/auth/cookies";
import { isTokenExpired } from "@/lib/auth/token";
import { refreshAccessToken } from "@/lib/auth/refresh";

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

/**
 * Make a request with automatic token refresh on 401
 */
async function makeRequest(
    endpoint: string,
    options: RequestInit,
    retryCount = 0
): Promise<Response> {
    // Check if token is expired before making request
    const token = getAuthToken();
    if (token && isTokenExpired(token)) {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken();
        if (!newToken) {
            throw new Error('Unauthorized');
        }
        // Update headers with new token
        const session = getAuthSession();
        if (session?.accessToken) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${session.accessToken}`,
            };
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // If 401 and we haven't retried yet, try to refresh token
    if (response.status === 401 && retryCount === 0) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            // Retry the request with new token
            const session = getAuthSession();
            const retryOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${session?.accessToken}`,
                },
            };
            return makeRequest(endpoint, retryOptions, 1);
        }
        // Refresh failed, throw error
        throw new Error('Unauthorized');
    }
    
    return response;
}

export const apiClient = {
    get: async (endpoint: string) => {
        const response = await makeRequest(endpoint, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    post: async (endpoint: string, data?: any) => {
        const response = await makeRequest(endpoint, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    put: async (endpoint: string, data?: any) => {
        const response = await makeRequest(endpoint, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    delete: async (endpoint: string) => {
        const response = await makeRequest(endpoint, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.status === 204) {
            return null;
        }
        return response.json();
    },
    
    upload: async (endpoint: string, file: File) => {
        const session = getAuthSession();
        const token = session?.accessToken;
        
        const formData = new FormData();
        formData.append('file', file);
        
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });
        
        if (response.status === 401) {
            // Try to refresh token
            const newToken = await refreshAccessToken();
            if (newToken) {
                const session = getAuthSession();
                const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`,
                    },
                    body: formData,
                });
                
                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }
                return retryResponse.json();
            }
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
};

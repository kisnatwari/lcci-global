/**
 * Server-Side API Client
 * 
 * Reads authentication token from encrypted session cookie and includes it
 * in all API requests. Use this in Server Components and Server Actions.
 */

import { API_BASE_URL } from "./config";
import { cookies } from "next/headers";
import { getServerSessionData } from "@/lib/auth/cookies-server";

/**
 * Get server-side API client with authentication
 * 
 * @returns API client with token automatically included in headers
 */
export async function getServerApiClient() {
    const cookieStore = await cookies();
    const session = getServerSessionData(cookieStore);
    const token = session?.accessToken;

    const getAuthHeaders = () => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    };

    return {
        get: async (endpoint: string) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: getAuthHeaders(),
                cache: 'no-store', // Always fetch fresh data on server
            });
            
            let responseData: any;
            try {
                responseData = await response.json();
            } catch (e) {
                // Response is not JSON
            }
            
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return responseData;
        },
        
        post: async (endpoint: string, data?: any) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: data ? JSON.stringify(data) : undefined,
                cache: 'no-store',
            });
            
            let responseData: any;
            try {
                responseData = await response.json();
            } catch (e) {
                // Response is not JSON
            }
            
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return responseData;
        },
        
        put: async (endpoint: string, data?: any) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: data ? JSON.stringify(data) : undefined,
                cache: 'no-store',
            });
            
            let responseData: any;
            try {
                responseData = await response.json();
            } catch (e) {
                // Response is not JSON
            }
            
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return responseData;
        },
        
        delete: async (endpoint: string) => {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                cache: 'no-store',
            });
            
            let responseData: any = null;
            try {
                if (response.status !== 204) {
                    responseData = await response.json();
                }
            } catch (e) {
                // Response is not JSON
            }
            
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return responseData;
        },
    };
}


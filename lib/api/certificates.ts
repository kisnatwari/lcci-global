import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface Certificate {
  certificateId: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  certificateUrl: string;
  metadata?: string;
}

/**
 * Get certificate by ID (client-side)
 */
export async function getCertificateById(certificateId: string): Promise<Certificate | null> {
  try {
    const response = await apiClient.get(ENDPOINTS.certificates.getById(certificateId));
    return response.data || response;
  } catch (error) {
    console.error('Failed to get certificate:', error);
    return null;
  }
}

/**
 * Get certificates for a user (client-side)
 */
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  try {
    const response = await apiClient.get(ENDPOINTS.certificates.getByUser(userId));
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    console.error('Failed to get user certificates:', error);
    return [];
  }
}


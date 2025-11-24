import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedAt: string | null;
}

export interface EnrollmentPayload {
  courseId: string;
  promoCode?: string;
}

/**
 * Enroll in a course (client-side)
 */
export async function enrollInCourse(payload: EnrollmentPayload): Promise<Enrollment> {
  const response = await apiClient.post(ENDPOINTS.enrollments.post(), payload);
  return response.data || response;
}

/**
 * Get user enrollments (client-side)
 */
export async function getUserEnrollments(): Promise<Enrollment[]> {
  const response = await apiClient.get(ENDPOINTS.enrollments.get());
  if (response.success && response.data && Array.isArray(response.data.enrollments)) {
    return response.data.enrollments;
  } else if (response.data && Array.isArray(response.data.enrollments)) {
    return response.data.enrollments;
  } else if (Array.isArray(response)) {
    return response;
  }
  return [];
}

/**
 * Get enrollment by ID (client-side)
 */
export async function getEnrollmentById(id: string): Promise<Enrollment | null> {
  try {
    const response = await apiClient.get(ENDPOINTS.enrollments.getById(id));
    return response.data || response;
  } catch (error) {
    console.error('Failed to get enrollment:', error);
    return null;
  }
}



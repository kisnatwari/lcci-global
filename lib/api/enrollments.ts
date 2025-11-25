import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface Enrollment {
  id: string;
  enrollmentId?: string; // Some APIs might use enrollmentId
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedAt: string | null;
  // Extended fields from API response
  course?: {
    courseId?: string;
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    level?: string;
    category?: {
      name?: string;
      id?: string;
    };
    price?: number;
    duration?: number;
    thumbnailUrl?: string;
  };
  progress?: number;
  status?: "enrolled" | "in_progress" | "completed";
  lastAccessed?: string | null;
  score?: number | null;
  certificateUrl?: string | null;
}

export interface EnrollmentPayload {
  courseId: string;
  userId?: string; // Optional, backend might use authenticated user
  promoCode?: string;
}

export interface MaterialCompletionPayload {
  materialId: string;
}

export interface QuizCompletionPayload {
  quizId: string;
}

/**
 * Enroll in a course (client-side)
 */
export async function enrollInCourse(payload: EnrollmentPayload): Promise<Enrollment> {
  const response = await apiClient.post(ENDPOINTS.enrollments.post(), payload);
  return response.data || response;
}

/**
 * Get all enrollments (Admin only - client-side)
 */
export async function getAllEnrollments(): Promise<Enrollment[]> {
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
 * Get user enrollments (client-side) - uses /me endpoint
 */
export async function getUserEnrollments(): Promise<Enrollment[]> {
  const response = await apiClient.get(ENDPOINTS.enrollments.getMe());
  if (response.success && response.data && Array.isArray(response.data.enrollments)) {
    return response.data.enrollments;
  } else if (response.data && Array.isArray(response.data.enrollments)) {
    return response.data.enrollments;
  } else if (Array.isArray(response)) {
    return response;
  } else if (response.success && response.data && Array.isArray(response.data)) {
    return response.data;
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

/**
 * Mark material as complete (client-side)
 */
export async function markMaterialComplete(
  enrollmentId: string,
  payload: MaterialCompletionPayload
): Promise<any> {
  const response = await apiClient.post(
    ENDPOINTS.enrollments.markMaterialComplete(enrollmentId),
    payload
  );
  return response.data || response;
}

/**
 * Mark quiz as complete (client-side)
 */
export async function markQuizComplete(
  enrollmentId: string,
  payload: QuizCompletionPayload
): Promise<any> {
  const response = await apiClient.post(
    ENDPOINTS.enrollments.markQuizComplete(enrollmentId),
    payload
  );
  return response.data || response;
}



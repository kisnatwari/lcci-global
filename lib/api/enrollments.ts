import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface Enrollment {
  enrollmentId: string;
  status: "enrolled" | "completed";
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  isLcci: boolean;
  user: {
    userId: string;
    email: string;
    profile: {
      profileId: string;
      userId: string;
      firstName: string | null;
      lastName: string | null;
      phone: string | null;
      address: string | null;
      avatarUrl: string | null;
      bio: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
  course: {
    courseId: string;
    name: string;
    thumbnailUrl: string;
  };
  transaction: {
    transactionId: string;
    amount: string;
    paymentType: string;
    status: string;
  };
  // Legacy fields for backward compatibility
  id?: string;
  courseId?: string;
  userId?: string;
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
  // Handle nested structure: { success, data: { enrollments: [...], total: ... } }
  if (response.success && response.data && response.data.enrollments && Array.isArray(response.data.enrollments)) {
    return response.data.enrollments;
  }
  // Handle direct array response
  if (Array.isArray(response)) {
    return response;
  }
  // Handle wrapped response with data as array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  // Handle nested enrollments without success flag
  if (response.data && response.data.enrollments && Array.isArray(response.data.enrollments)) {
    return response.data.enrollments;
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

/**
 * Update last accessed time for a course (client-side)
 */
export async function updateLastAccessed(courseId: string): Promise<any> {
  const response = await apiClient.post(
    ENDPOINTS.enrollments.updateLastAccessed(),
    { courseId }
  );
  return response.data || response;
}



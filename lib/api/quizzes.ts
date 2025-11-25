import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface Quiz {
  quizId: string;
  courseId: string;
  title: string;
  description?: string;
  questions?: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  questionId: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  orderIndex?: number;
}

/**
 * Get quizzes for a course (client-side)
 */
export async function getCourseQuizzes(courseId: string): Promise<Quiz[]> {
  const response = await apiClient.get(ENDPOINTS.quizzes.getByCourse(courseId));
  if (response.success && Array.isArray(response.data)) {
    return response.data;
  } else if (Array.isArray(response.data)) {
    return response.data;
  } else if (Array.isArray(response)) {
    return response;
  }
  return [];
}

/**
 * Get quiz by ID (client-side)
 */
export async function getQuizById(courseId: string, quizId: string): Promise<Quiz | null> {
  try {
    const response = await apiClient.get(ENDPOINTS.quizzes.getById(courseId, quizId));
    return response.data || response;
  } catch (error) {
    console.error('Failed to get quiz:', error);
    return null;
  }
}


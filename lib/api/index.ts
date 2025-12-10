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

// Enrollments API (client-side only)
export {
  enrollInCourse,
  getUserEnrollments,
  getAllEnrollments,
  getEnrollmentById,
  markMaterialComplete,
  markQuizComplete,
  type Enrollment,
  type EnrollmentPayload,
  type EnrollmentResponse,
  type MaterialCompletionPayload,
  type QuizCompletionPayload,
  type PaymentRequiredResponse,
  type PaymentParams,
} from './enrollments';

// Promo Codes API (client-side only)
export {
  getPromoCodes,
  getPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  type PromoCode,
  type DiscountType,
  type CreatePromoCodePayload,
  type UpdatePromoCodePayload,
} from './promo-codes';

// Auth API (client-side only)
export {
  requestRegistrationOtp,
  register,
  type RequestOtpPayload,
  type RegisterPayload,
} from './auth';

// Training Centres API (client-side only)
export {
  getTrainingCentres,
  type TrainingCentre,
  type TrainingCentreCategory,
} from './training-centres';

// Materials API (client-side only)
export {
  getCourseMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  type CourseMaterial,
  type CreateMaterialPayload,
  type UpdateMaterialPayload,
} from './materials';

// Quizzes API (client-side only)
export {
  getCourseQuizzes,
  getQuizById,
  type Quiz,
  type QuizQuestion,
} from './quizzes';

// Certificates API (client-side only)
export {
  getCertificateById,
  getUserCertificates,
  getCertificateByCourse,
  type Certificate,
} from './certificates';

// Server-side functions - import directly from their files:
// - getServerApiClient: import from '@/lib/api/server-client'
// - getServerProfile: import from '@/lib/api/profile-server'


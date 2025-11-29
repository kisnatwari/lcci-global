import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface RequestOtpPayload {
  email: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  userType: string;
  username?: string; // Optional - required for SQA and Cambridge, not for regular students
  fullName?: string; // Optional - required for SQA and Cambridge
  centreUniqueIdentifier?: string | null; // Training centre ID for training centre students
  trainingCentreId?: string | null; // Training centre ID
  scnNo?: string; // SCN number for SQA students
  otp: string;
}

/**
 * Request OTP for registration (client-side)
 */
export async function requestRegistrationOtp(payload: RequestOtpPayload) {
  const response = await apiClient.post(ENDPOINTS.auth.registerRequestOtp(), payload);
  return response;
}

/**
 * Register a new user with OTP (client-side)
 */
export async function register(payload: RegisterPayload) {
  const response = await apiClient.post(ENDPOINTS.auth.register(), payload);
  return response;
}


import { apiClient } from './client';
import { ENDPOINTS } from './config';

export type DiscountType = "percentage" | "fixed";

export interface PromoCode {
  promoId: string;
  code: string;
  description: string;
  discountType: DiscountType;
  value: number | string; // API returns as string, we'll convert to number
  maxUses: number;
  usedCount?: number;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromoCodePayload {
  code: string;
  description: string;
  discountType: DiscountType;
  value: number;
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface UpdatePromoCodePayload {
  description?: string;
  value?: number;
  maxUses?: number;
  expiresAt?: string;
  isActive?: boolean;
}

/**
 * Get all promo codes (client-side)
 */
export async function getPromoCodes(): Promise<PromoCode[]> {
  const response = await apiClient.get(ENDPOINTS.promoCodes.get());
  
  // Handle nested response structure: { success, data: { promoCodes: [...] } }
  let rawCodes: any[] = [];
  if (response.success && response.data && response.data.promoCodes && Array.isArray(response.data.promoCodes)) {
    rawCodes = response.data.promoCodes;
  } else if (response.data && response.data.promoCodes && Array.isArray(response.data.promoCodes)) {
    rawCodes = response.data.promoCodes;
  } else if (Array.isArray(response)) {
    rawCodes = response;
  } else if (response.data && Array.isArray(response.data)) {
    rawCodes = response.data;
  }
  
  // Normalize all promo codes to ensure consistent structure
  return rawCodes.map((code: any) => ({
    ...code,
    promoId: code.promoId || code.id, // Handle both promoId and id
    value: typeof code.value === 'string' ? parseFloat(code.value) : (code.value || 0),
    maxUses: code.maxUses || 0,
    usedCount: code.usedCount || 0,
    isActive: code.isActive !== undefined ? code.isActive : true,
    description: code.description || "",
  }));
}

/**
 * Get promo code by ID (client-side)
 */
export async function getPromoCodeById(id: string): Promise<PromoCode | null> {
  try {
    const response = await apiClient.get(ENDPOINTS.promoCodes.getById(id));
    return response.data || response;
  } catch (error) {
    console.error('Failed to get promo code:', error);
    return null;
  }
}

/**
 * Create a new promo code (client-side)
 */
export async function createPromoCode(payload: CreatePromoCodePayload): Promise<PromoCode> {
  const response = await apiClient.post(ENDPOINTS.promoCodes.post(), payload);
  return response.data || response;
}

/**
 * Update a promo code (client-side)
 */
export async function updatePromoCode(id: string, payload: UpdatePromoCodePayload): Promise<PromoCode> {
  const response = await apiClient.put(ENDPOINTS.promoCodes.update(id), payload);
  return response.data || response;
}

/**
 * Delete a promo code (client-side)
 */
export async function deletePromoCode(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.promoCodes.delete(id));
}


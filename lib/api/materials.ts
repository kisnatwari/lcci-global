import { apiClient } from './client';
import { ENDPOINTS } from './config';

export interface CourseMaterial {
  materialId: string;
  courseId: string;
  title: string;
  description?: string;
  fileUrl?: string; // Optional for backward compatibility
  url?: string; // API returns 'url' field
  type: "video" | "pdf" | "doc" | "link";
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null; // Completion timestamp from API
}

export interface CreateMaterialPayload {
  title: string;
  type: "video" | "pdf" | "doc" | "link";
  url: string;
  orderIndex: number;
}

export interface UpdateMaterialPayload {
  title?: string;
  type?: "video" | "pdf" | "doc" | "link";
  url?: string;
  orderIndex?: number;
}

/**
 * Get materials for a course (client-side)
 */
export async function getCourseMaterials(courseId: string): Promise<CourseMaterial[]> {
  const response = await apiClient.get(ENDPOINTS.materials.getByCourse(courseId));
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
 * Get material by ID (client-side)
 */
export async function getMaterialById(courseId: string, materialId: string): Promise<CourseMaterial | null> {
  try {
    const response = await apiClient.get(ENDPOINTS.materials.getById(courseId, materialId));
    return response.data || response;
  } catch (error) {
    console.error('Failed to get material:', error);
    return null;
  }
}

/**
 * Create a new material (client-side)
 */
export async function createMaterial(courseId: string, payload: CreateMaterialPayload): Promise<CourseMaterial> {
  const response = await apiClient.post(ENDPOINTS.materials.post(courseId), payload);
  return response.data || response;
}

/**
 * Update a material (client-side)
 */
export async function updateMaterial(
  courseId: string,
  materialId: string,
  payload: UpdateMaterialPayload
): Promise<CourseMaterial> {
  const response = await apiClient.put(ENDPOINTS.materials.update(courseId, materialId), payload);
  return response.data || response;
}

/**
 * Delete a material (client-side)
 */
export async function deleteMaterial(courseId: string, materialId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.materials.delete(courseId, materialId));
}


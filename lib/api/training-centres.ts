import { apiClient } from './client';
import { ENDPOINTS } from './config';

export type TrainingCentreCategory = "SQA" | "Cambridge";

export interface TrainingCentre {
  centreId: string;
  name: string;
  description: string;
  category: TrainingCentreCategory;
  centreUniqueIdentifier?: string | null;
  createdAt: string;
}

/**
 * Get all training centres (client-side)
 * Optionally filter by category
 */
export async function getTrainingCentres(category?: TrainingCentreCategory): Promise<TrainingCentre[]> {
  try {
    const response = await apiClient.get(ENDPOINTS.trainingCentres.get());
    
    // Handle API response format: { success, message, data: { trainingCentres: [...], total } }
    let centres: TrainingCentre[] = [];
    
    if (response.success && response.data && Array.isArray(response.data.trainingCentres)) {
      centres = response.data.trainingCentres;
    } else if (response.data && Array.isArray(response.data.trainingCentres)) {
      centres = response.data.trainingCentres;
    } else if (response.trainingCentres && Array.isArray(response.trainingCentres)) {
      centres = response.trainingCentres;
    } else if (Array.isArray(response)) {
      centres = response;
    }
    
    // Filter by category if provided
    if (category) {
      centres = centres.filter(centre => centre.category === category);
    }
    
    return centres;
  } catch (error) {
    console.error('Failed to get training centres:', error);
    return [];
  }
}


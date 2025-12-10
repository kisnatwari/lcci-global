import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { TrainingCentresPageClient } from "./training-centres-client";

type TrainingCentreCategory = "SQA" | "Cambridge" | "SoftSkill";

type TrainingCentre = {
  centreId: string;
  name: string;
  description: string;
  category: TrainingCentreCategory;
  centreUniqueIdentifier?: string | null;
  createdAt: string;
};

export default async function TrainingCentresPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/?login=true");
  }

  // Fetch training centres on server
  let trainingCentres: TrainingCentre[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.trainingCentres.get());
    
    // Handle API response format: { success, message, data: { trainingCentres: [...], total } }
    if (response.success && response.data && Array.isArray(response.data.trainingCentres)) {
      trainingCentres = response.data.trainingCentres;
    } else if (response.data && Array.isArray(response.data.trainingCentres)) {
      trainingCentres = response.data.trainingCentres;
    } else if (response.trainingCentres && Array.isArray(response.trainingCentres)) {
      trainingCentres = response.trainingCentres;
    } else if (Array.isArray(response)) {
      trainingCentres = response;
    } else {
      trainingCentres = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch training centres:", err);
    error = err.message || "Failed to load training centres";
  }

  return <TrainingCentresPageClient initialTrainingCentres={trainingCentres} error={error} />;
}

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { SQAStudentsPageClient } from "./sqa-students-client";

interface SQAStudent {
  name: string;
  scn: string;
}

export default async function SQAStudentsPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/?login=true");
  }

  // Fetch SQA students on server
  let students: SQAStudent[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.sqaStudents.get());
    
    // Handle API response structure: { success: true, data: [...] }
    if (response.success && response.data && Array.isArray(response.data)) {
      students = response.data;
    } else if (Array.isArray(response)) {
      // Fallback: if response is directly an array
      students = response;
    } else if (response.data && Array.isArray(response.data)) {
      // Fallback: if response.data is an array
      students = response.data;
    } else {
      students = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch SQA students:", err);
    error = err.message || "Failed to load SQA students";
  }

  return <SQAStudentsPageClient initialStudents={students} error={error} />;
}


import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { SQAStudentsPageClient } from "./sqa-students-client";

interface SQAStudent {
  name: string;
  scn: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default async function SQAStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  
  // Get pagination and search params
  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = params.limit ? parseInt(params.limit, 10) : 10;
  const search = params.search || '';

  // Fetch SQA students on server
  let students: SQAStudent[] = [];
  let pagination: PaginationData | null = null;
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.sqaStudents.get(page, limit, search));

    // Handle API response structure: { success, data: { data: [...], total, page, limit, totalPages } }
    if (response.success && response.data) {
      // Check if data.data exists (nested structure)
      if (response.data.data && Array.isArray(response.data.data)) {
        students = response.data.data;
        // Extract pagination info from response.data
        if (response.data.total !== undefined) {
          pagination = {
            total: response.data.total,
            page: response.data.page || page,
            limit: response.data.limit || limit,
            totalPages: response.data.totalPages || Math.ceil(response.data.total / (response.data.limit || limit)),
          };
        }
      } else if (Array.isArray(response.data)) {
        // Fallback: if response.data is directly an array
        students = response.data;
      }
    } else if (Array.isArray(response)) {
      // Fallback: if response is directly an array
      students = response;
    } else {
      students = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch SQA students:", err);
    error = err.message || "Failed to load SQA students";
  }

  return (
    <SQAStudentsPageClient 
      initialStudents={students} 
      initialPagination={pagination}
      initialSearch={search}
      error={error} 
    />
  );
}


import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { EnrollmentsPageClient } from "./enrollments-client";

interface Enrollment {
  enrollmentId: string;
  status: "enrolled" | "completed" | "cancelled";
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
    amount: number;
    paymentType: string;
    status: string;
  };
}

interface EnrollmentsResponse {
  enrollments: Enrollment[];
  total: number;
}

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    limit?: string;
    offset?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    userId?: string;
    courseId?: string;
    status?: string;
  }>;
}) {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Await searchParams (Next.js 15+)
  const params = await searchParams;

  // Build query parameters
  const queryParams: any = {};
  if (params.limit) queryParams.limit = parseInt(params.limit, 10);
  if (params.offset) queryParams.offset = parseInt(params.offset, 10);
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.sortOrder && (params.sortOrder === "asc" || params.sortOrder === "desc")) {
    queryParams.sortOrder = params.sortOrder;
  }
  if (params.search) queryParams.search = params.search;
  if (params.userId) queryParams.userId = params.userId;
  if (params.courseId) queryParams.courseId = params.courseId;
  if (params.status && ["enrolled", "completed", "cancelled"].includes(params.status)) {
    queryParams.status = params.status;
  }

  // Fetch enrollments on server
  let enrollments: Enrollment[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.enrollments.get(queryParams));
    
    // Handle API response structure: { enrollments: [...], total: ... }
    if (response.enrollments && Array.isArray(response.enrollments)) {
      enrollments = response.enrollments;
      total = response.total || enrollments.length;
    } else if (response.success && response.data) {
      if (response.data.enrollments && Array.isArray(response.data.enrollments)) {
        enrollments = response.data.enrollments;
        total = response.data.total || enrollments.length;
      } else if (Array.isArray(response.data)) {
        enrollments = response.data;
        total = enrollments.length;
      }
    } else if (Array.isArray(response)) {
      enrollments = response;
      total = enrollments.length;
    }
  } catch (err: any) {
    console.error("Failed to fetch enrollments:", err);
    error = err.message || "Failed to load enrollments";
  }

  return (
    <EnrollmentsPageClient 
      initialEnrollments={enrollments} 
      initialTotal={total}
      error={error} 
    />
  );
}


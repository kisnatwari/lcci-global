import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { UsersPageClient } from "./users-client";

interface UserProfile {
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
  user: {
    email: string;
    username: string | null;
    userType: string;
    status: string;
    trainingCentreId: string | null;
    centreUniqueIdentifier: string | null;
    trainingCentre?: {
      category?: string;
    } | null;
  };
}

export default async function UsersPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/?login=true");
  }

  // Fetch users on server
  let users: UserProfile[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.profile.all());
    
    // Handle API response structure: { success: true, data: { profiles: [...], total, limit, offset } }
    if (response.success && response.data && Array.isArray(response.data.profiles)) {
      users = response.data.profiles;
    } else if (Array.isArray(response)) {
      // Fallback: if response is directly an array
      users = response;
    } else if (response.data && Array.isArray(response.data)) {
      // Fallback: if response.data is an array
      users = response.data;
    } else {
      users = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch users:", err);
    error = err.message || "Failed to load users";
  }

  return <UsersPageClient initialUsers={users} error={error} />;
}


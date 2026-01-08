import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import ProfilePageClient from "./profile-client";

interface ProfileData {
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
  };
}

export default async function ProfilePage() {
  // Require learner role
  try {
    await requireRole("learner");
  } catch (error) {
    redirect("/?login=true");
  }

  // Fetch profile on server
  let profile: ProfileData | null = null;
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.profile.me());
    
    // Handle different response structures
    if (response.profileId) {
      profile = response as ProfileData;
    } else if (response.data && response.data.profileId) {
      profile = response.data as ProfileData;
    } else if (response.success && response.data && response.data.profileId) {
      profile = response.data as ProfileData;
    } else if (response.data) {
      // Sometimes API might return profile directly in data without profileId check
      profile = response.data as ProfileData;
    }
  } catch (err: any) {
    console.error("Failed to fetch profile:", err);
    // Don't set error for 404, profile might not exist yet
    if (err.response?.status !== 404) {
      error = err.message || "Failed to load profile";
    }
  }

  return <ProfilePageClient initialProfile={profile} error={error} />;
}


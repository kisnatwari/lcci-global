import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerProfile } from "@/lib/api/profile-server";
import { ProfilePageClient } from "./profile-client";

export default async function ProfilePage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/?login=true");
  }

  // Fetch profile on server
  let profile = null;
  let error: string | null = null;

  try {
    profile = await getServerProfile();
  } catch (err: any) {
    console.error("Failed to fetch profile:", err);
    error = err.message || "Failed to load profile";
  }

  return <ProfilePageClient profile={profile} error={error} />;
}



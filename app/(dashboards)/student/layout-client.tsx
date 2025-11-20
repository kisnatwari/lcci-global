"use client";

import { useState, useEffect } from "react";
import {
  StudentDesktopNavigation,
  StudentMobileNavigation,
} from "@/components/dashboards/student/StudentNavigation";
import { ProfileCompletionModal } from "@/components/dashboards/student/ProfileCompletionModal";
import { cn } from "@/lib/utils";
import { apiClient, ENDPOINTS } from "@/lib/api";

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
}

export default function StudentDashboardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.profile.me());
        
        // Handle different response structures
        let profileData: ProfileData;
        if (response.profileId) {
          profileData = response;
        } else if (response.data && response.data.profileId) {
          profileData = response.data;
        } else {
          setIsCheckingProfile(false);
          return;
        }

        setProfile(profileData);

        // Check if profile is incomplete
        const isIncomplete =
          !profileData.firstName ||
          !profileData.lastName ||
          !profileData.phone ||
          !profileData.address;

        if (isIncomplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error("Failed to check profile:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfileCompletion();
  }, []);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
    // Refresh the page or refetch profile
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <StudentMobileNavigation />
        <div className="mt-6 flex gap-6">
          <aside
            className={cn(
              "hidden shrink-0 transition-[width] duration-200 lg:block",
              isCollapsed ? "w-20" : "w-64"
            )}
          >
            <StudentDesktopNavigation
              collapsed={isCollapsed}
              onToggle={() => setIsCollapsed((prev) => !prev)}
            />
          </aside>
          <main className="flex-1 space-y-8">{children}</main>
        </div>
      </div>

      {/* Profile Completion Modal */}
      {profile && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onComplete={handleProfileComplete}
          currentProfile={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            address: profile.address,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
          }}
        />
      )}
    </div>
  );
}


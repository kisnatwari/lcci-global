"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, FileText, AlertCircle } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile";

interface ProfilePageClientProps {
  profile: UserProfile | null;
  error: string | null;
}

export function ProfilePageClient({ profile, error: initialError }: ProfilePageClientProps) {
  const router = useRouter();
  const [error] = useState<string | null>(initialError);

  const getUserInitials = () => {
    if (profile?.profile?.firstName && profile?.profile?.lastName) {
      return `${profile.profile.firstName[0]}${profile.profile.lastName[0]}`.toUpperCase();
    }
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  const getUserFullName = () => {
    if (profile?.profile?.firstName && profile?.profile?.lastName) {
      return `${profile.profile.firstName} ${profile.profile.lastName}`;
    }
    if (profile?.username) {
      return profile.username;
    }
    return "Admin User";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">View your profile information</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Failed to load profile</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Content */}
      {!error && profile && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card - Main Info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 ring-4 ring-[color:var(--brand-blue)]/20">
                  {profile.profile?.avatarUrl ? (
                    <img src={profile.profile.avatarUrl} alt={getUserFullName()} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-[color:var(--brand-blue)] via-[color:var(--brand-cyan)] to-[color:var(--brand-blue)] text-white text-2xl font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{getUserFullName()}</h2>
                  <p className="text-sm text-muted-foreground capitalize">{profile.userType || 'Admin'}</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Member since</p>
                    <p className="font-medium">{formatDate(profile.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p>{profile.email}</p>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{profile.username}</p>
                </div>
              </div>

              {/* Full Name (from profile if available) */}
              {profile.profile?.firstName && profile.profile?.lastName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{`${profile.profile.firstName} ${profile.profile.lastName}`}</p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {profile.profile?.phone && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{profile.profile.phone}</p>
                  </div>
                </div>
              )}

              {/* Address */}
              {profile.profile?.address && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="flex-1">{profile.profile.address}</p>
                  </div>
                </div>
              )}

              {/* Bio */}
              {profile.profile?.bio && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="flex-1 whitespace-pre-wrap">{profile.profile.bio}</p>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-xs">{profile.userId}</span>
                </div>
                {profile.profile?.profileId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile ID</span>
                    <span className="font-mono text-xs">{profile.profile.profileId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{profile.status}</span>
                </div>
                {profile.trainingCentreId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Training Centre ID</span>
                    <span className="font-mono text-xs">{profile.trainingCentreId}</span>
                  </div>
                )}
                {profile.lcciGQCreditPoints > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">LCCI GQ Credit Points</span>
                    <span className="font-medium">{profile.lcciGQCreditPoints}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(profile.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!error && !profile && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No profile information available.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


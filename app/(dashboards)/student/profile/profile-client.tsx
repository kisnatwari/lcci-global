"use client";

import { useState, FormEvent, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
  Mail,
  Calendar,
  Save,
} from "lucide-react";
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
  user: {
    email: string;
    username: string | null;
    userType: string;
    status: string;
  };
}

interface ProfilePageClientProps {
  initialProfile: ProfileData | null;
  error: string | null;
}

export default function ProfilePageClient({ initialProfile, error: initialError }: ProfilePageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState(initialProfile?.firstName || "");
  const [lastName, setLastName] = useState(initialProfile?.lastName || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [address, setAddress] = useState(initialProfile?.address || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfile?.avatarUrl || null);

  // Update form when profile changes
  useEffect(() => {
    if (initialProfile) {
      setFirstName(initialProfile.firstName || "");
      setLastName(initialProfile.lastName || "");
      setPhone(initialProfile.phone || "");
      setAddress(initialProfile.address || "");
      setBio(initialProfile.bio || "");
      setAvatarUrl(initialProfile.avatarUrl);
      setPreviewUrl(initialProfile.avatarUrl);
    }
  }, [initialProfile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAvatarUrl(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // Upload avatar if a new file is selected
      if (selectedFile) {
        setIsUploading(true);
        try {
          const uploadResponse = await apiClient.upload(ENDPOINTS.upload.file(), selectedFile);
          
          // Handle different response structures
          if (uploadResponse.url) {
            finalAvatarUrl = uploadResponse.url;
          } else if (uploadResponse.data && uploadResponse.data.url) {
            finalAvatarUrl = uploadResponse.data.url;
          } else {
            throw new Error("Invalid upload response");
          }
        } catch (uploadErr: any) {
          console.error("Avatar upload error:", uploadErr);
          setError(uploadErr.message || "Failed to upload avatar. Please try again.");
          setIsLoading(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Update profile with avatar URL
      const response = await apiClient.put(ENDPOINTS.profile.update(), {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        bio: bio.trim() || null,
        avatarUrl: finalAvatarUrl,
      });

      // Handle API response structure: { success: true, message: "...", data: {...} }
      if (response.success && response.data && response.data.profileId) {
        setSuccess(true);
        setAvatarUrl(finalAvatarUrl);
        setSelectedFile(null);
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else if (response.profileId) {
        // Fallback: if response is directly the profile object
        setSuccess(true);
        setAvatarUrl(finalAvatarUrl);
        setSelectedFile(null);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(response.message || "Failed to update profile. Please try again.");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (initialProfile?.user.username) {
      return initialProfile.user.username[0].toUpperCase();
    }
    if (initialProfile?.user.email) {
      return initialProfile.user.email[0].toUpperCase();
    }
    return "U";
  };

  if (initialError && !initialProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-slate-600">View and update your profile information</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Profile</h3>
              <p className="text-sm text-slate-600">{initialError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-2 text-slate-600">View and update your profile information</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload your profile photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={previewUrl || undefined} />
                    <AvatarFallback className="bg-slate-900 text-white text-3xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {selectedFile ? "Change Photo" : "Upload Photo"}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                    <p className="text-xs text-slate-500 text-center">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-sm text-slate-900">{initialProfile?.user.email}</p>
                </div>
                {initialProfile?.user.username && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      Username
                    </Label>
                    <p className="text-sm text-slate-900">@{initialProfile.user.username}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-semibold text-slate-500 mb-1 block">Account Type</Label>
                  <Badge variant="default">{initialProfile?.user.userType || "Customer"}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-500 mb-1 block">Status</Label>
                  <Badge variant={initialProfile?.user.status === "active" ? "default" : "secondary"}>
                    {initialProfile?.user.status || "active"}
                  </Badge>
                </div>
                {initialProfile && (
                  <div className="pt-4 border-t">
                    <Label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </Label>
                    <p className="text-sm text-slate-900">
                      {new Date(initialProfile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-slate-400" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-slate-400" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full"
                  />
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, City, Country"
                    className="w-full"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little about yourself..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="min-w-[120px]"
                  >
                    {isLoading || isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? "Uploading..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}


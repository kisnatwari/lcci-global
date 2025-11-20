"use client";

import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, CheckCircle2, User, Phone, MapPin, FileText, Upload, X, Image as ImageIcon } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: () => void;
  currentProfile: {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    avatarUrl: string | null;
  };
}

export function ProfileCompletionModal({
  isOpen,
  onComplete,
  currentProfile,
}: ProfileCompletionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [firstName, setFirstName] = useState(currentProfile.firstName || "");
  const [lastName, setLastName] = useState(currentProfile.lastName || "");
  const [phone, setPhone] = useState(currentProfile.phone || "");
  const [address, setAddress] = useState(currentProfile.address || "");
  const [bio, setBio] = useState(currentProfile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentProfile.avatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentProfile.avatarUrl);

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
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else if (response.profileId) {
        // Fallback: if response is directly the profile object
        setSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
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

  const isProfileComplete = () => {
    return firstName.trim() && lastName.trim() && phone.trim() && address.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to continue. This helps us personalize your learning experience.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Profile Updated!</h3>
            <p className="text-sm text-slate-600">Your profile has been completed successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Avatar Upload */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                Profile Picture (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewUrl || undefined} />
                  <AvatarFallback className="bg-slate-200 text-slate-600">
                    {firstName && lastName
                      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                      : firstName
                      ? firstName[0].toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
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
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-slate-400" />
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-slate-400" />
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-slate-400" />
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                required
                className="w-full"
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street, City, Country"
                required
                className="w-full"
              />
            </div>

            {/* Bio (Optional) */}
            <div>
              <Label htmlFor="bio" className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                Bio (Optional)
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
                disabled={isLoading || isUploading || !isProfileComplete()}
                className="min-w-[120px]"
              >
                {isLoading || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


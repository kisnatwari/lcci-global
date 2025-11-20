"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreVertical, Mail, User, Building2, AlertCircle, Loader2, Phone, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient, ENDPOINTS } from "@/lib/api";

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
  };
}

interface ProfileDetails {
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

interface UsersPageClientProps {
  initialUsers: UserProfile[];
  error: string | null;
}

export function UsersPageClient({ initialUsers, error }: UsersPageClientProps) {
  const [users] = useState<UserProfile[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const name = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = user.user.email.toLowerCase();
    const username = (user.user.username || "").toLowerCase();
    const userType = user.user.userType.toLowerCase();

    return (
      name.includes(query) ||
      email.includes(query) ||
      username.includes(query) ||
      userType.includes(query)
    );
  });

  // Get user display name
  const getDisplayName = (user: UserProfile) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.user.username || user.user.email || "Unknown";
  };

  // Get user initials
  const getUserInitials = (user: UserProfile) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    const name = user.user.username || user.user.email || "U";
    return name[0].toUpperCase();
  };

  // Get user type badge variant
  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "Admin":
        return "destructive";
      case "Customer":
        return "default";
      case "Training_Site_Student":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Format user type for display
  const formatUserType = (userType: string) => {
    return userType.replace(/_/g, " ");
  };

  // Fetch user profile details
  const handleViewProfile = async (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileDialogOpen(true);
    setIsLoadingProfile(true);
    setProfileError(null);
    setProfileDetails(null);

    try {
      const response = await apiClient.get(ENDPOINTS.profile.getById(userId));
      
      // Handle different response structures
      let profile: ProfileDetails;
      if (response.profileId) {
        profile = response;
      } else if (response.data && response.data.profileId) {
        profile = response.data;
      } else {
        throw new Error("Invalid profile response structure");
      }

      setProfileDetails(profile);
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setProfileError(err.message || "Failed to load profile");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Get selected user from users list
  const selectedUser = users.find((u) => u.userId === selectedUserId);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="mt-2 text-slate-600">Manage all system users</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Users</h3>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="mt-2 text-slate-600">Manage all system users</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, email, username, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Training Centre</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      {searchQuery ? "No users found matching your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="bg-slate-900 text-white text-sm">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{getDisplayName(user)}</p>
                            {user.user.username && (
                              <p className="text-xs text-slate-500">@{user.user.username}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{user.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getUserTypeBadge(user.user.userType)}>
                          {formatUserType(user.user.userType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.user.status === "active" ? "default" : "secondary"}
                        >
                          {user.user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.user.trainingCentreId ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {user.user.centreUniqueIdentifier || "Linked"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(user.userId)}>
                              <User className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Profile View Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Detailed profile information for {selectedUser ? getDisplayName(selectedUser) : "user"}
            </DialogDescription>
          </DialogHeader>

          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : profileError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Profile</h3>
              <p className="text-sm text-slate-600">{profileError}</p>
            </div>
          ) : profileDetails && selectedUser ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4 pb-6 border-b">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileDetails.avatarUrl || selectedUser.avatarUrl || undefined} />
                  <AvatarFallback className="bg-slate-900 text-white text-2xl">
                    {getUserInitials(selectedUser)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {getDisplayName(selectedUser)}
                  </h3>
                  {selectedUser.user.username && (
                    <p className="text-sm text-slate-500">@{selectedUser.user.username}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getUserTypeBadge(selectedUser.user.userType)}>
                      {formatUserType(selectedUser.user.userType)}
                    </Badge>
                    <Badge variant={selectedUser.user.status === "active" ? "default" : "secondary"}>
                      {selectedUser.user.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-sm text-slate-900">{selectedUser.user.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="text-sm text-slate-900">
                    {profileDetails.phone || <span className="text-slate-400">Not provided</span>}
                  </p>
                </div>

                {/* First Name */}
                {profileDetails.firstName && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1">First Name</label>
                    <p className="text-sm text-slate-900">{profileDetails.firstName}</p>
                  </div>
                )}

                {/* Last Name */}
                {profileDetails.lastName && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-1">Last Name</label>
                    <p className="text-sm text-slate-900">{profileDetails.lastName}</p>
                  </div>
                )}

                {/* Address */}
                {profileDetails.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4" />
                      Address
                    </label>
                    <p className="text-sm text-slate-900">{profileDetails.address}</p>
                  </div>
                )}

                {/* Training Centre */}
                {selectedUser.user.trainingCentreId && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4" />
                      Training Centre
                    </label>
                    <p className="text-sm text-slate-900">
                      {selectedUser.user.centreUniqueIdentifier || "Linked"}
                    </p>
                  </div>
                )}

                {/* Created At */}
                <div>
                  <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </label>
                  <p className="text-sm text-slate-900">
                    {new Date(profileDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Updated At */}
                <div>
                  <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    Last Updated
                  </label>
                  <p className="text-sm text-slate-900">
                    {new Date(profileDetails.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {profileDetails.bio && (
                <div>
                  <label className="text-sm font-semibold text-slate-500 mb-2 block">Bio</label>
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{profileDetails.bio}</p>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}


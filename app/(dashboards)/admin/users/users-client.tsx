"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, Building2, AlertCircle, Loader2, Phone, MapPin, Calendar, Eye, Mail, Users, BookOpen, CreditCard, CheckCircle as CheckCircleIcon, X } from "lucide-react";
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
    trainingCentre?: {
      category?: string;
    } | null;
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
  console.log("initialUsers", initialUsers);
  const searchParams = useSearchParams();
  const [users] = useState<UserProfile[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Enrollments drawer state
  const [isEnrollmentsDrawerOpen, setIsEnrollmentsDrawerOpen] = useState(false);
  const [selectedUserForEnrollments, setSelectedUserForEnrollments] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsTotal, setEnrollmentsTotal] = useState(0);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);

  // Auto-open profile dialog if userId is in query params
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && !isProfileDialogOpen) {
      handleViewProfile(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  // Get training centre category label
  const getCategoryLabel = (category: string | null | undefined): string => {
    if (!category) return "";
    switch (category) {
      case "SQA":
        return "IT & Hospitality Management";
      case "Cambridge":
        return "Cambridge";
      case "SoftSkill":
        return "Soft Skill";
      default:
        return category;
    }
  };

  // Format user type for display - show category for Training_Site_Student
  const formatUserType = (user: UserProfile) => {
    if (user.user.userType === "Training_Site_Student" && user.user.trainingCentre?.category) {
      return getCategoryLabel(user.user.trainingCentre.category);
    }
    return user.user.userType.replace(/_/g, " ");
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

  // Handle opening enrollments drawer
  const handleViewEnrollments = async (user: UserProfile) => {
    setSelectedUserForEnrollments(user);
    setIsEnrollmentsDrawerOpen(true);
    setIsLoadingEnrollments(true);
    setEnrollmentsError(null);
    
    try {
      // Use the correct endpoint with userId query parameter
      const response = await apiClient.get(ENDPOINTS.enrollments.get({ userId: user.userId }));
      
      // Handle response schema: { enrollments: [], total: 0 }
      let enrollmentsData: any[] = [];
      let total = 0;
      
      if (response.enrollments && Array.isArray(response.enrollments)) {
        enrollmentsData = response.enrollments;
        total = response.total || enrollmentsData.length;
      } else if (response.success && response.data) {
        if (response.data.enrollments && Array.isArray(response.data.enrollments)) {
          enrollmentsData = response.data.enrollments;
          total = response.data.total || enrollmentsData.length;
        } else if (Array.isArray(response.data)) {
          enrollmentsData = response.data;
          total = enrollmentsData.length;
        }
      } else if (Array.isArray(response)) {
        enrollmentsData = response;
        total = enrollmentsData.length;
      }
      
      setEnrollments(enrollmentsData);
      setEnrollmentsTotal(total);
    } catch (err: any) {
      console.error("Failed to fetch enrollments:", err);
      setEnrollmentsError(err.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  // Helper to get user name from enrollment
  const getUserNameFromEnrollment = (user: any): string => {
    if (!user) return "Unknown";
    if (user.profile) {
      const firstName = user.profile.firstName || "";
      const lastName = user.profile.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || user.email || "Unknown";
    }
    return user.email || "Unknown";
  };

  // Helper to get status badge color
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
      enrolled: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
      completed: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    };
    const colors = statusColors[status.toLowerCase()] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };
    return colors;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
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
                          {formatUserType(user)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.user.status === "active" ? "default" : "secondary"}
                        >
                          {user.user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewEnrollments(user)}
                            title="View Enrollments"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewProfile(user.userId)}
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
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
                      {formatUserType(selectedUser)}
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
                {(selectedUser.user.trainingCentreId || selectedUser.user.trainingCentre) && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4" />
                      Training Centre
                    </label>
                    <div className="space-y-2">
                      {selectedUser.user.trainingCentre?.category && (
                        <div>
                          <span className="text-xs text-slate-500 font-medium">Category: </span>
                          <Badge variant="outline" className="ml-1">
                            {getCategoryLabel(selectedUser.user.trainingCentre.category)}
                          </Badge>
                        </div>
                      )}
                      {selectedUser.user.centreUniqueIdentifier && (
                        <p className="text-sm text-slate-900">
                          ID: {selectedUser.user.centreUniqueIdentifier}
                        </p>
                      )}
                      {selectedUser.user.trainingCentreId && !selectedUser.user.centreUniqueIdentifier && (
                        <p className="text-sm text-slate-900">
                          Centre ID: {selectedUser.user.trainingCentreId}
                        </p>
                      )}
                    </div>
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

      {/* Enrollments Drawer */}
      <Drawer open={isEnrollmentsDrawerOpen} onOpenChange={setIsEnrollmentsDrawerOpen} direction="right">
        <DrawerContent className="max-w-2xl w-full">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>User Enrollments</DrawerTitle>
                <DrawerDescription>
                  {selectedUserForEnrollments ? getDisplayName(selectedUserForEnrollments) : "User"}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingEnrollments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading enrollments...</span>
              </div>
            ) : enrollmentsError ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-medium">Failed to load enrollments</p>
                  <p className="text-sm">{enrollmentsError}</p>
                </div>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No enrollments found for this user.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const statusColors = getStatusBadge(enrollment.status);
                  return (
                    <div
                      key={enrollment.enrollmentId}
                      className="border rounded-lg p-4 space-y-3 hover:bg-slate-50 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {enrollment.course?.thumbnailUrl ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                                <img
                                  src={enrollment.course.thumbnailUrl}
                                  alt={enrollment.course.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                                <BookOpen className="h-6 w-6" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-900">
                                {enrollment.course?.name || "Unknown Course"}
                              </p>
                              <p className="text-sm text-slate-600">Course Enrollment</p>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>
                            <span className="text-slate-500">Enrolled:</span>{" "}
                            {enrollment.enrolledAt ? formatDate(enrollment.enrolledAt) : "—"}
                          </span>
                        </div>
                        {enrollment.completedAt && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                            <span>
                              <span className="text-slate-500">Completed:</span>{" "}
                              {formatDate(enrollment.completedAt)}
                            </span>
                          </div>
                        )}
                        {enrollment.transaction && (
                          <div className="flex items-center gap-2 text-slate-600 col-span-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <span>
                              <span className="text-slate-500">Payment:</span>{" "}
                              NPR {Number(enrollment.transaction.amount || 0).toLocaleString()} 
                              {" "}({enrollment.transaction.paymentType})
                              {enrollment.transaction.status && (
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                  enrollment.transaction.status === 'completed' || enrollment.transaction.status === 'success'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : enrollment.transaction.status === 'pending'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {enrollment.transaction.status}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        {enrollment.isLcci !== undefined && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-slate-500">LCCI:</span>{" "}
                            <span className={enrollment.isLcci ? "text-emerald-600 font-medium" : "text-slate-400"}>
                              {enrollment.isLcci ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      {enrollment.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Progress</span>
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[color:var(--brand-blue)] transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DrawerFooter className="border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {enrollmentsTotal} {enrollmentsTotal === 1 ? "enrollment" : "enrollments"}
              </p>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}


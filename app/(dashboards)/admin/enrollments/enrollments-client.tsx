"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Search, 
  AlertCircle, 
  Loader2, 
  ClipboardList, 
  User, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { cn } from "@/lib/utils";

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

interface EnrollmentsPageClientProps {
  initialEnrollments: Enrollment[];
  initialTotal: number;
  error: string | null;
}

export function EnrollmentsPageClient({ 
  initialEnrollments, 
  initialTotal,
  error: initialError 
}: EnrollmentsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isMounted, setIsMounted] = useState(false);

  // Filter states from URL
  const [limit, setLimit] = useState(searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10);
  const [offset, setOffset] = useState(searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<'enrolled' | 'completed' | 'cancelled' | ''>(searchParams.get('status') as any || '');
  const [userIdFilter, setUserIdFilter] = useState(searchParams.get('userId') || '');
  const [courseIdFilter, setCourseIdFilter] = useState(searchParams.get('courseId') || '');

  // Searchable select states
  const [users, setUsers] = useState<Array<{ userId: string; email: string; name: string }>>([]);
  const [courses, setCourses] = useState<Array<{ courseId: string; name: string }>>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isCoursePopoverOpen, setIsCoursePopoverOpen] = useState(false);

  // Calculate pagination
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  // Fetch enrollments from API
  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        limit,
        offset,
      };
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (userIdFilter.trim()) params.userId = userIdFilter.trim();
      if (courseIdFilter.trim()) params.courseId = courseIdFilter.trim();

      const response = await apiClient.get(ENDPOINTS.enrollments.get(params));
      
      // Handle API response structure: { enrollments: [...], total: ... }
      if (response.enrollments && Array.isArray(response.enrollments)) {
        setEnrollments(response.enrollments);
        setTotal(response.total || response.enrollments.length);
      } else if (response.success && response.data) {
        if (response.data.enrollments && Array.isArray(response.data.enrollments)) {
          setEnrollments(response.data.enrollments);
          setTotal(response.data.total || response.data.enrollments.length);
        } else if (Array.isArray(response.data)) {
          setEnrollments(response.data);
          setTotal(response.data.length);
        }
      } else if (Array.isArray(response)) {
        setEnrollments(response);
        setTotal(response.length);
      } else {
        setEnrollments([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error("Failed to fetch enrollments:", err);
      setError(err.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch users when popover opens (lazy loading)
  const fetchUsers = async (search: string = "") => {
    if (users.length > 0 && !search) return; // Don't refetch if already loaded and no search
    
    setIsLoadingUsers(true);
    try {
      const response = await apiClient.get(ENDPOINTS.profile.all());
      let fetchedUsers: any[] = [];
      
      if (response.success && response.data && Array.isArray(response.data.profiles)) {
        fetchedUsers = response.data.profiles;
      } else if (Array.isArray(response)) {
        fetchedUsers = response;
      } else if (response.data && Array.isArray(response.data)) {
        fetchedUsers = response.data;
      }

      const formattedUsers = fetchedUsers.map((profile: any) => {
        const firstName = profile.firstName || "";
        const lastName = profile.lastName || "";
        const name = `${firstName} ${lastName}`.trim() || profile.user?.email || "Unknown";
        return {
          userId: profile.userId,
          email: profile.user?.email || "",
          name,
        };
      });

      setUsers(formattedUsers);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch courses when popover opens (lazy loading)
  const fetchCourses = async (search: string = "") => {
    if (courses.length > 0 && !search) return; // Don't refetch if already loaded and no search
    
    setIsLoadingCourses(true);
    try {
      const response = await apiClient.get(ENDPOINTS.courses.get());
      let fetchedCourses: any[] = [];
      
      if (response.success && response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (Array.isArray(response)) {
        fetchedCourses = response;
      }

      const formattedCourses = fetchedCourses.map((course: any) => ({
        courseId: course.courseId,
        name: course.name || "Unknown Course",
      }));

      setCourses(formattedCourses);
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter((user) => {
    if (!userSearchQuery) return true;
    const query = userSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.userId.toLowerCase().includes(query)
    );
  });

  // Filter courses by search query
  const filteredCourses = courses.filter((course) => {
    if (!courseSearchQuery) return true;
    const query = courseSearchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(query) ||
      course.courseId.toLowerCase().includes(query)
    );
  });

  // Get selected user/course display names
  const selectedUser = users.find((u) => u.userId === userIdFilter);
  const selectedCourse = courses.find((c) => c.courseId === courseIdFilter);

  // Update URL and fetch when filters change (skip initial mount)
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    const params = new URLSearchParams();
    if (limit !== 10) params.set('limit', limit.toString());
    if (offset !== 0) params.set('offset', offset.toString());
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
    if (search.trim()) params.set('search', search.trim());
    if (statusFilter) params.set('status', statusFilter);
    if (userIdFilter.trim()) params.set('userId', userIdFilter.trim());
    if (courseIdFilter.trim()) params.set('courseId', courseIdFilter.trim());
    
    const newUrl = params.toString() 
      ? `/admin/enrollments?${params.toString()}`
      : "/admin/enrollments";
    
    router.push(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchEnrollments();
  }, [limit, offset, sortBy, sortOrder, search, statusFilter, userIdFilter, courseIdFilter, router]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * limit;
    setOffset(newOffset);
  };

  // Clear all filters
  const clearFilters = () => {
    setLimit(10);
    setOffset(0);
    setSortBy('');
    setSortOrder('asc');
    setSearch('');
    setStatusFilter('');
    setUserIdFilter('');
    setCourseIdFilter('');
    setUserSearchQuery('');
    setCourseSearchQuery('');
    setIsUserPopoverOpen(false);
    setIsCoursePopoverOpen(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get user display name
  const getUserName = (enrollment: Enrollment) => {
    const profile = enrollment.user.profile;
    if (profile.firstName || profile.lastName) {
      return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    }
    return enrollment.user.email;
  };

  const hasActiveFilters = search || statusFilter || userIdFilter || courseIdFilter || sortBy;

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Enrollments</CardTitle>
              <CardDescription className="mt-1">
                Manage and view all course enrollments
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters Section */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-xs font-medium text-slate-700">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Search enrollments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-medium text-slate-700">
                  Status
                </Label>
                {isMounted ? (
                  <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value as any)}>
                    <SelectTrigger id="status" className="h-9 w-full">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9 w-full border border-input rounded-md bg-background flex items-center px-3 text-sm">
                    {statusFilter || "All Status"}
                  </div>
                )}
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sortBy" className="text-xs font-medium text-slate-700">
                  Sort By
                </Label>
                {isMounted ? (
                  <Select value={sortBy || "default"} onValueChange={(value) => setSortBy(value === "default" ? "" : value)}>
                    <SelectTrigger id="sortBy" className="h-9 w-full">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="enrolledAt">Enrolled Date</SelectItem>
                      <SelectItem value="completedAt">Completed Date</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9 w-full border border-input rounded-md bg-background flex items-center px-3 text-sm">
                    {sortBy || "Default"}
                  </div>
                )}
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-xs font-medium text-slate-700">
                  Order
                </Label>
                {isMounted ? (
                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <SelectTrigger id="sortOrder" className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9 w-full border border-input rounded-md bg-background flex items-center px-3 text-sm">
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </div>
                )}
              </div>

              {/* User Filter */}
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-xs font-medium text-slate-700">
                  User
                </Label>
                {isMounted ? (
                  <Popover 
                    open={isUserPopoverOpen} 
                    onOpenChange={(open) => {
                      setIsUserPopoverOpen(open);
                      if (open) {
                        fetchUsers();
                      } else {
                        setUserSearchQuery("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        role="combobox"
                        id="userId"
                        className={cn(
                          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                          !selectedUser && "text-muted-foreground"
                        )}
                      >
                        <span className="truncate text-left">
                          {selectedUser ? `${selectedUser.name} (${selectedUser.email})` : "Select user..."}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="border-0 focus-visible:ring-0 h-8"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[300px] overflow-auto p-1">
                        {isLoadingUsers ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
                          </div>
                        ) : filteredUsers.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            {userSearchQuery ? "No users found." : "No users available."}
                          </div>
                        ) : (
                          <>
                            <div
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => {
                                setUserIdFilter("");
                                setIsUserPopoverOpen(false);
                                setUserSearchQuery("");
                              }}
                            >
                              Clear selection
                            </div>
                            <div className="h-px bg-border my-1" />
                            {filteredUsers.map((user) => (
                              <div
                                key={user.userId}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                                  userIdFilter === user.userId && "bg-accent font-medium"
                                )}
                                onClick={() => {
                                  setUserIdFilter(user.userId);
                                  setIsUserPopoverOpen(false);
                                  setUserSearchQuery("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    userIdFilter === user.userId ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-medium">{user.name}</div>
                                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="h-9 w-full border border-input rounded-md bg-background flex items-center px-3 text-sm">
                    {selectedUser ? `${selectedUser.name} (${selectedUser.email})` : "Select user..."}
                  </div>
                )}
              </div>

              {/* Course Filter */}
              <div className="space-y-2">
                <Label htmlFor="courseId" className="text-xs font-medium text-slate-700">
                  Course
                </Label>
                {isMounted ? (
                  <Popover 
                    open={isCoursePopoverOpen} 
                    onOpenChange={(open) => {
                      setIsCoursePopoverOpen(open);
                      if (open) {
                        fetchCourses();
                      } else {
                        setCourseSearchQuery("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        role="combobox"
                        id="courseId"
                        className={cn(
                          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                          !selectedCourse && "text-muted-foreground"
                        )}
                      >
                        <span className="truncate text-left">
                          {selectedCourse ? selectedCourse.name : "Select course..."}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <Input
                          placeholder="Search courses..."
                          value={courseSearchQuery}
                          onChange={(e) => setCourseSearchQuery(e.target.value)}
                          className="border-0 focus-visible:ring-0 h-8"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[300px] overflow-auto p-1">
                        {isLoadingCourses ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-sm text-muted-foreground">Loading courses...</span>
                          </div>
                        ) : filteredCourses.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            {courseSearchQuery ? "No courses found." : "No courses available."}
                          </div>
                        ) : (
                          <>
                            <div
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => {
                                setCourseIdFilter("");
                                setIsCoursePopoverOpen(false);
                                setCourseSearchQuery("");
                              }}
                            >
                              Clear selection
                            </div>
                            <div className="h-px bg-border my-1" />
                            {filteredCourses.map((course) => (
                              <div
                                key={course.courseId}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                                  courseIdFilter === course.courseId && "bg-accent font-medium"
                                )}
                                onClick={() => {
                                  setCourseIdFilter(course.courseId);
                                  setIsCoursePopoverOpen(false);
                                  setCourseSearchQuery("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    courseIdFilter === course.courseId ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="truncate">{course.name}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="h-9 w-full border border-input rounded-md bg-background flex items-center px-3 text-sm">
                    {selectedCourse ? selectedCourse.name : "Select course..."}
                  </div>
                )}
              </div>

              {/* Limit */}
              <div className="space-y-2">
                <Label htmlFor="limit" className="text-xs font-medium text-slate-700">
                  Per Page
                </Label>
                {isMounted ? (
                  <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value, 10))}>
                    <SelectTrigger id="limit" className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9 w-full border border-input rounded-md bg-background flex items-center px-3 text-sm">
                    {limit}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium">Failed to load enrollments</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchEnrollments}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading enrollments...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && !error && enrollments.length > 0 && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment, index) => (
                      <TableRow key={enrollment.enrollmentId || `enrollment-${index}`}>
                        <TableCell>
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                            <ClipboardList className="h-4 w-4" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link 
                            href={`/admin/users?userId=${enrollment.user.userId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white text-sm font-semibold">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-[color:var(--brand-blue)] transition-colors">
                                {getUserName(enrollment)}
                              </div>
                              <div className="text-xs text-muted-foreground">{enrollment.user.email}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/courses/${enrollment.course.courseId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                          >
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium max-w-xs truncate group-hover:text-[color:var(--brand-blue)] transition-colors">
                              {enrollment.course.name}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              enrollment.status === "completed" ? "default" :
                              enrollment.status === "cancelled" ? "destructive" :
                              "secondary"
                            }
                            className="capitalize"
                          >
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex-1">
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] transition-all"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-slate-600 w-10 text-right">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(enrollment.enrolledAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {enrollment.completedAt ? formatDate(enrollment.completedAt) : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={enrollment.transaction.status === "success" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {enrollment.transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {offset + 1}-{Math.min(offset + limit, total)} of {total} enrollments
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage <= 1 || isLoading}
                      className="gap-1"
                      title="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || isLoading}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground px-4">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || isLoading}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage >= totalPages || isLoading}
                      className="gap-1"
                      title="Last page"
                    >
                      Last
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && !error && enrollments.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasActiveFilters ? "No enrollments found" : "No enrollments yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "Enrollments will appear here once students enroll in courses"}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


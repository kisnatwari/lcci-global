"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/ui/safe-image";
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
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash2, Search, MoreVertical, Eye, Loader2, AlertCircle, CheckCircle, CheckCircle2, ImageIcon, FileText, HelpCircle, Filter, Users, X, Calendar, User, CreditCard, CheckCircle as CheckCircleIcon } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type Course = {
  courseId: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  type?: "Guided" | "SelfPaced";
  category?: {
    categoryId: string;
    name: string;
    description: string;
  };
  creator?: {
    userId: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  materials?: any[];
  quizzes?: any[];
};

type Category = {
  categoryId: string;
  name: string;
  description: string;
};

interface CoursesPageClientProps {
  initialCourses: Course[];
  error: string | null;
}

export function CoursesPageClient({ initialCourses, error: initialError }: CoursesPageClientProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [allCourses, setAllCourses] = useState<Course[]>(initialCourses); // Store all courses for counting
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  
  // Enrollments drawer state
  const [isEnrollmentsDrawerOpen, setIsEnrollmentsDrawerOpen] = useState(false);
  const [selectedCourseForEnrollments, setSelectedCourseForEnrollments] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsTotal, setEnrollmentsTotal] = useState(0);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch categories and all courses for counting
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await apiClient.get(ENDPOINTS.categories.get());
        if (response.success && response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          setCategories(response);
        }
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchAllCourses = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.courses.get());
        let fetchedCourses: Course[] = [];
        if (response.success && response.data && Array.isArray(response.data.courses)) {
          fetchedCourses = response.data.courses;
        } else if (response.data && Array.isArray(response.data.courses)) {
          fetchedCourses = response.data.courses;
        } else if (Array.isArray(response)) {
          fetchedCourses = response;
        }
        setAllCourses(fetchedCourses);
      } catch (err: any) {
        console.error("Failed to fetch all courses:", err);
      }
    };

    fetchCategories();
    fetchAllCourses();
  }, []);

  // Fetch courses from API with filtering
  const fetchCourses = async (categoryId?: string | null, type?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (categoryId) {
        params.append("categoryId", categoryId);
      }
      if (type) {
        params.append("type", type);
      }
      
      const url = params.toString() 
        ? `${ENDPOINTS.courses.get()}?${params.toString()}`
        : ENDPOINTS.courses.get();
      
      const response = await apiClient.get(url);
      let fetchedCourses: Course[] = [];
      if (response.success && response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (Array.isArray(response)) {
        fetchedCourses = response;
      }
      
      setCourses(fetchedCourses);
      
      // Update all courses for counting when no filters are applied
      if (!selectedCategory && !selectedType) {
        setAllCourses(fetchedCourses);
      }
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      setError(err.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses(selectedCategory, selectedType);
  }, [selectedCategory, selectedType]);

  // Filter courses based on search (client-side filtering for search term only)
  // Category and type filtering is handled by backend
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.category && course.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCourse) return;

    setIsSaving(true);
    setError(null);

    try {
      await apiClient.delete(ENDPOINTS.courses.delete(deletingCourse.courseId));
      
      // Remove from local state
      setCourses(courses.filter((course) => course.courseId !== deletingCourse.courseId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingCourse(null);
      setError(null);
      setSuccessMessage("Course deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete course:", err);
      setError(err.message || "Failed to delete course");
    } finally {
      setIsSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle opening enrollments drawer
  const handleViewEnrollments = async (course: Course) => {
    setSelectedCourseForEnrollments(course);
    setIsEnrollmentsDrawerOpen(true);
    setIsLoadingEnrollments(true);
    setEnrollmentsError(null);
    
    try {
      // Use the correct endpoint with courseId query parameter
      const response = await apiClient.get(ENDPOINTS.enrollments.get({ courseId: course.courseId }));
      
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
  const getUserName = (user: any): string => {
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


  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Courses</CardTitle>
              <CardDescription className="mt-1">
                Manage courses and their details
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/admin/courses/new")} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feedback Messages */}
          {(successMessage || error) && (
            <div className="space-y-3">
              {successMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold">{successMessage}</p>
                    <p className="text-xs text-emerald-700">Your changes have been saved successfully.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  <div>
                    <p className="font-semibold">Action required</p>
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filters Section */}
          <div className="space-y-4">
            {/* Category Dropdown and Type Dropdown */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Category: {selectedCategory === null 
                        ? `All Courses (${allCourses.length})` 
                        : categories.find(c => c.categoryId === selectedCategory)?.name || "All Courses"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                      All Courses ({allCourses.length})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {categories.map((category) => {
                      const count = allCourses.filter(c => c.category?.categoryId === category.categoryId).length;
                      return (
                        <DropdownMenuItem 
                          key={category.categoryId}
                          onClick={() => setSelectedCategory(category.categoryId)}
                        >
                          {category.name} ({count})
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Type: {selectedType === null ? "All" : selectedType === "Guided" ? "Guided" : "Self-Paced"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSelectedType(null)}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedType("Guided")}>
                      Guided
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedType("SelfPaced")}>
                      Self-Paced
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading courses...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && filteredCourses.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[64px] px-3"></TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Stats</TableHead>
                      <TableHead className="text-center hidden xl:table-cell">Updated</TableHead>
                      <TableHead className="text-right w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="px-3">
                          {course.thumbnailUrl ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                              <SafeImage
                                src={course.thumbnailUrl}
                                alt={course.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="space-y-1">
                          <div className="font-medium">{course.name}</div>
                          <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl">{course.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                              {course?.category?.name || "—"}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-muted capitalize text-[0.65rem] font-semibold">
                              {course.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center space-y-1">
                          <div className="font-semibold">{course.price != null ? `NPR ${Number(course.price).toLocaleString()}` : "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {course.duration != null ? `${course.duration} days` : "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground hidden xl:table-cell">
                          {formatDate(course.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/courses/${course.courseId}/edit`)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/courses/${course.courseId}`)}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/courses/${course.courseId}/materials`)}
                                className="cursor-pointer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Manage Materials
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/courses/${course.courseId}/quizzes`)}
                                className="cursor-pointer"
                              >
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Manage Quizzes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleViewEnrollments(course)}
                                className="cursor-pointer"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                View Enrollments
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeletingCourse(course);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No courses found matching your search." : "No courses yet. Create your first course."}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingCourse?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enrollments Drawer */}
      <Drawer open={isEnrollmentsDrawerOpen} onOpenChange={setIsEnrollmentsDrawerOpen} direction="right">
        <DrawerContent className="max-w-2xl w-full">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Course Enrollments</DrawerTitle>
                <DrawerDescription>
                  {selectedCourseForEnrollments?.name}
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
                <p className="text-muted-foreground">No enrollments found for this course.</p>
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
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {getUserName(enrollment.user)}
                              </p>
                              <p className="text-sm text-slate-600">{enrollment.user?.email}</p>
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

                      {/* Completed Items */}
                      {enrollment.completedItems && enrollment.completedItems.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-slate-500 mb-2">Completed Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {enrollment.completedItems.map((item: any, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-200"
                              >
                                <CheckCircleIcon className="h-3 w-3" />
                                {item.materialId ? `Material ${item.materialId}` : item.quizId ? `Quiz ${item.quizId}` : "Item"}
                              </span>
                            ))}
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


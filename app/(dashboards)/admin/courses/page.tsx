"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash2, Search, MoreVertical, Eye, BookOpen, Loader2, AlertCircle, CheckCircle, CheckCircle2, ImageIcon, FileText, HelpCircle } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

// Static categories data (for dropdown)
const categories = [
  {
    categoryId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Communication & Presence",
    description: "Executive communication, presentation and storytelling",
  },
  {
    categoryId: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
    name: "Leadership & Coaching",
    description: "Leadership presence, influence and coaching capability",
  },
  {
    categoryId: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
    name: "Customer Experience",
    description: "Service excellence and client experience programmes",
  },
];

// Static creators data (for dropdown)
const creators = [
  {
    userId: "user-1",
    profile: {
      firstName: "John",
      lastName: "Doe",
    },
  },
  {
    userId: "user-2",
    profile: {
      firstName: "Jane",
      lastName: "Smith",
    },
  },
];

// Static courses data matching the API schema
const initialCourses = [
  {
    courseId: "course-1",
    name: "Executive Communication Lab",
    description: "Strengthen strategic communication, storytelling and executive presence.",
    level: "intermediate" as const,
    price: 125,
    duration: 32,
    createdAt: "2025-11-18",
    updatedAt: "2025-11-18",
    category: categories[0],
    creator: creators[0],
  },
  {
    courseId: "course-2",
    name: "Leadership Presence Accelerator",
    description: "Immersive leadership journey focusing on influence, coaching and decision making.",
    level: "advanced" as const,
    price: 210,
    duration: 48,
    createdAt: "2025-11-17",
    updatedAt: "2025-11-17",
    category: categories[1],
    creator: creators[1],
  },
  {
    courseId: "course-3",
    name: "Customer Experience Excellence",
    description: "Design memorable service experiences and service recovery playbooks.",
    level: "intermediate" as const,
    price: 160,
    duration: 36,
    createdAt: "2025-11-16",
    updatedAt: "2025-11-16",
    category: categories[2],
    creator: creators[0],
  },
];

type Course = {
  courseId: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number; // Duration in days (from schema)
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    categoryId: string;
    name: string;
    description: string;
  };
  creator: {
    userId: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  materials?: CourseMaterial[];
  quizzes?: Quiz[];
};

type CourseDetail = Course & {
  overview?: string | null;
  curriculum?: string | null;
  requirements?: string | null;
};

type CourseMaterial = {
  materialId: string;
  courseId: string;
  type: "video" | "pdf" | "doc" | "link";
  title: string;
  url: string;
  orderIndex: number;
  createdAt: string;
};

type Quiz = {
  quizId: string;
  courseId: string;
  title: string;
  description?: string;
  createdAt: string;
  questions?: QuizQuestion[];
};

type QuizQuestion = {
  questionId: string;
  quizId: string;
  questionText: string;
  options: Array<{
    id: string;
    text: string;
    is_correct: boolean;
  }>;
  orderIndex: number;
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch data on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from API
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.courses.get());
      if (response.success && response.data && Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else if (response.data && Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else if (Array.isArray(response)) {
        setCourses(response);
      } else {
        setCourses([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      setError(err.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter courses based on search
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

  // Get creator full name
  const getCreatorName = (creator: Course["creator"]) => {
    if (!creator?.profile) {
      return "Unknown";
    }
    const firstName = creator.profile.firstName || "";
    const lastName = creator.profile.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "Unknown";
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

          {/* Search Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
            </div>
          </div>

          {/* Table Section */}
          {filteredCourses.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[64px] px-3"></TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Stats</TableHead>
                      <TableHead className="text-center hidden lg:table-cell">Creator</TableHead>
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
                              <Image
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
                              {course.category.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-muted capitalize text-[0.65rem] font-semibold">
                              {course.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center space-y-1">
                          <div className="font-semibold">{course.price != null ? `NPR ${Number(course.price).toLocaleString()}` : "—"}</div>
                          <div className="text-xs text-muted-foreground">{course.duration} days</div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground hidden lg:table-cell">
                          {getCreatorName(course.creator)}
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
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No courses found matching your search." : "No courses yet. Create your first course."}
              </p>
            </div>
          )}
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


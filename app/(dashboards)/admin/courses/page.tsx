"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash2, Search, MoreVertical, Eye, Copy, BookOpen, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    price: "",
    duration: "",
    categoryId: "",
    creatorId: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
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

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.categories.get());
      if (response.success && response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else if (response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.category && course.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (course?: Course) => {
    setError(null);
    setSuccessMessage(null);
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name || "",
        description: course.description || "",
        level: course.level,
        price: course.price?.toString() || "",
        duration: course.duration?.toString() || "",
        categoryId: course.category?.categoryId || "",
        creatorId: course.creator?.userId || "",
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: "",
        description: "",
        level: "beginner",
        price: "",
        duration: "",
        categoryId: "",
        creatorId: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.name || !formData.name.trim()) {
      setError("Course name is required");
      return;
    }

    if (!formData.categoryId) {
      setError("Category is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: (formData.description && formData.description.trim()) || undefined,
        level: formData.level,
        price: parseFloat(formData.price) || 0,
        duration: parseInt(formData.duration) || 0,
        categoryId: formData.categoryId,
      };

      if (editingCourse) {
        // Update existing course
        const response = await apiClient.put(ENDPOINTS.courses.update(editingCourse.courseId), payload);
        console.log("Update response:", response);
        setSuccessMessage("Course updated successfully!");
      } else {
        // Create new course
        const response = await apiClient.post(ENDPOINTS.courses.post(), payload);
        console.log("Create response:", response);
        setSuccessMessage("Course created successfully!");
      }

      // Refresh the list
      await fetchCourses();

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingCourse(null);
        setFormData({
          name: "",
          description: "",
          level: "beginner",
          price: "",
          duration: "",
          categoryId: "",
          creatorId: "",
        });
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save course:", err);
      const errorMessage = err.message || 
                          (err.response?.data?.message) ||
                          (editingCourse ? "Failed to update course" : "Failed to create course");
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

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
      
      console.log("Course deleted successfully");
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
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--brand-blue)/10 text-(--brand-blue)">
                          <BookOpen className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{course.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                            {course.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{course.category.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted capitalize">
                          {course.level}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${course.price}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.duration} days
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getCreatorName(course.creator)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
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
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleOpenDialog(course)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // View action - can be implemented later
                                console.log("View course:", course.courseId);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Duplicate action - can be implemented later
                                console.log("Duplicate course:", course.courseId);
                              }}
                              className="cursor-pointer"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
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
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No courses found matching your search." : "No courses yet. Create your first course."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Create New Course"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? "Update the course information below."
                : "Fill in the details to create a new course."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter course name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter course description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creator">Creator *</Label>
                <Select
                  value={formData.creatorId}
                  onValueChange={(value) => setFormData({ ...formData, creatorId: value })}
                >
                  <SelectTrigger id="creator">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {creators.map((creator) => (
                      <SelectItem key={creator.userId} value={creator.userId}>
                        {getCreatorName(creator)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name.trim() ||
                !formData.categoryId ||
                !formData.creatorId ||
                !formData.price ||
                !formData.duration
              }
            >
              {editingCourse ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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


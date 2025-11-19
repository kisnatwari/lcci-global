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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Search, HelpCircle, Pencil, Eye, Copy, Trash2, Loader2, AlertCircle, CheckCircle2, Settings } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type Quiz = {
  quizId: string;
  courseId: string;
  title: string;
  description?: string;
  createdAt: string;
  course?: {
    courseId: string;
    name: string;
  };
  questions?: QuizQuestion[];
  _count?: {
    questions: number;
  };
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

// Static data for development
const initialQuizzes: Quiz[] = [
  {
    quizId: "quiz-1",
    courseId: "course-1",
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
    createdAt: "2025-11-19T10:00:00.000Z",
    course: { courseId: "course-1", name: "Introduction to JavaScript" },
    _count: { questions: 10 },
  },
  {
    quizId: "quiz-2",
    courseId: "course-1",
    title: "Advanced JavaScript Concepts",
    description: "Challenge yourself with advanced topics like closures, promises, and async/await.",
    createdAt: "2025-11-19T11:00:00.000Z",
    course: { courseId: "course-1", name: "Introduction to JavaScript" },
    _count: { questions: 15 },
  },
  {
    quizId: "quiz-3",
    courseId: "course-2",
    title: "Business Strategy Assessment",
    description: "Evaluate your understanding of strategic planning and business development.",
    createdAt: "2025-11-18T15:00:00.000Z",
    course: { courseId: "course-2", name: "Advanced Business Management" },
    _count: { questions: 8 },
  },
];

const initialCourses = [
  { courseId: "course-1", name: "Introduction to JavaScript" },
  { courseId: "course-2", name: "Advanced Business Management" },
  { courseId: "course-3", name: "Professional English Communication" },
];

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    // For now, just set loading to false since we're using static data
    setIsLoading(false);
    // fetchQuizzes();
    // fetchCourses();
  }, []);

  // Filter quizzes based on search
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quiz.course && quiz.course.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (quiz?: Quiz) => {
    setError(null);
    setSuccessMessage(null);
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        title: quiz.title || "",
        description: quiz.description || "",
        courseId: quiz.courseId,
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: "",
        description: "",
        courseId: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.title || !formData.title.trim()) {
      setError("Quiz title is required");
      return;
    }

    if (!formData.courseId) {
      setError("Course is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: (formData.description && formData.description.trim()) || undefined,
        courseId: formData.courseId,
      };

      if (editingQuiz) {
        // Update existing quiz (static for now)
        setQuizzes(quizzes.map(quiz => 
          quiz.quizId === editingQuiz.quizId 
            ? { ...quiz, ...payload, course: courses.find(c => c.courseId === payload.courseId) }
            : quiz
        ));
        setSuccessMessage("Quiz updated successfully!");
      } else {
        // Create new quiz (static for now)
        const newQuiz: Quiz = {
          quizId: `quiz-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          course: courses.find(c => c.courseId === payload.courseId),
          _count: { questions: 0 },
        };
        setQuizzes([...quizzes, newQuiz]);
        setSuccessMessage("Quiz created successfully!");
      }

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingQuiz(null);
        setFormData({
          title: "",
          description: "",
          courseId: "",
        });
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save quiz:", err);
      setError(err.message || (editingQuiz ? "Failed to update quiz" : "Failed to create quiz"));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingQuiz) return;

    setIsSaving(true);
    setError(null);

    try {
      // Delete quiz (static for now)
      setQuizzes(quizzes.filter((quiz) => quiz.quizId !== deletingQuiz.quizId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingQuiz(null);
      
      console.log("Quiz deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete quiz:", err);
      setError(err.message || "Failed to delete quiz");
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

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Quizzes</CardTitle>
              <CardDescription className="mt-1">
                Manage course quizzes and assessments
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Quiz
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
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredQuizzes.length} {filteredQuizzes.length === 1 ? "quiz" : "quizzes"} found
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading quizzes...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && filteredQuizzes.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.quizId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                          <HelpCircle className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quiz.title}</div>
                          {quiz.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                              {quiz.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {quiz.course?.name || "Unknown Course"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                          {quiz._count?.questions || 0} questions
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(quiz.createdAt)}
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
                              onClick={() => handleOpenDialog(quiz)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // TODO: Navigate to questions management
                                console.log("Manage questions for quiz:", quiz.quizId);
                              }}
                              className="cursor-pointer"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Manage Questions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // TODO: Navigate to quiz preview
                                console.log("Preview quiz:", quiz.quizId);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingQuiz(quiz);
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
          )}

          {/* Empty State */}
          {!isLoading && filteredQuizzes.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No quizzes found matching your search." : "No quizzes yet. Create your first quiz."}
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
              {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
            </DialogTitle>
            <DialogDescription>
              {editingQuiz
                ? "Update the quiz information below."
                : "Fill in the details to create a new quiz."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setError(null);
                }}
                placeholder="Enter quiz title"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter quiz description (optional)"
                rows={3}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                disabled={isSaving}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.courseId} value={course.courseId}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setError(null);
                setSuccessMessage(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.title.trim() || !formData.courseId || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingQuiz ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingQuiz ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingQuiz?.title}&quot;? This will also delete all associated questions. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {/* Error Message in Delete Dialog */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setError(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSaving}
            >
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
    </div>
  );
}

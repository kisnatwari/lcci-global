"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ArrowLeft, Plus, MoreVertical, Search, HelpCircle, Pencil, Eye, Trash2, Loader2, AlertCircle, CheckCircle2, MessageSquare, X, ArrowUp, ArrowDown } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type Quiz = {
  quizId: string;
  courseId: string;
  title: string;
  description?: string;
  createdAt: string;
  questions?: Array<{
    questionId: string;
    questionText: string;
    orderIndex?: number;
    options?: Array<{
      id: string;
      text: string;
      is_correct?: boolean;
      isCorrect?: boolean;
    } | string>;
  }>;
  _count?: {
    questions: number;
  };
};

type Course = {
  courseId: string;
  name: string;
};

export default function CourseQuizzesPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);
  const [viewingQuiz, setViewingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [] as Array<{
      questionText: string;
      correctAnswer: string;
      orderIndex: number;
    }>,
  });

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
    fetchCourse();
    fetchQuizzes();
  }, [courseId]);

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.courses.getById(courseId));
      const data = response.data || response;
      setCourse({
        courseId: data.courseId,
        name: data.name,
      });
    } catch (err: any) {
      console.error("Failed to fetch course:", err);
    }
  };

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.quizzes.getByCourse(courseId));
      // Handle different response structures
      if (response.success && Array.isArray(response.data)) {
        // API returns: { success: true, data: [...] }
        setQuizzes(response.data);
      } else if (response.success && response.data && Array.isArray(response.data.quizzes)) {
        // Alternative structure: { success: true, data: { quizzes: [...] } }
        setQuizzes(response.data.quizzes);
      } else if (Array.isArray(response.data)) {
        // Direct array in data
        setQuizzes(response.data);
      } else if (Array.isArray(response)) {
        // Response is directly an array
        setQuizzes(response);
      } else {
        setQuizzes([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch quizzes:", err);
      setError(err.message || "Failed to load quizzes");
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter quizzes based on search
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle create/edit dialog open
  const handleOpenDialog = async (quiz?: Quiz) => {
    setError(null);
    setSuccessMessage(null);
    if (quiz) {
      setEditingQuiz(quiz);
      // Fetch quiz questions if editing
      try {
        const response = await apiClient.get(ENDPOINTS.quizQuestions.getByQuiz(quiz.quizId));
        const questions = Array.isArray(response.data) ? response.data : (response.data?.questions || []);
        setFormData({
          title: quiz.title || "",
          description: quiz.description || "",
          questions: questions.map((q: any, index: number) => ({
            questionText: q.questionText || "",
            correctAnswer: q.correctAnswer || "",
            orderIndex: q.orderIndex ?? index + 1,
          })),
        });
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setFormData({
          title: quiz.title || "",
          description: quiz.description || "",
          questions: [],
        });
      }
    } else {
      setEditingQuiz(null);
      setFormData({
        title: "",
        description: "",
        questions: [],
      });
    }
    setIsDialogOpen(true);
  };

  // Add question
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: "",
          correctAnswer: "",
          orderIndex: formData.questions.length + 1,
        },
      ],
    });
  };

  // Remove question
  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index).map((q, i) => ({
        ...q,
        orderIndex: i + 1,
      })),
    });
  };

  // Update question
  const updateQuestion = (index: number, field: "questionText" | "correctAnswer", value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
    setError(null);
  };

  // Reorder question
  const reorderQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === formData.questions.length - 1) return;

    const updatedQuestions = [...formData.questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updatedQuestions[index], updatedQuestions[newIndex]] = [updatedQuestions[newIndex], updatedQuestions[index]];
    
    // Update order indices
    updatedQuestions.forEach((q, i) => {
      q.orderIndex = i + 1;
    });

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.title || !formData.title.trim()) {
      setError("Quiz title is required");
      return;
    }

    // Validate questions
    const validQuestions = formData.questions.filter(q => q.questionText.trim() && q.correctAnswer.trim());
    if (validQuestions.length === 0) {
      setError("At least one question with both question text and correct answer is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: (formData.description && formData.description.trim()) || "",
        questions: validQuestions.map((q, index) => ({
          questionText: q.questionText.trim(),
          correctAnswer: q.correctAnswer.trim(),
          orderIndex: index + 1,
        })),
      };

      if (editingQuiz) {
        // Update existing quiz
        await apiClient.put(ENDPOINTS.quizzes.update(courseId, editingQuiz.quizId), payload);
        setSuccessMessage("Quiz updated successfully!");
      } else {
        // Create new quiz
        await apiClient.post(ENDPOINTS.quizzes.post(courseId), payload);
        setSuccessMessage("Quiz created successfully!");
      }

      // Refresh quizzes list
      await fetchQuizzes();

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingQuiz(null);
        setFormData({
          title: "",
          description: "",
          questions: [],
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
      // Delete quiz
      await apiClient.delete(ENDPOINTS.quizzes.delete(courseId, deletingQuiz.quizId));
      
      // Refresh quizzes list
      await fetchQuizzes();
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingQuiz(null);
      setSuccessMessage("Quiz deleted successfully!");
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Course Quizzes
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {course ? `Managing quizzes for: ${course.name}` : "Loading course..."}
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Quiz
        </Button>
      </div>

      {/* Main Card with all content */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Feedback Messages */}
          {(successMessage || error) && (
            <div className="space-y-3">
              {successMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
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
                    <TableHead>Description</TableHead>
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                          {quiz.description || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-muted rounded-full">
                          <MessageSquare className="h-3 w-3" />
                          {quiz.questions?.length || quiz._count?.questions || 0}
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
                              onClick={() => {
                                setViewingQuiz(quiz);
                                setIsViewDialogOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDialog(quiz)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--brand-blue)]/10">
                {editingQuiz ? (
                  <Pencil className="w-6 h-6 text-[color:var(--brand-blue)]" />
                ) : (
                  <Plus className="w-6 h-6 text-[color:var(--brand-blue)]" />
                )}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
                </DialogTitle>
                <DialogDescription className="mt-1.5 text-slate-600">
                  {editingQuiz
                    ? "Update the quiz information and questions below."
                    : "Fill in the details and add questions to create a new quiz for this course."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-sm mt-1">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  Quiz Title
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setError(null);
                  }}
                  placeholder="e.g., Communication Fundamentals Quiz"
                  disabled={isSaving}
                  className="h-11 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-900">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setError(null);
                  }}
                  placeholder="Enter quiz description (optional)"
                  rows={3}
                  disabled={isSaving}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Questions
                  <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {formData.questions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No questions yet. Click "Add Question" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="p-4 border-2 border-slate-200 rounded-lg bg-white">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)] text-xs font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-slate-700">Question {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => reorderQuestion(index, "up")}
                            disabled={index === 0 || isSaving}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => reorderQuestion(index, "down")}
                            disabled={index === formData.questions.length - 1 || isSaving}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeQuestion(index)}
                            disabled={isSaving || formData.questions.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-700">Question Text *</Label>
                          <Input
                            value={question.questionText}
                            onChange={(e) => updateQuestion(index, "questionText", e.target.value)}
                            placeholder="Enter the question"
                            disabled={isSaving}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-700">Correct Answer *</Label>
                          <Input
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(index, "correctAnswer", e.target.value)}
                            placeholder="Enter the correct answer"
                            disabled={isSaving}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-200 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setError(null);
                setSuccessMessage(null);
              }}
              disabled={isSaving}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.title.trim() || formData.questions.length === 0 || isSaving}
              className="h-11 px-6 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingQuiz ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editingQuiz ? (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      Update Quiz
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Quiz
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Quiz Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1200px] 2xl:max-w-[1400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {viewingQuiz?.title || "Quiz Details"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              {viewingQuiz?.description || "View quiz information and questions"}
            </DialogDescription>
          </DialogHeader>

          {viewingQuiz && (
            <div className="space-y-3">
              {/* Basic Info - Compact */}
              <div className="grid grid-cols-2 gap-3 text-sm pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-500">Questions:</span>
                  <span className="ml-2 font-semibold text-slate-900">
                    {viewingQuiz.questions?.length || 0}
                  </span>
                </div>
                {viewingQuiz.createdAt && (
                  <div>
                    <span className="text-slate-500">Created:</span>
                    <span className="ml-2 text-slate-700">{formatDate(viewingQuiz.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Questions - Compact Grid Layout */}
              {viewingQuiz.questions && viewingQuiz.questions.length > 0 ? (
                <div className="space-y-2.5">
                  {viewingQuiz.questions
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((question, index) => (
                      <div key={question.questionId || index} className="p-3 border border-slate-200 rounded-lg bg-white">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)] text-xs font-semibold shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm font-medium text-slate-900 flex-1 leading-snug">
                            {question.questionText}
                          </p>
                        </div>

                        {/* Options - Grid Layout for Larger Screens */}
                        {question.options && question.options.length > 0 && (
                          <div className="ml-8 grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                            {question.options.map((option: any, optIndex: number) => {
                              const isCorrect = option.is_correct === true || option.isCorrect === true;
                              return (
                                <div
                                  key={option.id || optIndex}
                                  className={`flex items-center gap-1.5 p-1.5 rounded ${
                                    isCorrect
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-slate-50'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                                    isCorrect
                                      ? 'bg-green-500 text-white'
                                      : 'bg-slate-300 text-slate-700'
                                  }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span className={`text-xs flex-1 ${
                                    isCorrect ? 'text-green-900 font-medium' : 'text-slate-700'
                                  }`}>
                                    {option.text || option}
                                  </span>
                                  {isCorrect && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No questions available</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false);
                setViewingQuiz(null);
              }}
              className="h-10 px-6"
            >
              Close
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
              Are you sure you want to delete &quot;{deletingQuiz?.title}&quot;? This action cannot be undone.
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


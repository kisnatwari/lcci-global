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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MoreVertical, Search, MessageSquare, Pencil, Eye, Trash2, Loader2, AlertCircle, CheckCircle2, ArrowUp, ArrowDown, X } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

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
  quiz?: {
    quizId: string;
    title: string;
    course?: {
      courseId: string;
      name: string;
    };
  };
};

// Static data for development
const initialQuestions: QuizQuestion[] = [
  {
    questionId: "q-1",
    quizId: "quiz-1",
    questionText: "Which technique helps keep executive updates concise and clear?",
    options: [
      { id: "opt-1", text: "Using the BLUF (Bottom Line Up Front) structure", is_correct: true },
      { id: "opt-2", text: "Adding multiple detailed anecdotes", is_correct: false },
      { id: "opt-3", text: "Sharing every data point available", is_correct: false },
      { id: "opt-4", text: "Starting with background information only", is_correct: false },
    ],
    orderIndex: 1,
    quiz: {
      quizId: "quiz-1",
      title: "Communication Fundamentals Quiz",
      course: { courseId: "course-1", name: "Executive Communication Lab" },
    },
  },
  {
    questionId: "q-2",
    quizId: "quiz-1",
    questionText: "Which of the following is NOT part of the communication triangle (speaker, message, audience)?",
    options: [
      { id: "opt-5", text: "Speaker", is_correct: false },
      { id: "opt-6", text: "Channel", is_correct: true },
      { id: "opt-7", text: "Message", is_correct: false },
      { id: "opt-8", text: "Audience", is_correct: false },
    ],
    orderIndex: 2,
    quiz: {
      quizId: "quiz-1",
      title: "Communication Fundamentals Quiz",
      course: { courseId: "course-1", name: "Executive Communication Lab" },
    },
  },
  {
    questionId: "q-3",
    quizId: "quiz-3",
    questionText: "What is the primary focus of leadership presence coaching?",
    options: [
      { id: "opt-9", text: "Improving slide design", is_correct: false },
      { id: "opt-10", text: "Aligning body language, voice and intent", is_correct: true },
      { id: "opt-11", text: "Memorising scripts word-for-word", is_correct: false },
      { id: "opt-12", text: "Sharing as much data as possible", is_correct: false },
    ],
    orderIndex: 1,
    quiz: {
      quizId: "quiz-3",
      title: "Leadership Presence Assessment",
      course: { courseId: "course-2", name: "Leadership Presence Accelerator" },
    },
  },
];

const initialQuizzes = [
  { quizId: "quiz-1", title: "Communication Fundamentals Quiz", course: { name: "Executive Communication Lab" } },
  { quizId: "quiz-2", title: "Executive Storytelling Scenarios", course: { name: "Executive Communication Lab" } },
  { quizId: "quiz-3", title: "Leadership Presence Assessment", course: { name: "Leadership Presence Accelerator" } },
];

export default function QuizQuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [quizzes, setQuizzes] = useState<any[]>(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<QuizQuestion | null>(null);
  const [formData, setFormData] = useState({
    questionText: "",
    quizId: "",
    orderIndex: "",
    options: [
      { id: "1", text: "", is_correct: false },
      { id: "2", text: "", is_correct: false },
      { id: "3", text: "", is_correct: false },
      { id: "4", text: "", is_correct: false },
    ],
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
    // fetchQuestions();
    // fetchQuizzes();
  }, []);

  // Filter questions based on search and selected quiz
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (question.quiz && question.quiz.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesQuiz = !selectedQuiz || question.quizId === selectedQuiz;
    return matchesSearch && matchesQuiz;
  });

  // Handle create/edit dialog open
  const handleOpenDialog = (question?: QuizQuestion) => {
    setError(null);
    setSuccessMessage(null);
    if (question) {
      setEditingQuestion(question);
      setFormData({
        questionText: question.questionText || "",
        quizId: question.quizId,
        orderIndex: question.orderIndex.toString(),
        options: question.options.map((opt, index) => ({
          id: (index + 1).toString(),
          text: opt.text,
          is_correct: opt.is_correct,
        })),
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        questionText: "",
        quizId: selectedQuiz || "",
        orderIndex: "",
        options: [
          { id: "1", text: "", is_correct: false },
          { id: "2", text: "", is_correct: false },
          { id: "3", text: "", is_correct: false },
          { id: "4", text: "", is_correct: false },
        ],
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.questionText || !formData.questionText.trim()) {
      setError("Question text is required");
      return;
    }

    if (!formData.quizId) {
      setError("Quiz is required");
      return;
    }

    // Validate options
    const validOptions = formData.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      setError("At least 2 options are required");
      return;
    }

    const correctOptions = validOptions.filter(opt => opt.is_correct);
    if (correctOptions.length === 0) {
      setError("At least one correct option is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        questionText: formData.questionText.trim(),
        quizId: formData.quizId,
        orderIndex: parseInt(formData.orderIndex) || questions.filter(q => q.quizId === formData.quizId).length + 1,
        options: validOptions.map((opt, index) => ({
          id: `opt-${Date.now()}-${index}`,
          text: opt.text.trim(),
          is_correct: opt.is_correct,
        })),
      };

      if (editingQuestion) {
        // Update existing question (static for now)
        setQuestions(questions.map(q => 
          q.questionId === editingQuestion.questionId 
            ? { ...q, ...payload, quiz: quizzes.find(quiz => quiz.quizId === payload.quizId) }
            : q
        ));
        setSuccessMessage("Question updated successfully!");
      } else {
        // Create new question (static for now)
        const newQuestion: QuizQuestion = {
          questionId: `q-${Date.now()}`,
          ...payload,
          quiz: quizzes.find(quiz => quiz.quizId === payload.quizId),
        };
        setQuestions([...questions, newQuestion]);
        setSuccessMessage("Question created successfully!");
      }

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingQuestion(null);
        setFormData({
          questionText: "",
          quizId: selectedQuiz || "",
          orderIndex: "",
          options: [
            { id: "1", text: "", is_correct: false },
            { id: "2", text: "", is_correct: false },
            { id: "3", text: "", is_correct: false },
            { id: "4", text: "", is_correct: false },
          ],
        });
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save question:", err);
      setError(err.message || (editingQuestion ? "Failed to update question" : "Failed to create question"));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingQuestion) return;

    setIsSaving(true);
    setError(null);

    try {
      // Delete question (static for now)
      setQuestions(questions.filter((question) => question.questionId !== deletingQuestion.questionId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingQuestion(null);
      
      console.log("Question deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete question:", err);
      setError(err.message || "Failed to delete question");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reorder
  const handleReorder = (questionId: string, direction: "up" | "down") => {
    const question = questions.find(q => q.questionId === questionId);
    if (!question) return;

    const sameQuiz = questions.filter(q => q.quizId === question.quizId);
    const currentIndex = sameQuiz.findIndex(q => q.questionId === questionId);
    
    if (direction === "up" && currentIndex > 0) {
      const targetQuestion = sameQuiz[currentIndex - 1];
      setQuestions(questions.map(q => {
        if (q.questionId === questionId) return { ...q, orderIndex: targetQuestion.orderIndex };
        if (q.questionId === targetQuestion.questionId) return { ...q, orderIndex: question.orderIndex };
        return q;
      }));
    } else if (direction === "down" && currentIndex < sameQuiz.length - 1) {
      const targetQuestion = sameQuiz[currentIndex + 1];
      setQuestions(questions.map(q => {
        if (q.questionId === questionId) return { ...q, orderIndex: targetQuestion.orderIndex };
        if (q.questionId === targetQuestion.questionId) return { ...q, orderIndex: question.orderIndex };
        return q;
      }));
    }
  };

  // Handle option change
  const handleOptionChange = (optionId: string, field: "text" | "is_correct", value: string | boolean) => {
    setFormData({
      ...formData,
      options: formData.options.map(opt =>
        opt.id === optionId ? { ...opt, [field]: value } : opt
      ),
    });
    setError(null);
  };

  // Add new option
  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [
          ...formData.options,
          { id: (formData.options.length + 1).toString(), text: "", is_correct: false },
        ],
      });
    }
  };

  // Remove option
  const removeOption = (optionId: string) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter(opt => opt.id !== optionId),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Quiz Questions</CardTitle>
              <CardDescription className="mt-1">
                Manage questions for quizzes and assessments
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters Section */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedQuiz || "all"} onValueChange={(value) => setSelectedQuiz(value === "all" ? "" : value)}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All quizzes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All quizzes</SelectItem>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.quizId} value={quiz.quizId}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredQuestions.length} {filteredQuestions.length === 1 ? "question" : "questions"} found
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading questions...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && filteredQuestions.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((question) => (
                    <TableRow key={question.questionId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium line-clamp-2">{question.questionText}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {question.options.filter(opt => opt.is_correct).length} correct answer(s)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <div className="font-medium">{question.quiz?.title || "Unknown Quiz"}</div>
                          <div className="text-muted-foreground">
                            {question.quiz?.course?.name || "Unknown Course"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                          {question.options.length} options
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{question.orderIndex}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleReorder(question.questionId, "up")}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleReorder(question.questionId, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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
                              onClick={() => handleOpenDialog(question)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingQuestion(question);
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
          {!isLoading && filteredQuestions.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm || selectedQuiz ? "No questions found matching your filters." : "No questions yet. Create your first question."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Question" : "Create New Question"}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? "Update the question and its options below."
                : "Fill in the question details and provide multiple choice options."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz">Quiz *</Label>
                <Select
                  value={formData.quizId}
                  onValueChange={(value) => setFormData({ ...formData, quizId: value })}
                  disabled={isSaving}
                >
                  <SelectTrigger id="quiz">
                    <SelectValue placeholder="Select quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.map((quiz) => (
                      <SelectItem key={quiz.quizId} value={quiz.quizId}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Order Index</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  min="1"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
                  placeholder="Auto-assigned if empty"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionText">Question Text *</Label>
              <Textarea
                id="questionText"
                value={formData.questionText}
                onChange={(e) => {
                  setFormData({ ...formData, questionText: e.target.value });
                  setError(null);
                }}
                placeholder="Enter the question text"
                rows={3}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={formData.options.length >= 6 || isSaving}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`correct-${option.id}`}
                        checked={option.is_correct}
                        onCheckedChange={(checked) =>
                          handleOptionChange(option.id, "is_correct", checked as boolean)
                        }
                        disabled={isSaving}
                      />
                      <Label htmlFor={`correct-${option.id}`} className="text-sm font-medium">
                        Correct
                      </Label>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={option.text}
                        onChange={(e) => handleOptionChange(option.id, "text", e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        disabled={isSaving}
                      />
                    </div>
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        disabled={isSaving}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Mark at least one option as correct. You can have multiple correct answers.
              </p>
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
              disabled={!formData.questionText.trim() || !formData.quizId || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingQuestion ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingQuestion ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
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

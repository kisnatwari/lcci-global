"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  FileText,
  Video,
  Link as LinkIcon,
  Award,
  Star,
  Calendar,
  User,
  MessageSquare,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

// Static data for demo - in real app this would come from API based on enrollmentId
const enrollmentData = {
  enrollmentId: "enr-1",
  course: {
    courseId: "course-1",
    name: "Introduction to JavaScript",
    description: "Master the fundamentals of JavaScript programming including variables, functions, objects, and modern ES6+ features. Perfect for beginners looking to start their coding journey.",
    level: "beginner",
    price: 99.99,
    duration: 30, // days
    category: { name: "Programming" },
    creator: {
      userId: "user-1",
      firstName: "Sarah",
      lastName: "Johnson",
      profile: { avatarUrl: null },
    },
  },
  progress: 75,
  status: "in_progress",
  enrolledAt: "2025-11-01T10:00:00.000Z",
  lastAccessed: "2025-11-19T10:00:00.000Z",
  completedAt: null,
  score: null,
  certificateUrl: null,
  totalLessons: 24,
  completedLessons: 18,
  totalQuizzes: 6,
  completedQuizzes: 4,
};

const courseMaterials = [
  {
    materialId: "mat-1",
    title: "Welcome to JavaScript",
    type: "video",
    url: "#",
    orderIndex: 1,
    completed: true,
    duration: "15 min",
  },
  {
    materialId: "mat-2",
    title: "Variables and Data Types",
    type: "video",
    url: "#",
    orderIndex: 2,
    completed: true,
    duration: "20 min",
  },
  {
    materialId: "mat-3",
    title: "JavaScript Reference Guide",
    type: "pdf",
    url: "#",
    orderIndex: 3,
    completed: true,
    duration: null,
  },
  {
    materialId: "mat-4",
    title: "Functions and Scope",
    type: "video",
    url: "#",
    orderIndex: 4,
    completed: false,
    duration: "25 min",
  },
  {
    materialId: "mat-5",
    title: "Objects and Arrays",
    type: "video",
    url: "#",
    orderIndex: 5,
    completed: false,
    duration: "30 min",
  },
  {
    materialId: "mat-6",
    title: "Modern JavaScript (ES6+)",
    type: "link",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    orderIndex: 6,
    completed: false,
    duration: null,
  },
];

const quizzes = [
  {
    quizId: "quiz-1",
    title: "Variables and Data Types Quiz",
    description: "Test your understanding of JavaScript variables and data types",
    status: "completed",
    score: 95,
    questions: 10,
    completedAt: "2025-11-15T14:00:00.000Z",
  },
  {
    quizId: "quiz-2",
    title: "Functions Quiz",
    description: "Assess your knowledge of JavaScript functions",
    status: "completed",
    score: 88,
    questions: 8,
    completedAt: "2025-11-16T16:30:00.000Z",
  },
  {
    quizId: "quiz-3",
    title: "Objects and Arrays Quiz",
    description: "Challenge your understanding of JavaScript objects and arrays",
    status: "pending",
    score: null,
    questions: 12,
    completedAt: null,
  },
];

const achievements = [
  {
    id: "ach-1",
    title: "First Lesson Completed",
    description: "Completed your first lesson",
    earnedAt: "2025-11-02T10:00:00.000Z",
    icon: "🎯",
  },
  {
    id: "ach-2",
    title: "Quiz Master",
    description: "Scored 90% or higher on a quiz",
    earnedAt: "2025-11-15T14:00:00.000Z",
    icon: "🏆",
  },
];

export default function EnrollmentDetailsPage({ params }: { params: { enrollmentId: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not completed";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "link": return <LinkIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getQuizStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Course Header */}
      <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {enrollmentData.course.name}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="secondary" className={getLevelColor(enrollmentData.course.level)}>
                      {enrollmentData.course.level}
                    </Badge>
                    <Badge variant="outline">
                      {enrollmentData.course.category.name}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {enrollmentData.status === "completed" ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                    {enrollmentData.course.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {enrollmentData.progress}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <Progress value={enrollmentData.progress} className="h-3" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{enrollmentData.completedLessons}/{enrollmentData.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>{enrollmentData.completedQuizzes}/{enrollmentData.totalQuizzes} quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{enrollmentData.course.duration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span>Enrolled {formatDate(enrollmentData.enrolledAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={enrollmentData.course.creator.profile?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {enrollmentData.course.creator.firstName[0]}{enrollmentData.course.creator.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {enrollmentData.course.creator.firstName} {enrollmentData.course.creator.lastName}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Course Instructor</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Price</span>
                    <p className="font-semibold text-slate-900 dark:text-white">${enrollmentData.course.price}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Duration</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{enrollmentData.course.duration} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lessons Completed</span>
                    <span className="font-medium">{enrollmentData.completedLessons}/{enrollmentData.totalLessons}</span>
                  </div>
                  <Progress value={(enrollmentData.completedLessons / enrollmentData.totalLessons) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quizzes Completed</span>
                    <span className="font-medium">{enrollmentData.completedQuizzes}/{enrollmentData.totalQuizzes}</span>
                  </div>
                  <Progress value={(enrollmentData.completedQuizzes / enrollmentData.totalQuizzes) * 100} className="h-2" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Last accessed: {formatDate(enrollmentData.lastAccessed)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>
                Access all course materials and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseMaterials.map((material, index) => (
                <div
                  key={material.materialId}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    material.completed
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    material.completed
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    {material.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      getMaterialIcon(material.type)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {index + 1}. {material.title}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {material.type}
                      </Badge>
                    </div>
                    {material.duration && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Duration: {material.duration}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={material.completed ? "outline" : "default"}
                    className={material.completed ? "border-green-200 text-green-700 hover:bg-green-50" : ""}
                  >
                    {material.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : material.type === "link" ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.quizId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                      <CardDescription className="mb-3">
                        {quiz.description}
                      </CardDescription>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getQuizStatusColor(quiz.status)}>
                          {quiz.status === "completed" ? "Completed" : "Pending"}
                        </Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {quiz.questions} questions
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {quiz.status === "completed" && quiz.score !== null && (
                    <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="font-semibold text-green-800 dark:text-green-400">
                          Score: {quiz.score}%
                        </span>
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Completed on {formatDate(quiz.completedAt)}
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    variant={quiz.status === "completed" ? "outline" : "default"}
                    disabled={quiz.status === "completed"}
                  >
                    {quiz.status === "completed" ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review Quiz
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Take Quiz
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                    {achievement.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    {achievement.description}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    Earned {formatDate(achievement.earnedAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

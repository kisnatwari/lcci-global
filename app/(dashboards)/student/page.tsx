"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Static data for demo
const studentStats = {
  totalCourses: 8,
  completedCourses: 3,
  inProgressCourses: 4,
  totalHours: 127,
  streakDays: 7,
  certificates: 2,
  averageScore: 89,
};

const recentEnrollments = [
  {
    enrollmentId: "enr-1",
    course: {
      courseId: "course-1",
      name: "Introduction to JavaScript",
      level: "beginner",
      category: { name: "Programming" },
    },
    progress: 75,
    lastAccessed: "2025-11-19T10:00:00.000Z",
    status: "in_progress",
    nextLesson: "Functions and Scope",
  },
  {
    enrollmentId: "enr-2",
    course: {
      courseId: "course-2",
      name: "Advanced Business Management",
      level: "advanced",
      category: { name: "Business" },
    },
    progress: 45,
    lastAccessed: "2025-11-18T15:30:00.000Z",
    status: "in_progress",
    nextLesson: "Strategic Planning",
  },
  {
    enrollmentId: "enr-3",
    course: {
      courseId: "course-3",
      name: "Professional English Communication",
      level: "intermediate",
      category: { name: "Language" },
    },
    progress: 100,
    lastAccessed: "2025-11-17T09:15:00.000Z",
    status: "completed",
    nextLesson: null,
  },
];

const recentAchievements = [
  {
    id: "ach-1",
    title: "First Course Completed",
    description: "Completed your first course successfully",
    earnedAt: "2025-11-15T14:00:00.000Z",
    icon: "🎓",
  },
  {
    id: "ach-2",
    title: "7-Day Streak",
    description: "Studied for 7 consecutive days",
    earnedAt: "2025-11-19T08:00:00.000Z",
    icon: "🔥",
  },
];

const upcomingDeadlines = [
  {
    id: "deadline-1",
    title: "Quiz: JavaScript Basics",
    courseName: "Introduction to JavaScript",
    dueDate: "2025-11-22T23:59:00.000Z",
    type: "quiz",
  },
  {
    id: "deadline-2",
    title: "Assignment: Business Case Study",
    courseName: "Advanced Business Management",
    dueDate: "2025-11-25T23:59:00.000Z",
    type: "assignment",
  },
];

export default function StudentDashboard() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardContent className="p-8">
            <p className="text-sm font-semibold text-sky-600">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Ready for your next learning milestone, John?
            </h1>
            <p className="mt-2 text-slate-500">
              Keep your momentum going. You&apos;re consistently making progress across all enrolled programs.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                <span role="img" aria-hidden="true">
                  🎯
                </span>
                {studentStats.totalCourses} courses enrolled
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                <span role="img" aria-hidden="true">
                  🏆
                </span>
                {studentStats.certificates} certificates earned
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div>
              <p className="text-sm font-semibold text-slate-500">Learning streak</p>
              <p className="mt-4 text-4xl font-bold text-slate-900">
                {studentStats.streakDays} days
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Consistency pays off. Keep it up!
              </p>
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500 tracking-wide">Today&apos;s focus</p>
              <p className="mt-2 text-sm font-medium text-slate-800">Continue “Introduction to JavaScript”</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Key Metrics */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Total courses</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {studentStats.totalCourses}
              </p>
            </div>
            <div className="rounded-full bg-sky-100 p-3 text-sky-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {studentStats.completedCourses}
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Certificates</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {studentStats.certificates}
              </p>
            </div>
            <div className="rounded-full bg-violet-100 p-3 text-violet-600">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500">Average score</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {studentStats.averageScore}%
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Target className="h-5 w-5 text-sky-600" />
              Continue learning
            </CardTitle>
            <CardDescription>
              Pick up right where you left off across active enrollments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEnrollments
              .filter((enrollment) => enrollment.status === "in_progress")
              .map((enrollment) => (
                <div
                  key={enrollment.enrollmentId}
                  className="rounded-xl border border-slate-200 bg-white p-4 hover:border-sky-200 transition-colors"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {enrollment.course.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <span>{enrollment.course.category.name}</span>
                        <span className="text-slate-300">•</span>
                        <span>Last accessed {getTimeAgo(enrollment.lastAccessed)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {enrollment.course.level}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Progress</span>
                      <span className="font-medium text-slate-900">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <Progress value={enrollment.progress} />
                  </div>
                  {enrollment.nextLesson && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Next: {enrollment.nextLesson}
                    </div>
                  )}
                  <div className="mt-4">
                    <Button asChild variant="outline" className="text-sm">
                      <Link href={`/student/enrollments/${enrollment.enrollmentId}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Continue course
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            <Button asChild variant="ghost" className="w-full text-slate-600 hover:text-slate-900">
              <Link href="/student/enrollments">View all enrollments</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Calendar className="h-5 w-5 text-sky-600" />
                Upcoming deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                  <p className="text-sm font-medium text-slate-900">{deadline.title}</p>
                  <p className="text-xs text-slate-500">{deadline.courseName}</p>
                  <p className="mt-2 text-xs font-medium text-rose-600">
                    Due {formatDate(deadline.dueDate)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Trophy className="h-5 w-5 text-amber-500" />
                Recent achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{achievement.title}</p>
                    <p className="text-xs text-slate-500">{achievement.description}</p>
                    <p className="text-xs text-slate-400">
                      Earned {formatDate(achievement.earnedAt)}
                    </p>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/student/achievements">View all achievements</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

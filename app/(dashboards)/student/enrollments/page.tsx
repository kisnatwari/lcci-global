"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Play,
  Eye,
  Calendar,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getUserEnrollments, type Enrollment } from "@/lib/api/enrollments";

export default function StudentEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      console.error("Failed to fetch enrollments:", err);
      setError(err.message || "Failed to load enrollments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const courseName = enrollment.course?.name || enrollment.course?.title || "";
    const categoryName = enrollment.course?.category?.name || "";
    const matchesSearch = courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
    const courseLevel = enrollment.course?.level || "";
    const matchesLevel = levelFilter === "all" || courseLevel === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Never";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700";
      case "in_progress":
        return "bg-sky-50 text-sky-700";
      case "enrolled":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in_progress": return "In Progress";
      case "enrolled": return "Not Started";
      default: return status;
    }
  };

  // Calculate progress percentage from enrollment data
  const getProgress = (enrollment: Enrollment): number => {
    if (enrollment.progress !== undefined) {
      return enrollment.progress;
    }
    // If no progress field, calculate based on completion status
    if (enrollment.status === "completed") return 100;
    if (enrollment.status === "in_progress") return 50;
    return 0;
  };

  // Get enrollment ID (handle both id and enrollmentId)
  const getEnrollmentId = (enrollment: Enrollment): string => {
    return enrollment.enrollmentId || enrollment.id;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
          <p className="text-slate-600">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading enrollments</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button onClick={fetchEnrollments} className="mt-4" variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <p className="text-sm font-semibold text-sky-600">My learning</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Track every enrollment with clarity
          </h1>
          <p className="mt-2 text-slate-500">
            Review progress, due dates, and certificates for each course in one organised place.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            <BookOpen className="h-4 w-4 text-sky-600" />
            {filteredEnrollments.length} {filteredEnrollments.length === 1 ? "course" : "courses"}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="enrolled">Not started</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEnrollments.map((enrollment) => {
          console.log(enrollment);
          const enrollmentId = getEnrollmentId(enrollment);
          const progress = getProgress(enrollment);
          const courseName = enrollment.course?.name || enrollment.course?.title || "Untitled Course";
          const categoryName = enrollment.course?.category?.name || "Uncategorized";
          const courseLevel = enrollment.course?.level || "";
          const status = enrollment.status || (enrollment.completedAt ? "completed" : "enrolled");

          return (
            <Card
              key={enrollmentId}
              className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm transition-colors hover:border-sky-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-lg font-semibold text-slate-900">
                      {courseName}
                    </CardTitle>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <Badge variant="outline" className="text-xs">
                        {categoryName}
                      </Badge>
                      {courseLevel && (
                        <Badge variant="secondary" className="capitalize">
                          {courseLevel}
                        </Badge>
                      )}
                      <Badge variant="secondary" className={getStatusColor(status)}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-sky-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-slate-900">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Enrolled</span>
                    <p className="font-medium text-slate-900">
                      {formatDate(enrollment.enrolledAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Last access</span>
                    <p className="font-medium text-slate-900">
                      {getTimeAgo(enrollment.lastAccessed || null)}
                    </p>
                  </div>
                </div>

                {/* Score & Certificate */}
                {status === "completed" && enrollment.score && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700">
                        Score: {enrollment.score}%
                      </span>
                    </div>
                    {enrollment.certificateUrl && (
                      <Button size="sm" variant="outline" className="text-xs" asChild>
                        <a href={enrollment.certificateUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-3 w-3 mr-1" />
                          Certificate
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/student/enrollments/${enrollmentId}`}>
                    {status === "completed" ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View Course
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    )}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEnrollments.length === 0 && (
        <Card className="border-slate-200 bg-white text-center shadow-sm">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No courses found</h3>
            <p className="mt-2 text-sm text-slate-500">
              {searchTerm || statusFilter !== "all" || levelFilter !== "all"
                ? "Try adjusting your search or filters."
                : "You haven't enrolled in any courses yet. Start your learning journey today."}
            </p>
            {!searchTerm && statusFilter === "all" && levelFilter === "all" && (
              <Button className="mt-5" variant="outline">
                Browse courses
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

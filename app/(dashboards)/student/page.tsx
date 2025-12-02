"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  Clock,
  Award,
  Play,
  CheckCircle,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserEnrollments, type Enrollment } from "@/lib/api/enrollments";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { mapApiCourseToWebsiteCourse } from "@/lib/courses";
import { Course } from "@/types/course";
import { EnrollmentDialog } from "@/components/website/EnrollmentDialog";
import { Input } from "@/components/ui/input";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnrollmentCourseId, setSelectedEnrollmentCourseId] = useState<string | null>(null);
  const [selectedEnrollmentCourseTitle, setSelectedEnrollmentCourseTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserEnrollments();
      console.log(data || []);
      setEnrollments(data || []);
    } catch (err: any) {
      console.error("Failed to fetch enrollments:", err);
      setError(err.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const response = await apiClient.get(ENDPOINTS.courses.get());
      
      // Handle different API response formats
      let apiCourses: any[] = [];
      if (response.success && response.data && Array.isArray(response.data.courses)) {
        apiCourses = response.data.courses;
      } else if (response.data && Array.isArray(response.data.courses)) {
        apiCourses = response.data.courses;
      } else if (Array.isArray(response.data)) {
        apiCourses = response.data;
      } else if (Array.isArray(response)) {
        apiCourses = response;
      }
      
      // Map API courses to website Course format
      const mappedCourses = apiCourses.map(mapApiCourseToWebsiteCourse);
      setCourses(mappedCourses);
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      setCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleEnrollmentSuccess = () => {
    // Refresh enrollments after successful enrollment
    fetchEnrollments();
    // Close enrollment dialog
    setSelectedEnrollmentCourseId(null);
    setSelectedEnrollmentCourseTitle(null);
  };

  // Calculate stats from real data
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.status === "completed" || e.completedAt).length;
  const inProgressCourses = enrollments.filter(e => e.status === "enrolled" && (e.progress === 0 || (e.progress > 0 && e.progress < 100))).length;
  // Certificates not available in current API response
  const certificates = 0;

  const getTimeAgo = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getEnrollmentId = (enrollment: Enrollment) => {
    return enrollment.enrollmentId;
  };

  const getCourseName = (enrollment: Enrollment) => {
    return enrollment.course?.name || "Untitled Course";
  };

  const getCourseCategory = (enrollment: Enrollment) => {
    // Category not available in API response
    return "Course";
  };

  const getCourseLevel = (enrollment: Enrollment) => {
    // Level not available in API response
    return "All Levels";
  };

  const inProgressEnrollments = enrollments.filter(
    (e) => e.status === "enrolled" && (e.progress === 0 || (e.progress > 0 && e.progress < 100))
  );

  // Get enrolled course IDs
  const enrolledCourseIds = new Set(
    enrollments.map(e => e.course?.courseId).filter(Boolean)
  );

  // Filter courses: exclude already enrolled ones and apply search
  const availableCourses = courses.filter(course => {
    const isNotEnrolled = !enrolledCourseIds.has(course.id);
    const matchesSearch = searchTerm === "" || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotEnrolled && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-red-900">Error loading dashboard</h3>
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
      {/* Hero Section - Welcome Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-100 mb-2">Welcome back</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Ready for your next learning milestone?
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Track your progress and continue learning from where you left off.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-medium">
              <span role="img" aria-hidden="true">🎯</span>
              {totalCourses} {totalCourses === 1 ? 'course' : 'courses'} enrolled
            </div>
            {/* Certificates not available in current API response */}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </section>

      {/* Key Metrics */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Courses</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {totalCourses}
              </p>
              {inProgressCourses > 0 && (
                <p className="mt-1 text-xs text-blue-600">{inProgressCourses} in progress</p>
              )}
            </div>
            <div className="rounded-2xl bg-[color:var(--brand-blue)] p-4 text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-emerald-700">Completed</p>
              <p className="mt-2 text-3xl font-bold text-emerald-900">
                {completedCourses}
              </p>
              {totalCourses > 0 && (
                <p className="mt-1 text-xs text-emerald-600">
                  {Math.round((completedCourses / totalCourses) * 100)}% completion rate
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-emerald-500 p-4 text-white shadow-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-blue-700">Certificates</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {certificates}
              </p>
              <p className="mt-1 text-xs text-blue-600">Earned</p>
            </div>
            <div className="rounded-2xl bg-[color:var(--brand-blue)] p-4 text-white shadow-lg">
              <Award className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Average Score card hidden - score data not available in API response */}
      </section>

      {/* Continue Learning Section */}
      <section>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-t-lg border-b">
            <CardTitle className="flex items-center gap-2 text-slate-900 text-xl">
              <Target className="h-5 w-5 text-[color:var(--brand-blue)]" />
              Continue Learning
            </CardTitle>
            <CardDescription className="text-slate-600">
              Pick up right where you left off across active enrollments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {inProgressEnrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No active courses</p>
                <p className="text-sm text-slate-500 mb-6">Start learning by enrolling in a course</p>
                <Button asChild className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <>
                {inProgressEnrollments.slice(0, 3).map((enrollment) => {
                  const enrollmentId = getEnrollmentId(enrollment);
                  const progress = enrollment.progress || 0;
                  
                  return (
                    <div
                      key={enrollmentId}
                      className="rounded-xl border border-slate-200 bg-white p-5 hover:border-[color:var(--brand-blue)]/50 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {getCourseName(enrollment)}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <span>{getCourseCategory(enrollment)}</span>
                            <span className="text-slate-300">•</span>
                            <span>Enrolled {getTimeAgo(enrollment.enrolledAt)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize w-fit">
                          {getCourseLevel(enrollment)}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>Progress</span>
                          <span className="font-medium text-slate-900">
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                      <div className="mt-4">
                        <Button asChild variant="outline" className="text-sm">
                          <Link href={`/student/enrollments/${enrollmentId}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Continue course
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {enrollments.length > 3 && (
                  <Button asChild variant="ghost" className="w-full text-slate-600 hover:text-slate-900">
                    <Link href="/student/enrollments">View all enrollments</Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Browse Courses Section */}
      <section>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-t-lg border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-xl">
                  <Plus className="h-5 w-5 text-[color:var(--brand-blue)]" />
                  Browse Courses
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Discover new courses and expand your learning journey.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[color:var(--brand-blue)]" />
              </div>
            ) : availableCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">
                  {searchTerm ? "No courses found matching your search" : "No new courses available"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.slice(0, 6).map((course) => (
                  <Card key={course.id} className="border-slate-200 hover:border-[color:var(--brand-blue)]/50 hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Badge variant="outline" className="capitalize">
                          {course.level}
                        </Badge>
                        <span className="text-slate-300">•</span>
                        <span>{course.category}</span>
                        <span className="text-slate-300">•</span>
                        <span>{course.duration}</span>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedEnrollmentCourseId(course.id);
                          setSelectedEnrollmentCourseTitle(course.title);
                        }}
                        className="w-full bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Enroll Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {availableCourses.length > 6 && (
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link href="/courses">View All Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Enrollment Dialog */}
      {selectedEnrollmentCourseId && (
        <EnrollmentDialog
          courseId={selectedEnrollmentCourseId}
          courseTitle={selectedEnrollmentCourseTitle || undefined}
          isOpen={!!selectedEnrollmentCourseId}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedEnrollmentCourseId(null);
              setSelectedEnrollmentCourseTitle(null);
            }
          }}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
    </div>
  );
}

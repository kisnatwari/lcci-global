"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Loader2, AlertCircle, Pencil, CalendarDays, DollarSign, Layers, User, Clock, TrendingUp, Award, Star, FileText, CheckCircle2, Tag, HelpCircle, Video } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type CourseDetail = {
  courseId: string;
  name: string;
  description: string;
  overview?: string | null;
  curriculum?: string | null;
  requirements?: string | null;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number;
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
    } | null;
  };
};

export default function CourseViewPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.courses.getById(courseId));
      const data = response.data || response;
      setCourse(data);
    } catch (err: any) {
      console.error("Failed to fetch course:", err);
      setError(err.message || "Failed to load course details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCreatorName = (creator: CourseDetail["creator"]) => {
    if (!creator?.profile) {
      return "Unknown";
    }
    const firstName = creator.profile.firstName || "";
    const lastName = creator.profile.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "Unknown";
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case "beginner":
        return {
          icon: TrendingUp,
          bgColor: "bg-emerald-500",
          textColor: "text-emerald-700",
          badgeColor: "bg-emerald-100",
          borderColor: "border-emerald-200",
        };
      case "intermediate":
        return {
          icon: Award,
          bgColor: "bg-amber-500",
          textColor: "text-amber-700",
          badgeColor: "bg-amber-100",
          borderColor: "border-amber-200",
        };
      case "advanced":
        return {
          icon: Star,
          bgColor: "bg-red-500",
          textColor: "text-red-700",
          badgeColor: "bg-red-100",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: TrendingUp,
          bgColor: "bg-slate-500",
          textColor: "text-slate-700",
          badgeColor: "bg-slate-100",
          borderColor: "border-slate-200",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[color:var(--brand-blue)] mx-auto mb-4" />
          <p className="text-slate-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/courses")}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <Card className="border-2 border-red-200 bg-white">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Course</h2>
              <p className="text-slate-600">{error || "Course not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const levelConfig = getLevelConfig(course.level);
  const LevelIcon = levelConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/courses")}
            className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${levelConfig.badgeColor} ${levelConfig.textColor} border ${levelConfig.borderColor}`}>
                  <LevelIcon className="w-3 h-3" />
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <Tag className="w-3 h-3" />
                  {course.category?.name || "Uncategorized"}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
                {course.name}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {course.description || "Course details and information"}
              </p>
            </div>
            <Button
              onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
              className="h-11 px-6 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white font-semibold shadow-sm hover:shadow-md transition-all shrink-0"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Thumbnail */}
            {course.thumbnailUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src={course.thumbnailUrl}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                    <Layers className="w-5 h-5 text-[color:var(--brand-blue)]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Category</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {course.category?.name || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${levelConfig.bgColor} bg-opacity-10`}>
                    <LevelIcon className={`w-5 h-5 ${levelConfig.textColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Level</p>
                    <p className={`text-sm font-bold ${levelConfig.textColor} capitalize mt-0.5`}>
                      {course.level}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                    <CalendarDays className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Duration</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {course.duration ? `${course.duration} days` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Price</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {typeof Number(course.price) === "number" ? `NPR ${Number(course.price).toLocaleString()}` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview */}
            {course.overview && (
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                      <FileText className="w-5 h-5 text-[color:var(--brand-blue)]" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Overview</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {course.overview}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            {course.curriculum && (
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                      <BookOpen className="w-5 h-5 text-[color:var(--brand-blue)]" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Curriculum</h2>
                  </div>
                  <div className="pl-13 prose prose-slate max-w-none">
                    <div 
                      className="text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: course.curriculum }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {course.requirements && (
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                      <CheckCircle2 className="w-5 h-5 text-[color:var(--brand-blue)]" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Requirements</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {course.requirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push(`/admin/courses/${courseId}/materials`)}
                      className="w-full justify-start h-auto py-3 px-4 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white"
                    >
                      <Video className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Materials</div>
                        <div className="text-xs opacity-90">Videos, PDFs, documents, and links</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => router.push(`/admin/courses/${courseId}/quizzes`)}
                      className="w-full justify-start h-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900"
                    >
                      <HelpCircle className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Quizzes</div>
                        <div className="text-xs opacity-70">Create and manage assessments</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Course Details</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          Creator
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 ml-6">
                        {getCreatorName(course.creator)}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          Created
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 ml-6">
                        {formatDate(course.createdAt)}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          Last Updated
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 ml-6">
                        {formatDate(course.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  FileText,
  Video,
  Link as LinkIcon,
  Award,
  Calendar,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { getEnrollmentById, type Enrollment, markMaterialComplete } from "@/lib/api/enrollments";
import { getCourseMaterials, type CourseMaterial } from "@/lib/api/materials";

export default function EnrollmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());
  const [isMarkingComplete, setIsMarkingComplete] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    if (enrollmentId) {
      fetchEnrollment();
    }
  }, [enrollmentId]);

  // Clear warning message after 5 seconds
  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => {
        setWarningMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage]);

  const fetchEnrollment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEnrollmentById(enrollmentId);
      if (data) {
        setEnrollment(data);
        // Fetch materials for the course
        const courseId = data.courseId || data.course?.courseId || data.course?.id;
        if (courseId && typeof courseId === 'string') {
          await fetchMaterials(courseId);
        }
      } else {
        setError("Enrollment not found");
      }
    } catch (err: any) {
      console.error("Failed to fetch enrollment:", err);
      setError(err.message || "Failed to load enrollment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterials = async (courseId: string) => {
    try {
      const data = await getCourseMaterials(courseId);
      setMaterials(data);
      // TODO: Fetch completion status from enrollment API if available
    } catch (err: any) {
      console.error("Failed to fetch materials:", err);
    }
  };

  const handleMarkMaterialComplete = async (materialId: string) => {
    setIsMarkingComplete(`material-${materialId}`);
    setWarningMessage(null);
    setError(null);
    try {
      await markMaterialComplete(enrollmentId, { materialId });
      setCompletedMaterials(prev => new Set(prev).add(materialId));
      // Refresh enrollment to update progress
      await fetchEnrollment();
    } catch (err: any) {
      // Handle 409 Conflict - material already completed
      if (err.status === 409) {
        // Material is already completed, show warning message
        setCompletedMaterials(prev => new Set(prev).add(materialId));
        // Refresh enrollment to ensure UI is in sync
        await fetchEnrollment();
        // Show warning message
        const message = err.message || "You have already completed this material.";
        setWarningMessage(message);
        // Clear warning after 5 seconds
        setTimeout(() => setWarningMessage(null), 5000);
        return;
      }
      // For other errors, show error message
      console.error("Failed to mark material as complete:", err);
      setError(err.message || "Failed to mark material as complete");
    } finally {
      setIsMarkingComplete(null);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
          <p className="text-slate-600">Loading enrollment details...</p>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading enrollment</h3>
              <p className="text-sm text-red-700 mt-1">{error || "Enrollment not found"}</p>
              <Button onClick={fetchEnrollment} className="mt-4" variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract enrollment data with fallbacks
  const enrollmentData = {
    enrollmentId: enrollment.enrollmentId || enrollment.id,
    course: {
      courseId: enrollment.course?.courseId || enrollment.course?.id || enrollment.courseId,
      name: enrollment.course?.name || enrollment.course?.title || "Untitled Course",
      description: enrollment.course?.description || "No description available.",
      level: enrollment.course?.level || "beginner",
      price: enrollment.course?.price || 0,
      duration: enrollment.course?.duration || 0,
      category: { 
        name: enrollment.course?.category?.name || "Uncategorized",
      },
    },
    progress: enrollment.progress || (enrollment.completedAt ? 100 : 0),
    status: enrollment.status || (enrollment.completedAt ? "completed" : "enrolled"),
    enrolledAt: enrollment.enrolledAt,
    lastAccessed: enrollment.lastAccessed || null,
    completedAt: enrollment.completedAt,
    score: enrollment.score || null,
    certificateUrl: enrollment.certificateUrl || null,
    // Calculate from fetched materials
    totalLessons: materials.length,
    completedLessons: materials.filter(m => completedMaterials.has(m.materialId)).length,
    totalQuizzes: 0,
    completedQuizzes: 0,
  };

  // Map materials to display format
  const courseMaterials = materials
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    .map((material) => ({
      materialId: material.materialId,
      title: material.title,
      type: material.type,
      url: material.url || material.fileUrl || "", // API returns 'url', fallback to 'fileUrl' for compatibility
      orderIndex: material.orderIndex || 0,
      completed: completedMaterials.has(material.materialId),
      duration: material.type === "video" ? null : null, // Duration would come from API if available
    }));




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
                <div className="flex flex-col items-end gap-3">
                  <Button
                    onClick={() => router.push(`/student/enrollments/${enrollmentId}/quiz`)}
                    className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {enrollmentData.progress}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Complete</div>
                  </div>
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

      {/* Course Materials Section */}
      <div className="space-y-4">
          {warningMessage && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{warningMessage}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>
                Access all course materials and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseMaterials.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                  <p>No materials available for this course yet.</p>
                </div>
              ) : (
                courseMaterials.map((material, index) => {
                  const isMarking = isMarkingComplete === `material-${material.materialId}`;
                  return (
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
                      <div className="flex items-center gap-2">
                        {material.url ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (material.url) {
                                window.open(material.url, '_blank', 'noopener,noreferrer');
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            No URL
                          </Button>
                        )}
                        {!material.completed && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleMarkMaterialComplete(material.materialId)}
                            disabled={isMarking}
                          >
                            {isMarking ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Marking...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </>
                            )}
                          </Button>
                        )}
                        {material.completed && (
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

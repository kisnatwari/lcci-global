"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, FolderTree, Users, Briefcase, Target, TrendingUp, Award, Star, GraduationCap, School, Upload, X } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";

type Category = {
  categoryId: string;
  name: string;
  description: string;
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    overview: "",
    curriculum: "",
    requirements: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    type: "Guided" as "Guided" | "SelfPaced",
    price: "",
    duration: "",
    thumbnailUrl: "",
    autoEnrollFor: [] as string[],
    lcciGQCreditPoints: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchCourse();
  }, [courseId]);

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

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(ENDPOINTS.courses.getById(courseId));
      const course = response.data || response;
      
      setFormData({
        name: course.name || "",
        categoryId: course.category?.categoryId || "",
        description: course.description || "",
        overview: course.overview || "",
        curriculum: course.curriculum || "",
        requirements: course.requirements || "",
        level: course.level || "beginner",
        type: course.type === "SelfPaced" ? "SelfPaced" : (course.type === "Guided" ? "Guided" : "Guided"),
        price: course.price?.toString() || "",
        duration: course.duration?.toString() || "",
        thumbnailUrl: course.thumbnailUrl || "",
        autoEnrollFor: Array.isArray(course.autoEnrollFor) ? course.autoEnrollFor : [],
        lcciGQCreditPoints: course.lcciGQCreditPoints?.toString() || "",
      });
    } catch (err: any) {
      console.error("Failed to fetch course:", err);
      setError(err.message || "Failed to load course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingThumbnail(true);
    setError(null);

    try {
      const response = await apiClient.upload(ENDPOINTS.upload.file(), file);
      
      // Assuming the response has a url or fileUrl field
      const uploadedUrl = response.data?.url || response.data?.fileUrl || response.url || response.fileUrl;
      
      if (uploadedUrl) {
        setFormData({ ...formData, thumbnailUrl: uploadedUrl });
        setSuccessMessage("Thumbnail uploaded successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Upload response did not contain a URL");
      }
    } catch (err: any) {
      console.error("Failed to upload thumbnail:", err);
      setError(err.message || "Failed to upload thumbnail. Please try again.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

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
        categoryId: formData.categoryId,
        description: (formData.description && formData.description.trim()) || undefined,
        overview: (formData.overview && formData.overview.trim()) || undefined,
        curriculum: (formData.curriculum && formData.curriculum.trim()) || undefined,
        requirements: (formData.requirements && formData.requirements.trim()) || undefined,
        level: formData.level,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        duration: parseInt(formData.duration) || 0,
        thumbnailUrl: formData.thumbnailUrl,
        autoEnrollFor: formData.autoEnrollFor.length > 0 ? formData.autoEnrollFor : undefined,
        // Only include lcciGQCreditPoints for SelfPaced courses
        ...(formData.type === "SelfPaced" && { lcciGQCreditPoints: parseInt(formData.lcciGQCreditPoints) || 0 }),
      };

      const response = await apiClient.put(ENDPOINTS.courses.update(courseId), payload);
      console.log("Update response:", response);
      setSuccessMessage("Course updated successfully!");
      
      // Redirect to courses list after a short delay
      setTimeout(() => {
        router.push("/admin/courses");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update course:", err);
      const errorMessage = err.message || 
                          (err.response?.data?.message) ||
                          "Failed to update course";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/courses")}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[color:var(--brand-blue)]/10">
              <BookOpen className="w-7 h-7 text-[color:var(--brand-blue)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Course</h1>
              <p className="text-slate-600 mt-1">Update the course information below</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50/80 border-2 border-red-200/60 text-red-700 text-sm shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-50/80 border-2 border-emerald-200/60 text-emerald-700 text-sm shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-900">Success</p>
              <p className="text-emerald-700 mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Form - Same as new page */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-200">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--brand-blue)]"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Basic Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Course name, category, and description</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      Course Name <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setError(null);
                      }}
                      placeholder="e.g., Executive Communication Lab"
                      disabled={isSaving}
                      className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                    />
                  </div>

                  {/* Category Selection - Full Row */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      Category <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.length > 0 ? (
                        categories.map((category) => {
                          const isSelected = formData.categoryId === category.categoryId;
                          const categoryIcons: Record<string, any> = {
                            "Communication & Presence": Users,
                            "Leadership & Coaching": Briefcase,
                            "Customer Experience": Target,
                          };
                          const Icon = categoryIcons[category.name] || FolderTree;
                          
                          return (
                            <button
                              key={category.categoryId}
                              type="button"
                              onClick={() => {
                                if (!isSaving) {
                                  setFormData({ ...formData, categoryId: category.categoryId });
                                  setError(null);
                                }
                              }}
                              disabled={isSaving}
                              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                                isSelected
                                  ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/5 shadow-md"
                                  : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm"
                              } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[color:var(--brand-blue)] flex items-center justify-center">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div className="flex items-start gap-3">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                                  isSelected
                                    ? "bg-[color:var(--brand-blue)]/20 text-[color:var(--brand-blue)]"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                } transition-colors`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-semibold text-sm mb-0.5 ${
                                    isSelected ? "text-[color:var(--brand-blue)]" : "text-slate-900"
                                  }`}>
                                    {category.name}
                                  </h4>
                                  {category.description && (
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-3 p-4 rounded-xl border-2 border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
                          No categories available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level Selection - Full Row */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      Level <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: "beginner", label: "Beginner", icon: TrendingUp, color: "emerald" },
                        { value: "intermediate", label: "Intermediate", icon: Award, color: "amber" },
                        { value: "advanced", label: "Advanced", icon: Star, color: "red" },
                      ].map((level) => {
                        const isSelected = formData.level === level.value;
                        const Icon = level.icon;
                        
                        let borderBgClasses = "";
                        let iconBgClasses = "";
                        let textClasses = "";
                        let checkBgClasses = "";
                        
                        if (level.color === "emerald") {
                          borderBgClasses = isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-300";
                          iconBgClasses = isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600";
                          textClasses = isSelected ? "text-emerald-700" : "text-slate-900";
                          checkBgClasses = "bg-emerald-500";
                        } else if (level.color === "amber") {
                          borderBgClasses = isSelected ? "border-amber-500 bg-amber-50" : "border-slate-300 hover:border-amber-300";
                          iconBgClasses = isSelected ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-600";
                          textClasses = isSelected ? "text-amber-700" : "text-slate-900";
                          checkBgClasses = "bg-amber-500";
                        } else if (level.color === "red") {
                          borderBgClasses = isSelected ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-red-300";
                          iconBgClasses = isSelected ? "bg-red-500 text-white" : "bg-red-100 text-red-600";
                          textClasses = isSelected ? "text-red-700" : "text-slate-900";
                          checkBgClasses = "bg-red-500";
                        }
                        
                        return (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => {
                              if (!isSaving) {
                                setFormData({ ...formData, level: level.value as "beginner" | "intermediate" | "advanced" });
                              }
                            }}
                            disabled={isSaving}
                            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${borderBgClasses} ${
                              isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"
                            }`}
                          >
                            {isSelected && (
                              <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${checkBgClasses} flex items-center justify-center`}>
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-colors ${iconBgClasses}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`font-semibold text-sm ${textClasses}`}>
                                {level.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Type Selection - Full Row */}
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      Course Type <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: "Guided", label: "Guided", icon: Users, color: "emerald" },
                        { value: "SelfPaced", label: "Self-Paced", icon: BookOpen, color: "blue" },
                      ].map((type) => {
                        const isSelected = formData.type === type.value;
                        const Icon = type.icon;
                        
                        let borderBgClasses = "";
                        let iconBgClasses = "";
                        let textClasses = "";
                        let checkBgClasses = "";
                        
                        if (type.color === "emerald") {
                          borderBgClasses = isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-300";
                          iconBgClasses = isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600";
                          textClasses = isSelected ? "text-emerald-700" : "text-slate-900";
                          checkBgClasses = "bg-emerald-500";
                        } else if (type.color === "blue") {
                          borderBgClasses = isSelected ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-300";
                          iconBgClasses = isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600";
                          textClasses = isSelected ? "text-blue-700" : "text-slate-900";
                          checkBgClasses = "bg-blue-500";
                        }
                        
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              if (!isSaving) {
                                const newType = type.value as "Guided" | "SelfPaced";
                                // Clear auto-enroll and LCCI GQ Credit Points if switching to Guided
                                setFormData({ 
                                  ...formData, 
                                  type: newType,
                                  autoEnrollFor: newType === "Guided" ? [] : formData.autoEnrollFor,
                                  lcciGQCreditPoints: newType === "Guided" ? "" : formData.lcciGQCreditPoints
                                });
                              }
                            }}
                            disabled={isSaving}
                            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${borderBgClasses} ${
                              isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"
                            }`}
                          >
                            {isSelected && (
                              <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${checkBgClasses} flex items-center justify-center`}>
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-colors ${iconBgClasses}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`font-semibold text-sm ${textClasses}`}>
                                {type.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-800">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the course..."
                      rows={3}
                      disabled={isSaving}
                      className="resize-none border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                    />
                    <p className="text-xs text-slate-500 font-medium">A short summary of what the course covers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Duration - Same structure as new page */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-200">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--brand-blue)]"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pricing & Duration</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Set course price and duration</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="price" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      Price (NPR) <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-semibold z-10">NPR</span>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.price}
                        onChange={(e) => {
                          setFormData({ ...formData, price: e.target.value });
                          setError(null);
                        }}
                        placeholder="0"
                        disabled={isSaving}
                        className="h-12 pl-16 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="duration" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      Duration (days) <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => {
                        setFormData({ ...formData, duration: e.target.value });
                        setError(null);
                      }}
                      placeholder="e.g., 30"
                      disabled={isSaving}
                      className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                    />
                    <p className="text-xs text-slate-500 font-medium">Total course duration in days</p>
                  </div>

                  {formData.type === "SelfPaced" && (
                    <div className="space-y-2.5">
                      <Label htmlFor="lcciGQCreditPoints" className="text-sm font-semibold text-slate-800">
                        LCCI GQ Credit Points
                      </Label>
                      <Input
                        id="lcciGQCreditPoints"
                        type="number"
                        min="0"
                        value={formData.lcciGQCreditPoints}
                        onChange={(e) => {
                          setFormData({ ...formData, lcciGQCreditPoints: e.target.value });
                          setError(null);
                        }}
                        placeholder="0"
                        disabled={isSaving}
                        className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                      />
                      <p className="text-xs text-slate-500 font-medium">Credit points for this course (Self-Paced only)</p>
                    </div>
                  )}
                </div>

                {/* Auto Enroll For */}
                <div className="space-y-2.5 mt-6">
                  <Label className="text-sm font-semibold text-slate-800">
                    Auto Enroll For
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoEnrollSQA"
                        checked={formData.autoEnrollFor.includes("SQA")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              autoEnrollFor: [...formData.autoEnrollFor, "SQA"],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              autoEnrollFor: formData.autoEnrollFor.filter((item) => item !== "SQA"),
                            });
                          }
                        }}
                        disabled={isSaving}
                      />
                      <Label
                        htmlFor="autoEnrollSQA"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                      >
                        <School className="w-4 h-4 text-slate-600" />
                        SQA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoEnrollCambridge"
                        checked={formData.autoEnrollFor.includes("Cambridge")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              autoEnrollFor: [...formData.autoEnrollFor, "Cambridge"],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              autoEnrollFor: formData.autoEnrollFor.filter((item) => item !== "Cambridge"),
                            });
                          }
                        }}
                        disabled={isSaving}
                      />
                      <Label
                        htmlFor="autoEnrollCambridge"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 text-slate-600" />
                        Cambridge
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Automatically enroll students from these programs</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-200">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                    <div className="w-2 h-2 rounded-full bg-[color:var(--brand-blue)]"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Detailed Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Overview, curriculum, and requirements</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="overview" className="text-sm font-semibold text-slate-800">
                      Overview
                    </Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="Provide a comprehensive overview of the course, including learning objectives and key topics..."
                      rows={10}
                      disabled={isSaving}
                      className="resize-none border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                    />
                    <p className="text-xs text-slate-500 font-medium">Detailed course overview and learning objectives</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="curriculum" className="text-sm font-semibold text-slate-800">
                      Curriculum
                    </Label>
                    <RichTextEditor
                      content={formData.curriculum}
                      onChange={(content) => setFormData({ ...formData, curriculum: content })}
                      placeholder="Outline the course curriculum, modules, and topics covered. You can add tables, images, links, and format text..."
                      disabled={isSaving}
                    />
                    <p className="text-xs text-slate-500 font-medium">Course structure, modules, and topics. Supports rich text, tables, images, and links.</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="requirements" className="text-sm font-semibold text-slate-800">
                      Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="List any prerequisites, required skills, or materials needed..."
                      rows={10}
                      disabled={isSaving}
                      className="resize-none border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
                    />
                    <p className="text-xs text-slate-500 font-medium">Prerequisites and required materials</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Thumbnail Upload - Same as new page */}
          <div className="xl:col-span-1">
            <Card className="border-2 border-slate-200 shadow-lg xl:sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-200">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10">
                    <ImageIcon className="w-5 h-5 text-[color:var(--brand-blue)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Thumbnail</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Course thumbnail image</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.thumbnailUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-100">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, thumbnailUrl: "" })}
                        disabled={isSaving || isUploadingThumbnail}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        title="Remove thumbnail"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 font-medium mb-1">No thumbnail uploaded</p>
                      <p className="text-xs text-slate-500">Upload a course thumbnail image</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-upload" className="text-sm font-semibold text-slate-800">
                      Upload Thumbnail
                    </Label>
                    <div className="relative">
                      <input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={isSaving || isUploadingThumbnail}
                        className="hidden"
                      />
                      <Label
                        htmlFor="thumbnail-upload"
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer ${
                          isSaving || isUploadingThumbnail ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUploadingThumbnail ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[color:var(--brand-blue)]" />
                            <span className="text-sm font-medium text-slate-700">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[color:var(--brand-blue)]" />
                            <span className="text-sm font-medium text-slate-700">Choose Image</span>
                          </>
                        )}
                      </Label>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">JPG, PNG or GIF. Max 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-4 pb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/courses")}
            disabled={isSaving}
            className="h-12 px-8 border-2 border-slate-300 font-semibold hover:bg-slate-100 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isSaving ||
              !formData.name.trim() ||
              !formData.categoryId ||
              !formData.price ||
              !formData.duration ||
              !formData.type
            }
            className="min-w-[160px] h-12 px-8 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


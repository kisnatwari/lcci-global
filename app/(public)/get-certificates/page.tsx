"use client";

import { useState } from "react";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Award, Loader2, Search, Check, ChevronDown } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { cn } from "@/lib/utils";

type Course = {
  courseId: string;
  name: string;
  description?: string;
  [key: string]: any;
};

export default function GetCertificatesPage() {
  const [formData, setFormData] = useState({
    name: "",
    courseName: "",
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [isCoursePopoverOpen, setIsCoursePopoverOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch courses when popover opens (lazy loading)
  const fetchCourses = async (search: string = "") => {
    if (courses.length > 0 && !search) return; // Don't refetch if already loaded and no search
    
    setIsLoadingCourses(true);
    try {
      const response = await apiClient.get(ENDPOINTS.courses.get());
      let fetchedCourses: any[] = [];
      
      if (response.success && response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (response.data && Array.isArray(response.data.courses)) {
        fetchedCourses = response.data.courses;
      } else if (Array.isArray(response)) {
        fetchedCourses = response;
      }

      const formattedCourses: Course[] = fetchedCourses.map((course: any) => ({
        courseId: course.courseId,
        name: course.name || "Unknown Course",
        description: course.description,
      }));

      setCourses(formattedCourses);
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Filter courses by search query
  const filteredCourses = courses.filter((course) => {
    if (!courseSearchQuery) return true;
    const query = courseSearchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(query) ||
      (course.description && course.description.toLowerCase().includes(query))
    );
  });

  // Get selected course display name
  const selectedCourse = courses.find((c) => c.name === formData.courseName);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.name || !formData.courseName) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post(ENDPOINTS.certificates.validate(), {
        studentName: formData.name.trim(),
        courseName: formData.courseName.trim(),
      });

      // Handle response based on API structure
      let validationResult: {
        status: string;
        message: string;
        certificateUrl?: string;
      };

      if (response.success && response.data) {
        validationResult = response.data;
      } else if (response.status || response.message) {
        validationResult = response as { status: string; message: string; certificateUrl?: string };
      } else {
        throw new Error("Invalid response format from server");
      }

      // Check if certificate URL is provided
      if (validationResult.certificateUrl) {
        // Open certificate URL in new tab
        window.open(validationResult.certificateUrl, "_blank");
        setSuccessMessage(validationResult.message || "Certificate found! Opening in a new tab...");
      } else if (validationResult.status === "success" || validationResult.status === "valid") {
        // Certificate validated but no URL provided
        setSuccessMessage(validationResult.message || "Certificate validated successfully!");
      } else {
        // Certificate not found or invalid
        setError(validationResult.message || "Certificate not found. Please verify your information.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Certificate not found or failed to load. Please check your information and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <main className="flex-1">
        <PageHeader
          badge={{ icon: "🏆", text: "View Certificate" }}
          title="View Your"
          titleHighlight="Certificate"
          description="Enter your full name and course to view and download your certificate."
        />

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            {/* Form */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                    required
                  />
                </div>

                {/* Course Selection */}
                <div>
                  <label htmlFor="courseName" className="block text-sm font-bold text-slate-900 mb-2">
                    Course Name *
                  </label>
                  <Popover 
                    open={isCoursePopoverOpen} 
                    onOpenChange={(open) => {
                      setIsCoursePopoverOpen(open);
                      if (open) {
                        fetchCourses();
                      } else {
                        setCourseSearchQuery("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        role="combobox"
                        id="courseName"
                        className={cn(
                          "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm transition-all hover:border-slate-300 focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] outline-none text-left flex items-center justify-between",
                          !selectedCourse && "text-slate-500"
                        )}
                      >
                        <span className="truncate">
                          {selectedCourse ? selectedCourse.name : "Select course..."}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
                        <Input
                          placeholder="Search courses..."
                          value={courseSearchQuery}
                          onChange={(e) => setCourseSearchQuery(e.target.value)}
                          className="border-0 focus-visible:ring-0 h-8"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[300px] overflow-auto p-1">
                        {isLoadingCourses ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            <span className="ml-2 text-sm text-slate-600">Loading courses...</span>
                          </div>
                        ) : filteredCourses.length === 0 ? (
                          <div className="py-6 text-center text-sm text-slate-600">
                            {courseSearchQuery ? "No courses found." : "No courses available."}
                          </div>
                        ) : (
                          <>
                            <div
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs text-slate-500 outline-none hover:bg-slate-100 transition-colors"
                              onClick={() => {
                                handleChange("courseName", "");
                                setIsCoursePopoverOpen(false);
                                setCourseSearchQuery("");
                              }}
                            >
                              Clear selection
                            </div>
                            <div className="h-px bg-slate-200 my-1" />
                            {filteredCourses.map((course) => (
                              <div
                                key={course.courseId}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 transition-colors",
                                  formData.courseName === course.name && "bg-blue-50 font-medium"
                                )}
                                onClick={() => {
                                  handleChange("courseName", course.name);
                                  setIsCoursePopoverOpen(false);
                                  setCourseSearchQuery("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    formData.courseName === course.name ? "opacity-100 text-[color:var(--brand-blue)]" : "opacity-0"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-medium">{course.name}</div>
                                  {course.description && (
                                    <div className="truncate text-xs text-slate-500">{course.description}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {successMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full px-6 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>View Certificate</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Note */}
            <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-slate-700">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                Enter your full name and select your course. All certificates matching your name and course will be displayed for download.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


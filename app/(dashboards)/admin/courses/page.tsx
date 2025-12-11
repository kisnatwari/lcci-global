import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { CoursesPageClient } from "./courses-client";

type Course = {
  courseId: string;
  name: string;
  description: string;
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
    };
  };
  materials?: any[];
  quizzes?: any[];
};

export default async function CoursesPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Fetch courses on server
  let courses: Course[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.courses.get());
    if (response.success && response.data && Array.isArray(response.data.courses)) {
      courses = response.data.courses;
    } else if (response.data && Array.isArray(response.data.courses)) {
      courses = response.data.courses;
    } else if (Array.isArray(response)) {
      courses = response;
    } else {
      courses = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch courses:", err);
    error = err.message || "Failed to load courses";
  }

  return <CoursesPageClient initialCourses={courses} error={error} />;
}

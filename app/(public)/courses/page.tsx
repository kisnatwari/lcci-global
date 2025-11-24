import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import CoursesContent from "@/components/website/CoursesContent";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { Course } from "@/types/course";
import { mapApiCourseToWebsiteCourse } from "@/lib/courses";

interface CoursesPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const type = params.type as "guided" | "self-paced" | undefined;
  
  let allCourses: Course[] = [];
  
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.courses.get());
    
    // Handle different API response formats
    let apiCourses: any[] = [];
    if (response.success && response.data && Array.isArray(response.data.courses)) {
      apiCourses = response.data.courses;
    } else if (response.data && Array.isArray(response.data.courses)) {
      apiCourses = response.data.courses;
    } else if (Array.isArray(response)) {
      apiCourses = response;
    }
    
    // Map API courses to website Course format
    allCourses = apiCourses.map(mapApiCourseToWebsiteCourse);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    // Fallback to empty array on error
    allCourses = [];
  }
  
  // Filter by type if specified
  const courses = type 
    ? allCourses.filter(course => course.type === type)
    : allCourses;

  const guidedCount = allCourses.filter(c => c.type === "guided").length;
  const selfPacedCount = allCourses.filter(c => c.type === "self-paced").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <PageHeader
          badge={{ icon: "📚", text: "Explore Our Programs" }}
          title="All"
          titleHighlight="Courses"
          description="Explore our full range of LCCI programmes, from guided cohorts to flexible self-paced options."
        />

        <CoursesContent
          courses={courses}
          activeType={type || null}
        />
      </main>
      
      <Footer />
    </div>
  );
}

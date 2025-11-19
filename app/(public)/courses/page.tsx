import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import CoursesContent from "@/components/website/CoursesContent";
import { getAllCourses, getCoursesByType } from "@/lib/courses";

interface CoursesPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const type = params.type as "guided" | "self-paced" | undefined;
  
  const allCourses = getAllCourses();
  const courses = type 
    ? getCoursesByType(type) 
    : allCourses;

  const guidedCount = getCoursesByType("guided").length;
  const selfPacedCount = getCoursesByType("self-paced").length;

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

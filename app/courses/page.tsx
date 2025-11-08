import Link from "next/link";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import CourseCard from "@/components/website/CourseCard";
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
          description="Explore our comprehensive range of LCCI qualifications designed to advance your career"
          rightContent={
            <div className="space-y-4">
              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#4A9FD8] hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4A9FD8]/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Guided</h3>
                    <p className="text-xs text-gray-600 font-semibold">Instructor-Led</p>
                  </div>
                </div>
              </div>

              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-green-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group ml-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    📚
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Self-Paced</h3>
                    <p className="text-xs text-gray-600 font-semibold">Learn Anytime</p>
                  </div>
                </div>
              </div>

              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-purple-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    ⭐
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Featured</h3>
                    <p className="text-xs text-gray-600 font-semibold">Top Programs</p>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <div className="container mx-auto px-4 lg:px-8 py-16">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 mb-10 border-b-2 border-gray-200 pb-6">
            <Link
              href="/courses"
              className={`px-8 py-4 font-bold rounded-xl transition-all duration-200 text-lg ${
                !type
                  ? "glossy-button text-white shadow-xl"
                  : "text-gray-700 hover:text-[#4A9FD8] hover:bg-[#4A9FD8]/10 bg-white border border-gray-200"
              }`}
            >
              All Courses ({allCourses.length})
            </Link>
            <Link
              href="/courses?type=guided"
              className={`px-8 py-4 font-bold rounded-xl transition-all duration-200 text-lg ${
                type === "guided"
                  ? "glossy-button text-white shadow-xl"
                  : "text-gray-700 hover:text-[#4A9FD8] hover:bg-[#4A9FD8]/10 bg-white border border-gray-200"
              }`}
            >
              Guided ({guidedCount})
            </Link>
            <Link
              href="/courses?type=self-paced"
              className={`px-8 py-4 font-bold rounded-xl transition-all duration-200 text-lg ${
                type === "self-paced"
                  ? "glossy-button text-white shadow-xl"
                  : "text-gray-700 hover:text-[#4A9FD8] hover:bg-[#4A9FD8]/10 bg-white border border-gray-200"
              }`}
            >
              Self-Paced ({selfPacedCount})
            </Link>
          </div>

          {/* Results Count */}
          {type && (
            <div className="mb-8">
              <p className="text-lg text-gray-600 font-semibold">
                Showing <span className="font-extrabold text-[#4A9FD8]">{courses.length}</span> {type === "guided" ? "guided" : "self-paced"} course{courses.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Courses Grid */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map((course, idx) => (
                <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🔍</div>
              <p className="text-2xl text-gray-600 mb-4 font-bold">
                No courses found
              </p>
              <p className="text-gray-500 text-lg font-medium">
                Please try a different filter
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

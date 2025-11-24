import { notFound } from "next/navigation";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import Image from "next/image";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { mapApiCourseToWebsiteCourse } from "@/lib/courses";
import { Course } from "@/types/course";
import { 
  Clock, 
  User2, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft, 
  Star,
  CalendarDays,
  Tag,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { EnrollmentCTA } from "./enrollment-cta";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchCourse(id: string): Promise<Course | null> {
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.courses.getById(id));
    
    const apiCourse = response.data || response;
    if (!apiCourse) {
      return null;
    }
    
    // Map API course to website Course format
    return mapApiCourseToWebsiteCourse(apiCourse);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

async function fetchFullCourseDetails(id: string) {
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.courses.getById(id));
    return response.data || response;
  } catch (error) {
    console.error("Failed to fetch full course details:", error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = await fetchCourse(id);
  const fullCourseDetails = await fetchFullCourseDetails(id);

  if (!course) {
    notFound();
  }

  const getLevelConfig = (level: string) => {
    const levelLower = level.toLowerCase();
    switch (levelLower) {
      case "beginner":
        return {
          icon: TrendingUp,
          gradient: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
        };
      case "intermediate":
        return {
          icon: Award,
          gradient: "from-amber-500 to-orange-500",
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
        };
      case "advanced":
        return {
          icon: Star,
          gradient: "from-red-500 to-pink-500",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: Award,
          gradient: "from-slate-500 to-slate-600",
          bgColor: "bg-slate-100",
          textColor: "text-slate-700",
          borderColor: "border-slate-200",
        };
    }
  };

  const levelConfig = getLevelConfig(course.level);
  const LevelIcon = levelConfig.icon;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-20" />
          
          <div className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
            {/* Back Button */}
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Courses</span>
            </Link>

            <div className="max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${levelConfig.bgColor} ${levelConfig.textColor} border ${levelConfig.borderColor}`}>
                  <LevelIcon className="w-4 h-4" />
                  {course.level}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20">
                  <Tag className="w-4 h-4" />
                  {course.category}
                </span>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${course.type === "guided" ? "from-emerald-500 to-teal-500" : "from-blue-500 to-cyan-500"} text-white shadow-lg`}>
                  {course.type === "guided" ? "Guided Programme" : "Self-Paced"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User2 className="w-5 h-5" />
                  <span className="font-medium">{course.instructor}</span>
                </div>
                {course.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{course.price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Course Image */}
              {course.image && (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              )}

              {/* Overview */}
              {fullCourseDetails?.overview && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white shadow-lg">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Course Overview</h2>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {fullCourseDetails.overview}
                    </p>
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {fullCourseDetails?.curriculum && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Curriculum</h2>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {fullCourseDetails.curriculum}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {fullCourseDetails?.requirements && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Requirements</h2>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {fullCourseDetails.requirements}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                {/* CTA Card */}
                <EnrollmentCTA 
                  courseId={fullCourseDetails?.courseId || id} 
                  coursePrice={course.price} 
                />

                {/* Course Details Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Course Details</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[color:var(--brand-blue)]/10 shrink-0">
                        <Clock className="w-5 h-5 text-[color:var(--brand-blue)]" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Duration
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {course.duration}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${levelConfig.bgColor} shrink-0`}>
                        <LevelIcon className={`w-5 h-5 ${levelConfig.textColor}`} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Level
                        </div>
                        <div className="text-sm font-bold text-slate-900 capitalize">
                          {course.level}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 shrink-0">
                        <Tag className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Category
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {course.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 shrink-0">
                        <User2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Instructor
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {course.instructor}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 shrink-0">
                        <Award className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Format
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {course.format}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}


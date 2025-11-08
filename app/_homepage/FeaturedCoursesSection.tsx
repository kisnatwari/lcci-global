import Link from "next/link";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";

interface FeaturedCoursesSectionProps {
  courses: Course[];
}

export default function FeaturedCoursesSection({ courses }: FeaturedCoursesSectionProps) {
  return (
    <section className="py-28 bg-gradient-to-b from-white via-blue-50/40 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #4A9FD8 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#4A9FD8]/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-400/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-6 px-8 py-4 bg-gradient-to-r from-[#4A9FD8] via-[#6BB5E8] to-cyan-600 text-white rounded-full text-sm font-black shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 shimmer-bg opacity-50"></div>
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">⭐</span>
              Our Programmes
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight drop-shadow-sm">
            Featured Courses
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-semibold">
            Discover our award-winning courses designed to accelerate your career
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {courses.map((course, idx) => (
            <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link
            href="/courses"
            className="glossy-button inline-flex items-center gap-3 px-12 py-6 text-white rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 relative"
          >
            <span className="relative z-10">View All Courses</span>
            <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}


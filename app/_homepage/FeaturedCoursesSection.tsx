import Link from "next/link";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";

interface FeaturedCoursesSectionProps {
  courses: Course[];
}

export default function FeaturedCoursesSection({
  courses,
}: FeaturedCoursesSectionProps) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-14">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Featured programmes
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            Explore popular LCCI courses
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            A selection of guided and self-paced qualifications chosen by learners and
            institutions looking to upskill in business, finance, IT and communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            View all courses
          </Link>
        </div>
      </div>
    </section>
  );
}



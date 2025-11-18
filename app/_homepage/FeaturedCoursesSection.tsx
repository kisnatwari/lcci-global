"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";

interface FeaturedCoursesSectionProps {
  courses: Course[];
}

export default function FeaturedCoursesSection({
  courses,
}: FeaturedCoursesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return ["All", ...unique];
  }, [courses]);

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8 lg:mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Featured programmes
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            Explore popular LCCI courses
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Browse highlighted courses across hospitality, English, computing, soft skills
            and more—curated from our guided and self-paced offerings.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all border-2 ${
                activeCategory === cat
                  ? "bg-[color:var(--brand-blue)] text-white border-[color:var(--brand-blue)] shadow-lg shadow-[color:var(--brand-blue)]/30"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[color:var(--brand-blue)]/30 hover:shadow-md"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
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


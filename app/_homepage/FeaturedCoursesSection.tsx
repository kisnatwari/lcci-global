"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";
import { Sparkles, ArrowRight } from "lucide-react";

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
    <section className="relative py-24 bg-slate-50">
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header with dual layout */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--brand-blue)]/10 to-[color:var(--brand-cyan)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
              <Sparkles className="w-4 h-4" />
              Featured Programmes
          </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Popular Courses 
          </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Explore our most sought-after programmes across business, IT, languages and professional skills
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:ml-auto"
          >
            <div className="rounded-2xl border-2 border-[color:var(--brand-blue)]/20 bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-lg">
              <div className="text-sm font-semibold text-slate-500 mb-2">Delivery Modes</div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Guided · Self-paced · Hybrid
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="relative"
            >
              <div
                className={`relative z-10 px-6 py-3 rounded-2xl font-semibold text-sm ${
                  activeCategory === cat
                    ? "text-white bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] shadow-lg"
                    : "text-slate-700 bg-white border-2 border-slate-200"
                }`}
              >
                {cat}
            </div>
            </button>
          ))}
        </div>
        
        {/* Courses Grid with stagger animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-4 text-lg font-semibold text-white shadow-xl"
          >
            <span>Explore All Courses</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

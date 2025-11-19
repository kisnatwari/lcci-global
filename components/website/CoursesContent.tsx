"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";
import { Filter } from "lucide-react";

interface CoursesContentProps {
  courses: Course[];
  activeType: string | null;
}

export default function CoursesContent({ courses, activeType }: CoursesContentProps) {
  const allCount = courses.length;
  const guidedCount = courses.filter((c) => c.type === "guided").length;
  const selfPacedCount = courses.filter((c) => c.type === "self-paced").length;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 relative">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-700"
        >
          <Filter className="w-4 h-4" />
          Filter by type:
        </motion.div>
        
        <div className="flex flex-wrap gap-3">
          <FilterTab href="/courses" label={`All Courses (${allCount})`} active={!activeType} />
          <FilterTab
            href="/courses?type=guided"
            label={`Guided (${guidedCount})`}
            active={activeType === "guided"}
          />
          <FilterTab
            href="/courses?type=self-paced"
            label={`Self-Paced (${selfPacedCount})`}
            active={activeType === "self-paced"}
          />
        </div>
      </div>

      {/* Results Count */}
      {activeType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white border-2 border-slate-200 px-6 py-3 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm md:text-base text-slate-700">
              Showing{" "}
              <span className="font-bold text-[color:var(--brand-blue)]">{courses.length}</span>{" "}
              {activeType === "guided" ? "guided" : "self-paced"} course
              {courses.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>
      )}

      {/* Courses Grid / Empty state */}
      {courses.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
            <span className="text-5xl">📚</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            No courses found
          </h3>
          <p className="text-slate-600 mb-8">
            We couldn't find any courses matching your criteria.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            View All Courses
          </Link>
        </motion.div>
      )}
    </div>
  );
}

interface FilterTabProps {
  href: string;
  label: string;
  active: boolean;
}

function FilterTab({ href, label, active }: FilterTabProps) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden group"
    >
      <div
        className={`relative z-10 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
          active
            ? "text-white"
            : "text-slate-700"
        }`}
      >
        {active && (
          <motion.div
            layoutId="activeFilter"
            className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] rounded-2xl shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <div className={`absolute inset-0 rounded-2xl border-2 transition-colors ${
          active
            ? "border-transparent"
            : "border-slate-200 group-hover:border-[color:var(--brand-blue)]/30"
        }`} />
        <div className={`absolute inset-0 rounded-2xl transition-colors ${
          active
            ? "bg-transparent"
            : "bg-white group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-cyan-50"
        }`} />
        <span className="relative z-10">{label}</span>
      </div>
    </Link>
  );
}

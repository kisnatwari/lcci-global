"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Course } from "@/types/course";
import { Clock, User2, ArrowRight, Star } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const getCourseImage = (course: Course) => {
  const imageMap: Record<string, string> = {
    "1": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "2": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    "3": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop",
    "4": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop",
    "5": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    "6": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    "7": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    "8": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  };
  return imageMap[course.id] || "";
};

export default function CourseCard({ course }: CourseCardProps) {
  const imageUrl = getCourseImage(course);
  const hasImage = !!imageUrl;

  const typeGradient =
    course.type === "guided"
      ? "from-emerald-500 to-teal-500"
      : "from-blue-500 to-cyan-500";

  return (
    <Link href={`/courses/${course.id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="group h-full"
      >
        <div className="relative h-full bg-white rounded-3xl border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
          {/* Image Header */}
          <div className="relative h-48 overflow-hidden">
            {hasImage ? (
              <>
                <Image
                  src={imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${typeGradient}`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
              </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-4 left-4">
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${typeGradient} text-white text-xs font-bold shadow-lg backdrop-blur-sm`}>
                {course.type === "guided" ? "Guided Programme" : "Self-Paced"}
              </div>
            </div>

            {/* Featured Badge */}
            {course.featured && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </div>
              </div>
            )}

            {/* Level Badge - Bottom */}
            <div className="absolute bottom-4 left-4">
              <div className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-900 border border-white/50 shadow-lg">
                {course.level}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-[color:var(--brand-blue)] transition-colors leading-snug">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User2 className="w-4 h-4 text-slate-500" />
                <span className="font-medium truncate max-w-[120px]">
                  {course.instructor}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {course.price ? (
                <span className="text-lg font-bold text-slate-900">
                  {course.price}
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Contact for pricing
                </span>
              )}
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-blue)] group-hover:gap-3 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Hover Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${typeGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
        </div>
      </motion.div>
    </Link>
  );
}

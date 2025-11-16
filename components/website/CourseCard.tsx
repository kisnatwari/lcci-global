import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types/course";
import { Clock, User2 } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

// Image URLs with fallback to gradient
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

  const typeLabel =
    course.type === "guided" ? "Guided programme" : "Self-paced programme";

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group rounded-2xl bg-white/95 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
        {/* Image Header */}
        <div className="relative h-40 overflow-hidden rounded-t-2xl">
          {hasImage ? (
            <>
              <Image
                src={imageUrl}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
            </>
          ) : (
            <div
              className={`absolute inset-0 ${
                course.type === "guided"
                  ? "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500"
                  : "bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {course.category}
                </span>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {course.featured && (
            <div className="absolute top-3 right-3 rounded-full border border-amber-300 bg-amber-100/95 px-3 py-1 text-[11px] font-semibold text-amber-900 shadow-sm">
              Featured
            </div>
          )}

          {/* Type Badge */}
          <div
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-sm ${
              course.type === "guided"
                ? "bg-emerald-600/95"
                : "bg-sky-700/95"
            }`}
          >
            {typeLabel}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Level Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 border border-slate-200">
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-600 mb-4 flex-1 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium truncate max-w-[140px]">
                {course.instructor}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {course.price ? (
              <span className="text-sm md:text-base font-semibold text-slate-900">
                {course.price}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 font-medium">
                Contact for pricing
              </span>
            )}
            <span className="text-xs md:text-sm text-sky-700 font-semibold group-hover:text-sky-800 transition-colors flex items-center gap-1.5">
              Learn more
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

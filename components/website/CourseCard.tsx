import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types/course";

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

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group premium-card bg-white rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 h-full flex flex-col border border-gray-100">
        {/* Image Header - More Compact */}
        <div className="relative h-40 overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={imageUrl}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </>
          ) : (
            <div className={`absolute inset-0 ${
              course.type === "guided" 
                ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600" 
                : "bg-gradient-to-br from-[#4A9FD8] via-[#6BB5E8] to-cyan-500"
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-3xl font-black drop-shadow-lg">{course.category}</span>
              </div>
            </div>
          )}
          
          {/* Featured Badge */}
          {course.featured && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-black shadow-xl flex items-center gap-1 border-2 border-yellow-300 z-20">
              <span className="text-sm">⭐</span>
              <span>Featured</span>
            </div>
          )}
          
          {/* Type Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md ${
            course.type === "guided" 
              ? "bg-green-500/90 text-white border border-green-300" 
              : "bg-[#4A9FD8]/90 text-white border border-[#4A9FD8]/30"
          }`}>
            {course.type === "guided" ? "🎓 Guided" : "📚 Self-Paced"}
          </div>
        </div>
        
        {/* Content - Compact */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Level Badge */}
          <div className="mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
              {course.level}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-[#4A9FD8] transition-colors leading-tight">
            {course.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed font-medium">
            {course.description}
          </p>
          
          {/* Info Icons - Compact */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-base">⏱️</span>
              <span className="font-semibold">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">👤</span>
              <span className="font-semibold truncate max-w-[120px]">{course.instructor}</span>
            </div>
          </div>
          
          {/* Footer - Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {course.price ? (
              <span className="text-2xl font-black bg-gradient-to-r from-[#4A9FD8] via-[#6BB5E8] to-cyan-600 bg-clip-text text-transparent">
                {course.price}
              </span>
            ) : (
              <span className="text-xs text-gray-500 font-bold">Contact for Pricing</span>
            )}
            <span className="text-[#4A9FD8] font-bold group-hover:text-cyan-600 transition-colors flex items-center gap-1.5 text-sm">
              Learn More
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Course } from "@/types/course";
import { Clock, User2, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollmentDialog } from "@/components/website/EnrollmentDialog";
import { getAuthSession, getUserRole } from "@/lib/auth";
import LoginModal from "@/components/website/LoginModal";

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
  const router = useRouter();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Use course.image if available, otherwise fallback to hardcoded map
  const imageUrl = course.image || getCourseImage(course);
  const hasImage = !!imageUrl;
  
  // Check if image URL is from a configured domain
  const isConfiguredDomain = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const configuredDomains = [
        'images.unsplash.com',
        'themystickeys.com',
        'example.com',
        'wwe.com',
        'upload.wikimedia.org',
        'wikimedia.org'
      ];
      return configuredDomains.some(domain => 
        urlObj.hostname === domain || 
        urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  };
  
  const shouldUseNextImage = hasImage && isConfiguredDomain(imageUrl);
  
  const typeGradient =
    course.type === "guided"
      ? "from-emerald-500 to-teal-500"
      : "from-blue-500 to-cyan-500";

  // Check if user is logged in
  const isLoggedIn = () => {
    const session = getAuthSession();
    const role = getUserRole();
    // Only allow learners/students to enroll
    return session && (role === "learner" || role === "Customer" || role === "Training_Site_Student");
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsEnrollDialogOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card itself, not on buttons or links
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    router.push(`/courses/${course.id}`);
  };

  return (
    <>
      <div className="h-full">
        <div
          onClick={handleCardClick}
          className="relative h-full bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col cursor-pointer"
        >
          {/* Image Header */}
          <div className="relative h-48 overflow-hidden">
            {hasImage ? (
              <>
                {shouldUseNextImage ? (
                  <Image
                    src={imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
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
            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">
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
            <div className="flex items-center justify-end gap-2">
                <Button
                  onClick={handleEnrollClick}
                  size="sm"
                  className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white"
                >
                  Enroll
                </Button>
                <Link
                  href={`/courses/${course.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-blue)]"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Enrollment Dialog */}
      <EnrollmentDialog
        courseId={course.id}
        courseTitle={course.title}
        isOpen={isEnrollDialogOpen}
        onOpenChange={setIsEnrollDialogOpen}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

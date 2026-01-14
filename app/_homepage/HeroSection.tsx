"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { apiClient, ENDPOINTS } from "@/lib/api";

interface Category {
  categoryId: string;
  name: string;
  description: string | null;
  _count?: {
    courses: number;
  };
}

interface Course {
  courseId: string;
  categoryId?: string;
  category?: {
    categoryId: string;
    name: string;
  };
}

const categoryIcons: Record<string, string> = {
  "Communication": "🗣️",
  "Leadership": "🧭",
  "Customer Experience": "🤝",
  "Sales": "🎤",
  "Presentation": "🎤",
  "Business": "💼",
  "Finance": "💰",
  "IT": "💻",
  "English": "📚",
};

const categoryColors: Record<string, string> = {
  "Communication": "from-purple-500 to-pink-500",
  "Leadership": "from-amber-500 to-orange-500",
  "Customer Experience": "from-emerald-500 to-teal-500",
  "Sales": "from-blue-600 to-cyan-500",
  "Presentation": "from-blue-600 to-cyan-500",
  "Business": "from-indigo-500 to-purple-500",
  "Finance": "from-green-500 to-emerald-500",
  "IT": "from-blue-500 to-cyan-500",
  "English": "from-red-500 to-pink-500",
};

const getCategoryIcon = (name: string): string => {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return "📚"; // Default icon
};

const getCategoryColor = (name: string): string => {
  for (const [key, color] of Object.entries(categoryColors)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return "from-slate-500 to-slate-600"; // Default color
};

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch categories and courses in parallel - handle independently
        const [categoriesResult, coursesResult] = await Promise.allSettled([
          apiClient.get(ENDPOINTS.categories.get()),
          apiClient.get(ENDPOINTS.courses.get()),
        ]);

        // Handle categories response independently
        let categoriesData: Category[] = [];
        if (categoriesResult.status === 'fulfilled') {
          const categoriesResponse = categoriesResult.value;
          if (categoriesResponse.success && categoriesResponse.data) {
            if (Array.isArray(categoriesResponse.data.categories)) {
              categoriesData = categoriesResponse.data.categories;
            } else if (Array.isArray(categoriesResponse.data)) {
              categoriesData = categoriesResponse.data;
            } else if (Array.isArray(categoriesResponse)) {
              categoriesData = categoriesResponse;
            }
          }
        } else {
          console.error("Failed to fetch categories:", categoriesResult.reason);
        }

        // Handle courses response independently
        let coursesData: Course[] = [];
        if (coursesResult.status === 'fulfilled') {
          const coursesResponse = coursesResult.value;
          if (coursesResponse.success && coursesResponse.data) {
            if (Array.isArray(coursesResponse.data.courses)) {
              coursesData = coursesResponse.data.courses;
            } else if (Array.isArray(coursesResponse.data)) {
              coursesData = coursesResponse.data;
            } else if (Array.isArray(coursesResponse)) {
              coursesData = coursesResponse;
            }
          }
        } else {
          console.error("Failed to fetch courses:", coursesResult.reason);
        }

        setCategories(categoriesData);
        setCourses(coursesData);

        // Set error only if both requests failed
        if (categoriesResult.status === 'rejected' && coursesResult.status === 'rejected') {
          setError("Failed to load data");
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map categories with course counts from API, sort by count (highest first), and take top 4
  const categoryCards = useMemo(() => {
    return categories
      .map((category) => {
        const courseCount = category._count?.courses || 0;
        return {
          title: category.name,
          count: courseCount,
          color: getCategoryColor(category.name),
          icon: getCategoryIcon(category.name),
          categoryId: category.categoryId,
        };
      })
      .sort((a, b) => b.count - a.count) // Sort by course count (descending) - prioritize higher counts
      .slice(0, 4); // Show only top 4 categories
  }, [categories]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Spacer for fixed header */}
      <div className="absolute top-0 left-0 right-0 h-20" />

      {/* Animated background with multiple layers */}
      <div className="absolute inset-0">
        {/* Large animated gradient orbs - subtle light effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-[color:var(--brand-cyan)] to-blue-500 rounded-full blur-3xl"
        />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-semibold text-white shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Award-winning qualification since 2009
              </motion.div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                  Master Your
                  <span className="block bg-gradient-to-r from-[color:var(--brand-cyan)] to-blue-400 bg-clip-text text-transparent mt-2">
                    Professional Future
                  </span>
                </h1>

                <div className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl space-y-3">
                  <div className="text-white text-xl md:text-2xl font-semibold mt-3 mb-1">
                    Transform Your Future with Skills That Matter
                  </div>
                  <div>
                    At <span className="font-semibold">LCCI Global Qualifications</span>, we boost your confidence, enhance employability, and prepare you for real-world success. <span className="font-semibold text-white">Join thousands of learners shaping their future with us.</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-500/50"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="https://youtu.be/m2Pck7Vt4Ls?si=nXJQNgD79dK54kgG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 text-lg font-semibold text-white"
                >
                  <Play className="w-5 h-5" />
                  Watch Overview
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] border-4 border-slate-900 flex items-center justify-center text-white font-bold text-sm"
                      >
                        {i}K
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-white text-lg">25,000+</div>
                    <div className="text-blue-200">Learners trained</div>
                  </div>
                </div>

                <div className="h-12 w-px bg-white/20" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-white text-lg">120+</div>
                    <div className="text-blue-200">Partner institutions</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Visual Feature */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Main feature card */}
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />

                  <div className="relative space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Active Learning Programs
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      Choose Your Path
                    </h3>

                    <div className="space-y-4">
                      {isLoading ? (
                        // Loading skeleton
                        [1, 2, 3, 4].map((idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                          >
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 animate-pulse" />
                            <div className="flex-1">
                              <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-2" />
                              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                            </div>
                            <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
                          </div>
                        ))
                      ) : error ? (
                        // Error state
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                          <p className="text-sm text-red-200 text-center">{error}</p>
                        </div>
                      ) : categoryCards.length === 0 ? (
                        // Empty state
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-sm text-blue-200 text-center">No categories available</p>
                        </div>
                      ) : (
                        // Category cards
                        categoryCards.map((item, idx) => (
                          <Link
                            key={item.categoryId}
                            href={`/courses?category=${item.categoryId}`}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1 }}
                              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer"
                            >
                              <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg`}>
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-semibold">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-blue-200">
                                  {item.count} {item.count === 1 ? 'programme' : 'programmes'}
                                </p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-white/50" />
                            </motion.div>
                          </Link>
                        ))
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-blue-100 text-center">
                        Flexible delivery: <span className="text-white font-semibold">Guided</span> or <span className="text-white font-semibold">Self-paced</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent cards */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl max-w-[200px]">
                <div className="text-[color:var(--brand-blue)]">
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
                    ) : (
                      `${courses.length}+`
                    )}
                  </div>
                  <div className="text-sm text-[color:var(--brand-blue)]/90">Active Courses</div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 shadow-2xl">
                <div className="text-white text-center">
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-sm text-white/90">Pass Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

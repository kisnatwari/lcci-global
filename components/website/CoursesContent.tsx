"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";
import { Filter, ChevronDown } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { mapApiCourseToWebsiteCourse } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Category = {
  categoryId: string;
  name: string;
  description: string;
};

interface CoursesContentProps {
  initialCategoryId: string | null;
  initialType: string | null;
}

export default function CoursesContent({ initialCategoryId, initialType }: CoursesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]); // For counting
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId);
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.categories.get());
        if (response.success && response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          setCategories(response);
        }
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all courses for counting
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.courses.get());
        let apiCourses: any[] = [];
        if (response.success && response.data && Array.isArray(response.data.courses)) {
          apiCourses = response.data.courses;
        } else if (response.data && Array.isArray(response.data.courses)) {
          apiCourses = response.data.courses;
        } else if (Array.isArray(response)) {
          apiCourses = response;
        }
        
        const mappedCourses = apiCourses.map(mapApiCourseToWebsiteCourse);
        setAllCourses(mappedCourses);
      } catch (err: any) {
        console.error("Failed to fetch all courses:", err);
      }
    };

    fetchAllCourses();
  }, []);

  // Fetch courses with filtering
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append("categoryId", selectedCategory);
        }
        if (selectedType) {
          // Map frontend type to backend type
          const backendType = selectedType === "guided" ? "Guided" : "SelfPaced";
          params.append("type", backendType);
        }
        
        const url = params.toString() 
          ? `${ENDPOINTS.courses.get()}?${params.toString()}`
          : ENDPOINTS.courses.get();
        
        const response = await apiClient.get(url);
        let apiCourses: any[] = [];
        if (response.success && response.data && Array.isArray(response.data.courses)) {
          apiCourses = response.data.courses;
        } else if (response.data && Array.isArray(response.data.courses)) {
          apiCourses = response.data.courses;
        } else if (Array.isArray(response)) {
          apiCourses = response;
        }
        
        const mappedCourses = apiCourses.map(mapApiCourseToWebsiteCourse);
        setCourses(mappedCourses);
      } catch (err: any) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, selectedType]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.set("categoryId", selectedCategory);
    }
    if (selectedType) {
      params.set("type", selectedType);
    }
    
    const newUrl = params.toString() 
      ? `/courses?${params.toString()}`
      : "/courses";
    
    router.push(newUrl, { scroll: false });
  }, [selectedCategory, selectedType, router]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
  };

  // Get counts for categories
  const getCategoryCount = (categoryId: string) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    if (!category) return 0;
    
    // Since mapApiCourseToWebsiteCourse converts category to string (name),
    // we match by category name
    return allCourses.filter(c => c.category === category.name).length;
  };

  const getTypeCount = (type: "guided" | "self-paced") => {
    return allCourses.filter(c => c.type === type).length;
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 relative">
      {/* Filters Section */}
      <div className="space-y-6 mb-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            <Filter className="w-4 h-4" />
            Filter by category:
          </motion.div>
          
          <div className="flex flex-wrap gap-3">
            <CategoryTab
              label={`All Courses (${allCourses.length})`}
              active={selectedCategory === null}
              onClick={() => handleCategoryChange(null)}
            />
            {categories.map((category) => {
              const count = getCategoryCount(category.categoryId);
              return (
                <CategoryTab
                  key={category.categoryId}
                  label={`${category.name} (${count})`}
                  active={selectedCategory === category.categoryId}
                  onClick={() => handleCategoryChange(category.categoryId)}
                />
              );
            })}
          </div>
        </div>

        {/* Type Dropdown */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            <Filter className="w-4 h-4" />
            Type:
          </motion.div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
                <span>
                  {selectedType === null 
                    ? "All Types" 
                    : selectedType === "guided" 
                    ? "Guided" 
                    : "Self-Paced"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleTypeChange(null)}>
                All Types ({allCourses.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("guided")}>
                Guided ({getTypeCount("guided")})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("self-paced")}>
                Self-Paced ({getTypeCount("self-paced")})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      {(selectedCategory || selectedType) && (
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
              course{courses.length !== 1 ? "s" : ""}
              {selectedCategory && ` in ${categories.find(c => c.categoryId === selectedCategory)?.name || "category"}`}
              {selectedType && ` (${selectedType === "guided" ? "Guided" : "Self-Paced"})`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] mb-4 animate-pulse">
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-slate-600">Loading courses...</p>
          </div>
        </div>
      )}

      {/* Courses Grid / Empty state */}
      {!isLoading && courses.length > 0 ? (
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

interface CategoryTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CategoryTab({ label, active, onClick }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
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
            layoutId="activeCategoryFilter"
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
    </button>
  );
}

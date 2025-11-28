import { Course, CoursesData } from "@/types/course";
import { API_BASE_URL } from "./api/config";

// Map API course to website Course format
export function mapApiCourseToWebsiteCourse(apiCourse: any): Course {
  // Determine type - default to "guided" if not specified
  // Map API types (Guided/SelfPaced) to frontend types (guided/self-paced)
  let courseType: "guided" | "self-paced" = "guided";
  if (apiCourse.type) {
    const apiType = String(apiCourse.type).toLowerCase();
    if (apiType === "selfpaced" || apiType === "self-paced") {
      courseType = "self-paced";
    } else {
      courseType = "guided";
    }
  }
  
  // Format duration - convert days to weeks or keep as string
  const formatDuration = (days: number): string => {
    if (days >= 7) {
      const weeks = Math.round(days / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    }
    return `${days} day${days > 1 ? "s" : ""}`;
  };
  
  // Format level - capitalize first letter
  const formatLevel = (level: string): string => {
    if (!level) return "All Levels";
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  // Format price
  const formatPrice = (price: number | string): string => {
    if (!price || price === 0) return "";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `NPR ${numPrice.toLocaleString()}`;
  };

  return {
    id: apiCourse.courseId,
    title: apiCourse.name,
    description: apiCourse.description || "",
    type: courseType,
    category: apiCourse.category?.name || "General",
    duration: apiCourse.duration ? formatDuration(apiCourse.duration) : "Self-paced",
    level: formatLevel(apiCourse.level || ""),
    featured: false, // API doesn't have featured field, default to false
    image: apiCourse.thumbnailUrl || "",
    instructor: apiCourse.creator?.profile 
      ? `${apiCourse.creator.profile.firstName} ${apiCourse.creator.profile.lastName}`
      : "LCCI Instructor",
    price: formatPrice(apiCourse.price || 0),
    format: courseType === "guided" ? "Guided Programme" : "Self-Paced",
  };
}

// Fetch courses from API (client-side)
export async function fetchCoursesFromAPI(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different API response formats
    let apiCourses: any[] = [];
    if (data.success && data.data && Array.isArray(data.data.courses)) {
      apiCourses = data.data.courses;
    } else if (data.data && Array.isArray(data.data.courses)) {
      apiCourses = data.data.courses;
    } else if (Array.isArray(data)) {
      apiCourses = data;
    }
    
    // Map API courses to website Course format
    return apiCourses.map(mapApiCourseToWebsiteCourse);
  } catch (error) {
    console.error("Failed to fetch courses from API:", error);
    // Fallback to empty array on error
    return [];
  }
}

// Legacy functions for backward compatibility (now fetch from API)
export async function getAllCourses(): Promise<Course[]> {
  return fetchCoursesFromAPI();
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const courses = await getAllCourses();
  // Since API doesn't have featured field, return first 6 courses as featured
  return courses.slice(0, 6);
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const courses = await getAllCourses();
  return courses.find(course => course.id === id);
}

export async function getCoursesByType(type: "guided" | "self-paced"): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter(course => course.type === type);
}

export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter(course => course.category === category);
}


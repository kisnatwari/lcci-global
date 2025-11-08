import { Course, CoursesData } from "@/types/course";
import coursesData from "@/data/courses.json";

export function getAllCourses(): Course[] {
  return (coursesData as CoursesData).courses;
}

export function getFeaturedCourses(): Course[] {
  return getAllCourses().filter(course => course.featured);
}

export function getCourseById(id: string): Course | undefined {
  return getAllCourses().find(course => course.id === id);
}

export function getCoursesByType(type: "guided" | "self-paced"): Course[] {
  return getAllCourses().filter(course => course.type === type);
}

export function getCoursesByCategory(category: string): Course[] {
  return getAllCourses().filter(course => course.category === category);
}


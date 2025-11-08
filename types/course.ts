export type CourseType = "guided" | "self-paced";

export interface Course {
  id: string;
  title: string;
  description: string;
  type: CourseType;
  category: string;
  duration: string;
  level: string;
  featured: boolean;
  image: string;
  instructor: string;
  price: string;
  format: string;
}

export interface CoursesData {
  courses: Course[];
}


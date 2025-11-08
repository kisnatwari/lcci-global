import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import HeroSection from "./_homepage/HeroSection";
import FeaturedCoursesSection from "./_homepage/FeaturedCoursesSection";
import CourseTypesSection from "./_homepage/CourseTypesSection";
import CTASection from "./_homepage/CTASection";
import { getFeaturedCourses } from "@/lib/courses";

export default function Home() {
  const featuredCourses = getFeaturedCourses();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturedCoursesSection courses={featuredCourses} />
        <CourseTypesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}

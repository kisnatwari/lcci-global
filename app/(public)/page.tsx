import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import HeroSection from "../_homepage/HeroSection";
import StatsBannerSection from "../_homepage/StatsBannerSection";
import FeaturedCoursesSection from "../_homepage/FeaturedCoursesSection";
import CourseTypesSection from "../_homepage/CourseTypesSection";
import HowItWorksSection from "../_homepage/HowItWorksSection";
import AudienceSection from "../_homepage/AudienceSection";
import OutcomesSection from "../_homepage/OutcomesSection";
import TestimonialsSection from "../_homepage/TestimonialsSection";
import FaqSection from "../_homepage/FaqSection";
import CTASection from "../_homepage/CTASection";
import { getFeaturedCourses } from "@/lib/courses";

export default function Home() {
  const featuredCourses = getFeaturedCourses();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <StatsBannerSection />
        <FeaturedCoursesSection courses={featuredCourses} />
        <CourseTypesSection />
        <HowItWorksSection />
        <AudienceSection />
        <OutcomesSection />
        <TestimonialsSection />
        <FaqSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}

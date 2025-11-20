"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import LoginModal from "@/components/website/LoginModal";
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
import { useState } from "react";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const featuredCourses = getFeaturedCourses();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    // Check if login query parameter is present
    const shouldOpenLogin = searchParams.get('login') === 'true';
    if (shouldOpenLogin) {
      setIsLoginModalOpen(true);
      // Remove login query parameter from URL without reload (keep redirect if present)
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
    // Note: Navigation after login is handled by LoginModal component
    // This is just for closing the modal
  };

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
      
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginClose} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

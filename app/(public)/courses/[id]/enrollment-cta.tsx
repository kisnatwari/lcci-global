"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EnrollmentDialog } from "@/components/website/EnrollmentDialog";
import { getAuthSession, getUserRole } from "@/lib/auth";
import LoginModal from "@/components/website/LoginModal";

interface EnrollmentCTAProps {
  courseId: string;
  coursePrice?: string;
}

export function EnrollmentCTA({ courseId, coursePrice }: EnrollmentCTAProps) {
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check if user is logged in
  const isLoggedIn = () => {
    const session = getAuthSession();
    const role = getUserRole();
    // Only allow learners/students to enroll
    return session && (role === "learner" || role === "Customer" || role === "Training_Site_Student");
  };

  const handleEnrollClick = () => {
    if (!isLoggedIn()) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsEnrollDialogOpen(true);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] rounded-3xl p-8 shadow-2xl text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
        <p className="text-white/90 mb-6">
          Join this course and take the next step in your professional journey.
        </p>
        
        {coursePrice ? (
          <div className="mb-6">
            <div className="text-sm text-white/80 mb-1">Course Price</div>
            <div className="text-3xl font-bold">{coursePrice}</div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="text-sm text-white/80 mb-1">Pricing</div>
            <div className="text-lg font-semibold">Contact for pricing</div>
          </div>
        )}

        <Button
          onClick={handleEnrollClick}
          className="w-full py-4 px-6 rounded-xl bg-white text-[color:var(--brand-blue)] font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          Enroll Now
        </Button>
        
        <Link
          href="/contact-us"
          className="block w-full text-center py-3 px-6 rounded-xl bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold mt-3 hover:bg-white/20 transition-all duration-300"
        >
          Contact Us
        </Link>
      </div>

      {/* Enrollment Dialog */}
      <EnrollmentDialog
        courseId={courseId}
        isOpen={isEnrollDialogOpen}
        onOpenChange={setIsEnrollDialogOpen}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, AlertCircle, Tag } from "lucide-react";
import { enrollInCourse, type PaymentRequiredResponse } from "@/lib/api/enrollments";
import { getAuthSession, getUserRole } from "@/lib/auth";
import LoginModal from "@/components/website/LoginModal";
import { EsewaPaymentForm } from "@/components/website/EsewaPaymentForm";

interface EnrollmentDialogProps {
  courseId: string;
  courseTitle?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EnrollmentDialog({
  courseId,
  courseTitle,
  isOpen,
  onOpenChange,
  onSuccess,
}: EnrollmentDialogProps) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState<PaymentRequiredResponse | null>(null);

  // Check if user is logged in
  const isLoggedIn = () => {
    const session = getAuthSession();
    const role = getUserRole();
    // Only allow learners/students to enroll
    return session && (role === "learner" || role === "Customer" || role === "Training_Site_Student");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setPromoCode("");
      setError(null);
      setEnrollmentSuccess(false);
      setPaymentRequired(null);
    }
    onOpenChange(open);
  };

  const handleEnroll = async () => {
    if (!isLoggedIn()) {
      handleOpenChange(false);
      setIsLoginModalOpen(true);
      return;
    }

    setIsEnrolling(true);
    setError(null);
    setPaymentRequired(null);

    try {
      const payload: { courseId: string; promoCode?: string } = {
        courseId,
      };

      if (promoCode.trim()) {
        payload.promoCode = promoCode.trim();
      }

      const response = await enrollInCourse(payload);
      
      // Check if payment is required
      if ('status' in response && response.status === "payment_required") {
        setPaymentRequired(response as PaymentRequiredResponse);
        setIsEnrolling(false);
        return;
      }
      
      // Enrollment successful without payment
      setEnrollmentSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to student dashboard after 2 seconds
      setTimeout(() => {
        handleOpenChange(false);
        router.push("/student/enrollments");
      }, 2000);
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to enroll in course. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in Course</DialogTitle>
            <DialogDescription>
              {courseTitle ? (
                <>Complete your enrollment for &quot;{courseTitle}&quot; to start learning.</>
              ) : (
                <>Complete your enrollment to start learning.</>
              )}
            </DialogDescription>
          </DialogHeader>

          {paymentRequired ? (
            <div className="py-6">
              <EsewaPaymentForm
                paymentParams={paymentRequired.paymentParams}
                paymentUrl={paymentRequired.paymentUrl}
                onCancel={() => {
                  setPaymentRequired(null);
                  setError("Payment was cancelled. Please try again when ready.");
                }}
              />
            </div>
          ) : enrollmentSuccess ? (
            <div className="py-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">Enrollment Successful!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have been enrolled in this course. Redirecting to your dashboard...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="pl-9"
                    disabled={isEnrolling}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Have a promo code? Enter it here to apply a discount.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {!enrollmentSuccess && !paymentRequired && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isEnrolling}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    "Confirm Enrollment"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}


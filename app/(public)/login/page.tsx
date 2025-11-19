"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoginModal from "@/components/website/LoginModal";
import { getAuthSession } from "@/lib/auth";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    // Check if already logged in (check encrypted session)
    const session = getAuthSession();

    if (session && session.accessToken) {
      // Already logged in, redirect based on role
      if (redirect) {
        router.push(redirect);
      } else {
        // Redirect based on role
        const role = session.role?.toLowerCase();
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard'); // TODO: Update when dashboards are ready
        }
      }
    }
  }, [redirect, router]);

  const handleClose = () => {
    if (redirect) {
      router.push(redirect);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoginModal isOpen={true} onClose={handleClose} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}


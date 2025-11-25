"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { setAuthSession, decodeToken } from "@/lib/auth";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AdminLoginModalContent({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset form when modal closes
      setIsLoading(false);
      setError(null);
      setEmail("");
      setPassword("");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Login with email and password
      const formData = {
        email: email.trim(),
        password: password,
      };
      
      // Make API call
      const response = await apiClient.post(ENDPOINTS.auth.login(), formData);
      
      // Handle successful response
      if (response.success && response.data) {
        // Store encrypted session in cookie
        if (response.data.accessToken && response.data.refreshToken) {
          const tokenPayload = decodeToken(response.data.accessToken);
          const tokenRole = tokenPayload?.role;

          if (!tokenPayload || !tokenRole) {
            setError("Unable to verify credentials. Please try again.");
            setIsLoading(false);
            return;
          }

          // Check if user is admin
          if (tokenRole !== "Admin") {
            setError("Access denied. Admin credentials required.");
            setIsLoading(false);
            return;
          }

          const userId = tokenPayload.sub;

          // Extract user info from login response
          const userName = response.data.user?.name || response.data.name || response.data.fullName || undefined;
          const userEmail = response.data.user?.email || response.data.email || email;

          setAuthSession(
            response.data.accessToken,
            response.data.refreshToken,
            "admin",
            userId,
            userName,
            userEmail
          );
        }
        
        // Dispatch login success event for header to update
        window.dispatchEvent(new CustomEvent('loginSuccess'));
        
        // Close modal
        onClose();
        
        // Check if there's a redirect query parameter
        const redirectPath = searchParams?.get('redirect');
        if (redirectPath) {
          router.push(redirectPath);
          return;
        }
        
        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle 401 Unauthorized - invalid credentials
      if (err.status === 401 || err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            <div className="p-8 lg:p-12">
              <div className="flex flex-col">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                    <ShieldCheck className="w-4 h-4" />
                    Admin Login
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Admin Portal
                  </h2>
                  <p className="text-slate-600">
                    Sign in to access the admin dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-slate-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[color:var(--brand-blue)] focus:ring-[color:var(--brand-blue)]" />
                      <span className="text-slate-600">Remember me</span>
                    </label>
                    <a href="#" className="text-[color:var(--brand-blue)] font-semibold hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full px-6 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  return (
    <Suspense fallback={null}>
      <AdminLoginModalContent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}


"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { setAuthSession, decodeToken } from "@/lib/auth";
import Link from "next/link";
import Logo from "@/components/website/Logo";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
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
                    autoFocus
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

            <div className="mt-6 text-center text-sm text-slate-600">
              <Link
                href="/"
                className="text-[color:var(--brand-blue)] font-semibold hover:underline"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}


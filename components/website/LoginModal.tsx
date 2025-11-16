"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, User2, GraduationCap, ShieldCheck, School } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginType = "b2c" | "cambridge" | "sqa" | "admin";
type AuthMode = "login" | "signup";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeType, setActiveType] = useState<LoginType>("b2c");
  const [mode, setMode] = useState<AuthMode>("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // reset auth mode and form when modal closes
      setMode("login");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
      setSignupError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loginOptions = [
    {
      type: "b2c" as LoginType,
      title: "Learner login",
      description: "For individual students and professionals",
      icon: User2,
    },
    {
      type: "cambridge" as LoginType,
      title: "Cambridge centres",
      description: "For learners enrolled through Cambridge schools",
      icon: School,
    },
    {
      type: "sqa" as LoginType,
      title: "SQA learners",
      description: "For learners with SQA qualifications",
      icon: GraduationCap,
    },
    {
      type: "admin" as LoginType,
      title: "Admin access",
      description: "For administrators and staff members",
      icon: ShieldCheck,
    },
  ];

  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!fullName.trim()) {
      setSignupError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setSignupError("Please enter your email address.");
      return;
    }

    if (!password || password.length < 8) {
      setSignupError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setSignupError("You must accept the terms & conditions to continue.");
      return;
    }

    // TODO: Wire this up to the real signup API endpoint
    // For now we just close the modal and reset the form.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in-up border border-gray-100">
        {/* Header */}
        <div className="bg-linear-to-r from-sky-700 via-sky-600 to-cyan-500 p-7 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-white/80 mb-1">
                {mode === "login" ? "Sign in" : "Create account"}
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mb-1 tracking-tight">
                {mode === "login" ? "Welcome back to LCCI" : "Join the LCCI learner community"}
              </h2>
              <p className="text-white/90 text-sm md:text-base font-medium">
                {mode === "login"
                  ? "Choose the login option that matches how you study with us."
                  : "Create a learner account to save your progress and manage your courses."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Login Options - Horizontal Tabs */}
          {mode === "login" && (
            <div className="grid grid-cols-2 gap-3 mb-8 pb-5 border-b border-gray-200">
              {loginOptions.map((option) => {
                const Icon = option.icon;
                const isActive = activeType === option.type;
                return (
                  <button
                    key={option.type}
                    onClick={() => setActiveType(option.type)}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-xs md:text-sm transition-colors ${
                      isActive
                        ? "border-sky-600 bg-sky-50 text-slate-900"
                        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                        isActive ? "bg-sky-600 text-white" : "bg-slate-100 text-sky-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block font-semibold">{option.title}</span>
                      <span className="block text-slate-500 text-[11px]">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Auth Content */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200">
            {mode === "login" ? (
              <>
                {/* B2C Login */}
                {activeType === "b2c" && (
                  <div className="space-y-5 animate-fade-in-up max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                        placeholder="Enter your email"
                      />
                    </div>
                    <button className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 font-bold text-gray-700 hover:shadow-lg bg-white">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>
                  </div>
                )}

                {/* Cambridge Students Login */}
                {activeType === "cambridge" && (
                  <div className="space-y-5 animate-fade-in-up max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        School Name
                      </label>
                  <select className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) bg-white font-medium">
                        <option value="">Select your school</option>
                        <option value="school1">
                          Cambridge International School
                        </option>
                        <option value="school2">Cambridge Academy</option>
                        <option value="school3">Cambridge High School</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        School Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                        placeholder="Enter your school code"
                      />
                    </div>
                    <button className="glossy-button w-full px-6 py-4 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
                      <span className="relative z-10">Login</span>
                    </button>
                  </div>
                )}

                {/* SQA Students Login */}
                {activeType === "sqa" && (
                  <div className="space-y-5 animate-fade-in-up max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        SCN Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                        placeholder="Enter your SCN (Scottish Candidate Number)"
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        Your SCN is a unique identifier provided by SQA
                      </p>
                    </div>
                    <button className="glossy-button w-full px-6 py-4 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
                      <span className="relative z-10">Login</span>
                    </button>
                  </div>
                )}

                {/* Admin Login */}
                {activeType === "admin" && (
                  <div className="space-y-5 animate-fade-in-up max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                        placeholder="admin@lccigq.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all bg-white font-medium"
                        placeholder="Enter your password"
                      />
                    </div>
                    <button className="glossy-button w-full px-6 py-4 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
                      <span className="relative z-10">Admin Login</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Signup Form (B2C)
              <form
                onSubmit={handleSignupSubmit}
                className="space-y-5 animate-fade-in-up max-w-md mx-auto"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all bg-white font-medium"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) transition-all bg-white font-medium"
                      placeholder="Repeat your password"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-(--brand-blue) focus:ring-(--brand-blue)"
                  />
                  <label
                    htmlFor="accept-terms"
                    className="text-xs md:text-sm text-gray-600 font-medium text-left"
                  >
                    I agree to the{" "}
                    <span className="text-(--brand-blue) font-semibold cursor-pointer">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-(--brand-blue) font-semibold cursor-pointer">
                      Privacy Policy
                    </span>
                    .
                  </label>
                </div>

                {signupError && (
                  <p className="text-sm text-red-600 font-medium">
                    {signupError}
                  </p>
                )}

                <button
                  type="submit"
                  className="glossy-button w-full px-6 py-4 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative"
                >
                  <span className="relative z-10">Create Account</span>
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            {mode === "login" ? (
              <p className="text-sm text-gray-600 font-medium">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-(--brand-blue) hover:text-cyan-600 font-bold underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600 font-medium">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-(--brand-blue) hover:text-cyan-600 font-bold underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

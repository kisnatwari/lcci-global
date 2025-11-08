"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginType = "b2c" | "cambridge" | "sqa" | "admin";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeType, setActiveType] = useState<LoginType>("b2c");

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

  if (!isOpen) return null;

  const loginOptions = [
    {
      type: "b2c" as LoginType,
      title: "Regular Login",
      description: "For individual students and professionals",
      icon: "👤",
    },
    {
      type: "cambridge" as LoginType,
      title: "Cambridge Students",
      description: "For students enrolled through Cambridge schools",
      icon: "🎓",
    },
    {
      type: "sqa" as LoginType,
      title: "SQA Students",
      description: "For students with SQA qualifications",
      icon: "📜",
    },
    {
      type: "admin" as LoginType,
      title: "Admin Access",
      description: "For administrators and staff members",
      icon: "🔐",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in-up border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A9FD8] via-[#6BB5E8] to-cyan-500 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-white/95 text-lg font-medium">Choose your login method to continue</p>
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
          <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b-2 border-gray-200">
            {loginOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setActiveType(option.type)}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  activeType === option.type
                    ? "bg-gradient-to-r from-[#4A9FD8] to-cyan-600 text-white shadow-lg scale-105"
                    : "bg-gray-50 text-gray-700 hover:bg-[#4A9FD8]/10 hover:text-[#4A9FD8] border border-gray-200"
                }`}
              >
                <span className="mr-2 text-lg">{option.icon}</span>
                {option.title}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border border-gray-200">
            {/* B2C Login */}
            {activeType === "b2c" && (
              <div className="space-y-5 animate-fade-in-up max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all bg-white font-medium"
                    placeholder="Enter your email"
                  />
                </div>
                <button className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 font-bold text-gray-700 hover:shadow-lg bg-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
                  <select className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] bg-white font-medium">
                    <option value="">Select your school</option>
                    <option value="school1">Cambridge International School</option>
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
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all bg-white font-medium"
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
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all bg-white font-medium"
                    placeholder="Enter your SCN (Scottish Candidate Number)"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">Your SCN is a unique identifier provided by SQA</p>
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
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all bg-white font-medium"
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
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Don't have an account?{" "}
              <a href="#" className="text-[#4A9FD8] hover:text-cyan-600 font-bold underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

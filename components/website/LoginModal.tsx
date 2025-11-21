"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User2, GraduationCap, ShieldCheck, School, Mail, Lock, ArrowRight, Building2, IdCard, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { setAuthSession, decodeToken } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = "learner" | "cambridge" | "sqa" | "admin" | null;

function LoginModalContent({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [scnNumber, setScnNumber] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset form when modal closes
      setSelectedRole(null);
      setIsRegister(false);
      setIsLoading(false);
      setError(null);
      setSuccessMessage(null);
      setEmail("");
      setPassword("");
      setFullName("");
      setSchoolName("");
      setSchoolCode("");
      setScnNumber("");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Listen for register event
  useEffect(() => {
    const handleOpenRegister = () => {
      setIsRegister(true);
      setSelectedRole("learner");
    };
    
    window.addEventListener('openRegister', handleOpenRegister);
    return () => window.removeEventListener('openRegister', handleOpenRegister);
  }, []);

  // Map frontend role to backend userType
  const getUserType = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "Admin";
      case "learner":
        return "Customer";
      case "cambridge":
      case "sqa":
        return "Training_Site_Student";
      default:
        return "Customer";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError("Please select a role to continue.");
      return;
    }

    setIsLoading(true);
    const roleChoice = selectedRole;
    const backendRole = getUserType(roleChoice);
    
    try {
      // Collect form data based on role
      const formData: any = { 
        userType: backendRole // Backend expects userType only
      };
      
      if (roleChoice === "learner") {
        if (isRegister) {
          // Registration endpoint for learners
          formData.email = email;
          formData.password = password;
          formData.username = fullName; // Send fullName as username
          // userType already set above
          
          // Call registration endpoint
          const registerResponse = await apiClient.post(ENDPOINTS.auth.register(), formData);
          
          // Handle successful registration
          if (registerResponse.success) {
            // Show success message and switch to login form
            setSuccessMessage("Registration successful! Please login now.");
            setIsRegister(false); // Switch to login mode
            setIsLoading(false);
            // Clear password field for security
            setPassword("");
            // Keep email filled for convenience
            return;
          } else {
            setError(registerResponse.message || "Registration failed. Please try again.");
            setIsLoading(false);
            return;
          }
        } else {
          // Login for learners
          formData.email = email;
          formData.password = password;
          // userType already set above
        }
      } else if (roleChoice === "cambridge") {
        formData.schoolName = schoolName;
        formData.schoolCode = schoolCode;
        // userType already set above
      } else if (roleChoice === "sqa") {
        formData.scnNumber = scnNumber;
        // userType already set above
      } else if (roleChoice === "admin") {
        formData.email = email;
        formData.password = password;
        // userType already set above
      }
      
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
            return;
          }

          if (tokenRole !== backendRole) {
            setError("Invalid credentials.");
            return;
          }

          const userId = tokenPayload.sub;

          // Extract user info from login response (name and email)
          const userName = response.data.user?.name || response.data.name || response.data.fullName || undefined;
          const userEmail = response.data.user?.email || response.data.email || undefined;

          setAuthSession(
            response.data.accessToken,
            response.data.refreshToken,
            roleChoice,
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
        
        // Redirect to appropriate dashboard based on role using SPA navigation
        const role = roleChoice.toLowerCase();
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "learner" || role === "student") {
          router.push("/student");
        } else if (role === "cambridge") {
          router.push("/dashboard"); // TODO: Update when Cambridge dashboard is ready
        } else if (role === "sqa") {
          router.push("/dashboard"); // TODO: Update when SQA dashboard is ready
        } else {
          router.push("/");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle 401 Unauthorized - invalid credentials
      if (err.status === 401 || err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError("Invalid credentials.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginOptions = [
    {
      icon: User2,
      title: "Learner",
      description: "Regular students - Register or Login",
      role: "learner" as UserRole,
    },
    {
      icon: School,
      title: "Cambridge",
      description: "Cambridge students - Login only",
      role: "cambridge" as UserRole,
    },
    {
      icon: GraduationCap,
      title: "SQA",
      description: "SQA learners - Login only",
      role: "sqa" as UserRole,
    },
    {
      icon: ShieldCheck,
      title: "Admin",
      description: "System administration",
      role: "admin" as UserRole,
    },
  ];

  const canRegister = selectedRole === "learner";
  
  const getRoleTitle = () => {
    switch (selectedRole) {
      case "learner": return "Learner";
      case "cambridge": return "Cambridge Student";
      case "sqa": return "SQA Learner";
      case "admin": return "Admin";
      default: return "";
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            <div className="grid md:grid-cols-2 h-full max-h-[90vh]">
              {/* Left Side - Login Form */}
              <div className="p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
                {!selectedRole ? (
                  <div>
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        Secure Login
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Welcome Back
                      </h2>
                      <p className="text-slate-600">
                        Select your role to continue
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedRole(null);
                        setIsRegister(false);
                        setSuccessMessage(null);
                      }}
                      className="mb-6 text-sm text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      ← Back to roles
                    </button>
                    
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        {getRoleTitle()} {isRegister && canRegister ? "Registration" : "Login"}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {isRegister && canRegister ? "Create Account" : "Welcome Back"}
                      </h2>
                      <p className="text-slate-600">
                        {isRegister && canRegister ? "Register as a learner" : `Sign in as ${getRoleTitle()}`}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Learner - Email & Password (with optional registration) */}
                      {selectedRole === "learner" && (
                        <>
                          {isRegister && (
                            <>
                              <div>
                                <label htmlFor="fullName" className="block text-sm font-bold text-slate-900 mb-2">
                                  Full Name
                                </label>
                                <div className="relative">
                                  <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                  <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                                    placeholder="John Doe"
                                    required
                                  />
                                </div>
                              </div>
                            </>
                          )}
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
                                placeholder="your.email@example.com"
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
                        </>
                      )}

                      {/* Cambridge - School Name & Code */}
                      {selectedRole === "cambridge" && (
                        <>
                          <div>
                            <label htmlFor="schoolName" className="block text-sm font-bold text-slate-900 mb-2">
                              School Name
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="text"
                                id="schoolName"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                                placeholder="Your school name"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="schoolCode" className="block text-sm font-bold text-slate-900 mb-2">
                              School Code
                            </label>
                            <div className="relative">
                              <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="text"
                                id="schoolCode"
                                value={schoolCode}
                                onChange={(e) => setSchoolCode(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                                placeholder="Enter school code"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* SQA - SCN Number */}
                      {selectedRole === "sqa" && (
                        <div>
                          <label htmlFor="scnNumber" className="block text-sm font-bold text-slate-900 mb-2">
                            SCN Number
                          </label>
                          <div className="relative">
                            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              id="scnNumber"
                              value={scnNumber}
                              onChange={(e) => setScnNumber(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                              placeholder="Enter your SCN number"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Admin - Email & Password */}
                      {selectedRole === "admin" && (
                        <>
                          <div>
                            <label htmlFor="adminEmail" className="block text-sm font-bold text-slate-900 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="email"
                                id="adminEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                                placeholder="admin@example.com"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="adminPassword" className="block text-sm font-bold text-slate-900 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="password"
                                id="adminPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                                placeholder="••••••••"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {!isRegister && (
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[color:var(--brand-blue)] focus:ring-[color:var(--brand-blue)]" />
                            <span className="text-slate-600">Remember me</span>
                          </label>
                          <a href="#" className="text-[color:var(--brand-blue)] font-semibold hover:underline">
                            Forgot credentials?
                          </a>
                        </div>
                      )}

                      {/* Success Message */}
                      {successMessage && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{successMessage}</span>
                        </div>
                      )}

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
                            <span>{isRegister && canRegister ? "Creating Account..." : "Signing in..."}</span>
                          </>
                        ) : (
                          <>
                            <span>{isRegister && canRegister ? "Create Account" : "Sign In"}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>

                    {canRegister && (
                      <div className="mt-6 text-center text-sm text-slate-600">
                        {isRegister ? (
                          <>
                            Already have an account?{" "}
                            <button
                              onClick={() => {
                                setIsRegister(false);
                                setSuccessMessage(null);
                              }}
                              className="text-[color:var(--brand-blue)] font-semibold hover:underline"
                            >
                              Sign in
                            </button>
                          </>
                        ) : (
                          <>
                            Don't have an account?{" "}
                            <button
                              onClick={() => {
                                setIsRegister(true);
                                setSuccessMessage(null);
                              }}
                              className="text-[color:var(--brand-blue)] font-semibold hover:underline"
                            >
                              Register now
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    
                    {!canRegister && !isRegister && (
                      <div className="mt-6 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-xs text-slate-600 text-center">
                          ℹ️ {getRoleTitle()} accounts are managed by administrators.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side - Role Selection */}
              <div className="relative bg-slate-50 p-8 lg:p-12 flex flex-col justify-center overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Select Your Role
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Choose your account type to continue
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {loginOptions.map((option, idx) => {
                      const Icon = option.icon;
                      const isSelected = selectedRole === option.role;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedRole(option.role);
                            setIsRegister(false);
                            setError(null);
                            setSuccessMessage(null);
                          }}
                          className={`group relative rounded-2xl p-6 transition-all duration-300 text-center border-2 ${
                            isSelected
                              ? "bg-[color:var(--brand-blue)] border-[color:var(--brand-blue)] shadow-lg"
                              : "bg-white border-slate-200 hover:border-[color:var(--brand-blue)]/50 hover:shadow-md"
                          }`}
                        >
                          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-all duration-300 ${
                            isSelected
                              ? "bg-white/20"
                              : "bg-[color:var(--brand-blue)]/10"
                          }`}>
                            <Icon className={`w-7 h-7 ${isSelected ? "text-white" : "text-[color:var(--brand-blue)]"}`} />
                          </div>
                          <h4 className={`text-base font-bold mb-1 ${isSelected ? "text-white" : "text-slate-900"}`}>
                            {option.title}
                          </h4>
                          <p className={`text-xs ${isSelected ? "text-white/80" : "text-slate-600"}`}>
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-white border-2 border-slate-200">
                    <p className="text-sm text-slate-600 text-center">
                      🔒 <span className="font-semibold">Secure & Encrypted</span> - Your data is protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Suspense fallback={null}>
      <LoginModalContent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}

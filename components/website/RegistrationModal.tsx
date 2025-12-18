"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User2, Mail, Lock, ArrowRight, IdCard, Loader2, AlertCircle, CheckCircle, School, GraduationCap, ShieldCheck, Brain, Phone } from "lucide-react";
import { register, requestRegistrationOtp } from "@/lib/api";
import { setAuthSession, decodeToken } from "@/lib/auth";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCentreType?: "SQA" | "Cambridge" | "SoftSkills" | null; // Pre-select training centre type
}

function RegistrationModalContent({ isOpen, onClose, preSelectedCentreType = null }: RegistrationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [centreUniqueIdentifier, setCentreUniqueIdentifier] = useState<string | null>(preSelectedCentreType || null);
  const [trainingCentreId, setTrainingCentreId] = useState("");
  const [scnNumber, setScnNumber] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [phone, setPhone] = useState("");
  
  // OTP state (for regular learners only)
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset form when modal closes
      setIsLoading(false);
      setError(null);
      setSuccessMessage(null);
      setEmail("");
      setPassword("");
      setFullName("");
      setCentreUniqueIdentifier(preSelectedCentreType || null);
      setTrainingCentreId("");
      setScnNumber("");
      setInstitutionName("");
      setPhone("");
      setOtp("");
      setOtpRequested(false);
      setIsRequestingOtp(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, preSelectedCentreType]);

  // Update centreUniqueIdentifier when preSelectedCentreType changes
  useEffect(() => {
    if (isOpen) {
      setCentreUniqueIdentifier(preSelectedCentreType || null);
    }
  }, [isOpen, preSelectedCentreType]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const isTrainingCentreStudent = centreUniqueIdentifier && (centreUniqueIdentifier === "SQA" || centreUniqueIdentifier === "Cambridge");
    const isSoftSkillsStudent = centreUniqueIdentifier === "SoftSkills";
    const isRegularLearner = !isTrainingCentreStudent && !isSoftSkillsStudent;
    
    // Validate required fields based on type
    if (isTrainingCentreStudent) {
      if (!email || !password || !fullName) {
        setError("Please fill in all required fields.");
        return;
      }
      if (centreUniqueIdentifier === "Cambridge" && !trainingCentreId.trim()) {
        setError("Please enter your training centre ID.");
        return;
      }
      if (centreUniqueIdentifier === "SQA" && !scnNumber.trim()) {
        setError("Please enter your SCN number.");
        return;
      }
    } else if (isSoftSkillsStudent) {
      if (!email || !password || !fullName || !institutionName.trim() || !phone.trim()) {
        setError("Please fill in all required fields.");
        return;
      }
    } else {
      // Regular learner validation
      if (!email || !password || !fullName) {
        setError("Please fill in all required fields.");
        return;
      }
      
      // For regular learners, handle OTP flow
      if (!otpRequested) {
        // Request OTP first
        setIsRequestingOtp(true);
        try {
          const otpResponse = await requestRegistrationOtp({ email });
          if (otpResponse.success) {
            setOtpRequested(true);
            setSuccessMessage("OTP has been sent to your email. Please check your inbox.");
            setIsRequestingOtp(false);
            return;
          } else {
            setError(otpResponse.message || "Failed to send OTP. Please try again.");
            setIsRequestingOtp(false);
            return;
          }
        } catch (err: any) {
          setError(err.message || "Failed to send OTP. Please try again.");
          setIsRequestingOtp(false);
          return;
        }
      }
      
      // If OTP is requested but not entered
      if (!otp.trim()) {
        setError("Please enter the OTP sent to your email.");
        return;
      }
    }
        
    setIsLoading(true);
        
    const registerPayload: any = {
      email,
      password,
      otp: isRegularLearner ? otp : "", // OTP only for regular learners
    };
        
    if (isTrainingCentreStudent) {
      registerPayload.userType = "Training_Site_Student";
      registerPayload.username = fullName;
      registerPayload.fullName = fullName;
      if (centreUniqueIdentifier === "Cambridge" && trainingCentreId.trim()) {
        registerPayload.centreUniqueIdentifier = trainingCentreId.trim();
      }
      if (centreUniqueIdentifier === "SQA" && scnNumber.trim()) {
        registerPayload.centreUniqueIdentifier = scnNumber.trim();
      }
    } else if (isSoftSkillsStudent) {
      registerPayload.userType = "Training_Site_Student";
      registerPayload.username = fullName;
      registerPayload.fullName = fullName;
      registerPayload.centreUniqueIdentifier = institutionName.trim();
      registerPayload.phone = phone.trim();
    } else {
      registerPayload.userType = "Customer";
      registerPayload.username = fullName;
      registerPayload.fullName = fullName;
    }
        
    try {
      const registerResponse = await register(registerPayload);
          
      if (registerResponse.success) {
        setSuccessMessage("Registration successful! Please login now.");
        setIsLoading(false);
        setPassword("");
        setCentreUniqueIdentifier(null);
        setTrainingCentreId("");
        setScnNumber("");
        setInstitutionName("");
        setPhone("");
        setOtp("");
        setOtpRequested(false);

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(registerResponse.message || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const isTrainingCentreStudent = centreUniqueIdentifier && (centreUniqueIdentifier === "SQA" || centreUniqueIdentifier === "Cambridge");

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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            <div className="p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
              <div className="flex flex-col">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                    <ShieldCheck className="w-4 h-4" />
                    Registration
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-600">
                    {centreUniqueIdentifier 
                      ? `Register as ${centreUniqueIdentifier === "SoftSkills" ? "Soft Skills" : centreUniqueIdentifier} Student`
                      : "Register as a learner"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Show training centre info if pre-selected, otherwise hide it completely for regular users */}
                  {centreUniqueIdentifier && (
                    <div className="p-4 rounded-xl border-2 border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/10">
                      <div className="flex items-center gap-3 mb-2">
                        {centreUniqueIdentifier === "SQA" ? (
                          <School className="w-6 h-6 text-[color:var(--brand-blue)]" />
                        ) : centreUniqueIdentifier === "Cambridge" ? (
                          <GraduationCap className="w-6 h-6 text-[color:var(--brand-blue)]" />
                        ) : (
                          <Brain className="w-6 h-6 text-[color:var(--brand-blue)]" />
                        )}
                        <span className="text-sm font-bold text-[color:var(--brand-blue)]">
                          {centreUniqueIdentifier === "SoftSkills" ? "Soft Skills" : centreUniqueIdentifier} Student Registration
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {centreUniqueIdentifier === "SoftSkills" 
                          ? "Soft Skills students require email verification via OTP."
                          : "Training centre students can register directly without OTP verification."}
                      </p>
                    </div>
                  )}

                  {/* Single-step form based on selection */}
                  {isTrainingCentreStudent ? (
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
                      {centreUniqueIdentifier === "Cambridge" && (
                        <div>
                          <label htmlFor="trainingCentreId" className="block text-sm font-bold text-slate-900 mb-2">
                            Training Centre ID
                          </label>
                          <div className="relative">
                            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              id="trainingCentreId"
                              value={trainingCentreId}
                              onChange={(e) => setTrainingCentreId(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                              placeholder="Enter your training centre ID"
                              required
                            />
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            Enter your training centre ID provided by your institution.
                          </p>
                        </div>
                      )}
                      {centreUniqueIdentifier === "SQA" && (
                        <div>
                          <label htmlFor="scnNumber" className="block text-sm font-bold text-slate-900 mb-2">
                            Training Center Code
                          </label>
                          <div className="relative">
                            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              id="scnNumber"
                              value={scnNumber}
                              onChange={(e) => setScnNumber(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                              placeholder="Enter your training center code"
                              required
                            />
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            Enter your training center code provided by your institution.
                          </p>
                        </div>
                      )}
                    </>
                  ) : centreUniqueIdentifier === "SoftSkills" ? (
                    <>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-bold text-slate-900 mb-2">
                          Name
                        </label>
                        <div className="relative">
                          <User2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      </div>
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
                        <label htmlFor="institutionName" className="block text-sm font-bold text-slate-900 mb-2">
                          Training Center Code
                        </label>
                        <div className="relative">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            id="institutionName"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                            placeholder="Enter your training center code"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-slate-900 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                            placeholder="Enter your phone number"
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
                  ) : (
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
                      {otpRequested && (
                        <div>
                          <label htmlFor="otp" className="block text-sm font-bold text-slate-900 mb-2">
                            OTP Code
                          </label>
                          <div className="relative">
                            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              id="otp"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                              placeholder="Enter OTP code"
                              required
                            />
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            Please enter the OTP code sent to your email address.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || isRequestingOtp}
                    className="group w-full px-6 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isRequestingOtp ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {!centreUniqueIdentifier && !otpRequested ? "Request OTP" : "Create Account"}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <button
                    onClick={onClose}
                    className="text-[color:var(--brand-blue)] font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function RegistrationModal({ isOpen, onClose, preSelectedCentreType }: RegistrationModalProps) {
  return (
    <Suspense fallback={null}>
      <RegistrationModalContent isOpen={isOpen} onClose={onClose} preSelectedCentreType={preSelectedCentreType} />
    </Suspense>
  );
}


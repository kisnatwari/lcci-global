"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactFormProps {
  courseId: string;
  courseName: string;
}

export function ContactForm({ courseId, courseName }: ContactFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (successMessage) setSuccessMessage(null);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // TODO: Replace with actual contact API endpoint when available
      // For now, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real implementation, you would call your contact API:
      // const response = await apiClient.post("/api/contact", {
      //   ...formData,
      //   courseId,
      //   courseName,
      // });

      setSuccessMessage("Thank you for your inquiry! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-lg">
      {!isExpanded ? (
        // Collapsed State - Show Button/Link
        <CardContent className="p-4 sm:p-6">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full group"
          >
            <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border-2 border-slate-200 hover:border-[color:var(--brand-blue)]/50 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[color:var(--brand-blue)] transition-colors line-clamp-2">
                    Have some custom Requirements?
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-0.5 line-clamp-1">
                    Contact us about this course
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-[color:var(--brand-blue)] transition-colors shrink-0" />
            </div>
          </button>
        </CardContent>
      ) : (
        // Expanded State - Show Form
        <>
          <CardHeader>
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg leading-tight">Have some custom Requirements?</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Contact us about this course
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsExpanded(false);
                  // Reset form when collapsing
                  setFormData({ name: "", email: "", phone: "", message: "" });
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
                className="h-8 w-8 shrink-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              <AlertCircle className="mt-0.5 h-4 w-4 text-red-600 shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              disabled={isSubmitting}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+977 98XXXXXXXX"
              disabled={isSubmitting}
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your custom requirements..."
              rows={4}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Course: <span className="font-semibold">{courseName}</span>
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] hover:opacity-90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
              </motion.form>
            </AnimatePresence>
          </CardContent>
        </>
      )}
    </Card>
  );
}


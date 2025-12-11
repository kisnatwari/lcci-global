"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, HelpCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

export default function NewFAQPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    orderIndex: "",
    isActive: true,
  });

  const handleSave = async () => {
    if (!formData.question || !formData.question.trim()) {
      setError("Question is required");
      return;
    }

    if (!formData.answer || !formData.answer.trim()) {
      setError("Answer is required");
      return;
    }

    // Parse orderIndex, default to 0 if empty
    const orderIndex = formData.orderIndex ? parseInt(formData.orderIndex, 10) : 0;
    if (isNaN(orderIndex)) {
      setError("Order index must be a valid number");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.post(ENDPOINTS.faqs.post(), {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        orderIndex: orderIndex,
        isActive: formData.isActive,
      });

      setSuccessMessage("FAQ created successfully!");
      
      // Redirect to FAQs list after a short delay
      setTimeout(() => {
        router.push("/admin/faqs");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create FAQ:", err);
      // Handle API error format
      const errorMessage = err.response?.data?.error?.message || err.message || "Failed to create FAQ";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/faqs")}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to FAQs
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[color:var(--brand-blue)]/10">
              <HelpCircle className="w-7 h-7 text-[color:var(--brand-blue)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">New FAQ</h1>
              <p className="text-slate-600 mt-1">Create a new frequently asked question</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50/80 border-2 border-red-200/60 text-red-700 text-sm shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-50/80 border-2 border-emerald-200/60 text-emerald-700 text-sm shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-900">Success</p>
              <p className="text-emerald-700 mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        <Card className="border-2 border-slate-200 shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Question */}
            <div className="space-y-2.5">
              <Label htmlFor="question" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Question <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => {
                  setFormData({ ...formData, question: e.target.value });
                  setError(null);
                }}
                placeholder="Enter the question"
                disabled={isSaving}
                className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
              />
            </div>

            {/* Answer */}
            <div className="space-y-2.5">
              <Label htmlFor="answer" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Answer <span className="text-red-500 font-bold">*</span>
              </Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => {
                  setFormData({ ...formData, answer: e.target.value });
                  setError(null);
                }}
                placeholder="Enter the answer"
                disabled={isSaving}
                rows={6}
                className="border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm resize-none"
              />
            </div>

            {/* Order Index */}
            <div className="space-y-2.5">
              <Label htmlFor="orderIndex" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Order Index
              </Label>
              <Input
                id="orderIndex"
                type="number"
                value={formData.orderIndex}
                onChange={(e) => {
                  setFormData({ ...formData, orderIndex: e.target.value });
                  setError(null);
                }}
                placeholder="Leave empty to add at the end"
                disabled={isSaving}
                className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
              />
              <p className="text-xs text-slate-500 font-medium">Controls the display order. Lower numbers appear first. Leave empty to add at the end.</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 bg-slate-50">
              <div>
                <Label htmlFor="isActive" className="text-sm font-semibold text-slate-800">
                  Active Status
                </Label>
                <p className="text-xs text-slate-500 mt-1">Only active FAQs are displayed on the homepage</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-4 pb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/faqs")}
            disabled={isSaving}
            className="h-12 px-8 border-2 border-slate-300 font-semibold hover:bg-slate-100 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isSaving ||
              !formData.question.trim() ||
              !formData.answer.trim()
            }
            className="min-w-[160px] h-12 px-8 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create FAQ"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


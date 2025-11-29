"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function NewBlogPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    author: "",
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.slug || !formData.slug.trim()) {
      setError("Slug is required");
      return;
    }

    if (!formData.content || !formData.content.trim()) {
      setError("Content is required");
      return;
    }

    if (!formData.author || !formData.author.trim()) {
      setError("Author is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
      };

      const response = await apiClient.post(ENDPOINTS.blogs.post(), payload);
      console.log("Create response:", response);
      setSuccessMessage("Blog created successfully!");
      
      // Redirect to blogs list after a short delay
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      const errorMessage = err.message || 
                          (err.response?.data?.message) ||
                          "Failed to create blog";
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
            onClick={() => router.push("/admin/blogs")}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[color:var(--brand-blue)]/10">
              <FileText className="w-7 h-7 text-[color:var(--brand-blue)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">New Blog Post</h1>
              <p className="text-slate-600 mt-1">Create a new blog post</p>
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
            {/* Title */}
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Title <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  handleTitleChange(e.target.value);
                  setError(null);
                }}
                placeholder="Enter blog title"
                disabled={isSaving}
                className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2.5">
              <Label htmlFor="slug" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Slug <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });
                  setError(null);
                }}
                placeholder="blog-post-slug"
                disabled={isSaving}
                className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm font-mono"
              />
              <p className="text-xs text-slate-500 font-medium">URL-friendly identifier (auto-generated from title)</p>
            </div>

            {/* Author */}
            <div className="space-y-2.5">
              <Label htmlFor="author" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Author <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => {
                  setFormData({ ...formData, author: e.target.value });
                  setError(null);
                }}
                placeholder="Author name"
                disabled={isSaving}
                className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
              />
            </div>

            {/* Content */}
            <div className="space-y-2.5">
              <Label htmlFor="content" className="text-sm font-semibold text-slate-800">
                Content <span className="text-red-500 font-bold">*</span>
              </Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your blog content here. You can add tables, images, links, and format text..."
                disabled={isSaving}
              />
              <p className="text-xs text-slate-500 font-medium">Blog content. Supports rich text, tables, images, and links.</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end gap-4 pb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/blogs")}
            disabled={isSaving}
            className="h-12 px-8 border-2 border-slate-300 font-semibold hover:bg-slate-100 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isSaving ||
              !formData.title.trim() ||
              !formData.slug.trim() ||
              !formData.content.trim() ||
              !formData.author.trim()
            }
            className="min-w-[160px] h-12 px-8 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Blog"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


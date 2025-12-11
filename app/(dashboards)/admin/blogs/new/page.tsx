"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Loader2, AlertCircle, CheckCircle2, Upload, X, Image as ImageIcon } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewBlogPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    status: "draft" as "draft" | "published",
  });

  // Handle thumbnail upload
  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingThumbnail(true);
    setError(null);

    try {
      const response = await apiClient.upload(ENDPOINTS.upload.file(), file);
      
      // Handle different response formats
      const uploadedUrl = response.data?.url || response.data?.fileUrl || response.url || response.fileUrl;
      
      if (uploadedUrl) {
        setFormData({ ...formData, thumbnailUrl: uploadedUrl });
        setSuccessMessage("Thumbnail uploaded successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Upload response did not contain a URL");
      }
    } catch (err: any) {
      console.error("Failed to upload thumbnail:", err);
      setError(err.message || "Failed to upload thumbnail. Please try again.");
    } finally {
      setIsUploadingThumbnail(false);
      // Reset input so same file can be selected again
      event.target.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData({ ...formData, thumbnailUrl: "" });
  };

  // Helper function to extract error message from API response
  const getErrorMessage = (err: any): string => {
    // Check for API error format: { error: { code, message, details } }
    if (err.response?.data?.error?.message) {
      return err.response.data.error.message;
    }
    if (err.error?.message) {
      return err.error.message;
    }
    // Check for direct message
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    // Handle specific status codes
    if (err.status === 409) {
      return "A blog with this slug already exists. Please choose a different slug.";
    }
    if (err.status === 400) {
      return "Invalid input. Please check all fields and try again.";
    }
    if (err.status === 401) {
      return "Unauthorized. Please log in again.";
    }
    if (err.status === 403) {
      return "You don't have permission to create blogs.";
    }
    // Default message
    return err.message || "Failed to create blog. Please try again.";
  };

  const handleSave = async () => {
    if (!formData.title || !formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.content || !formData.content.trim()) {
      setError("Content is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Payload matches API: { title, content, thumbnailUrl, status }
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        thumbnailUrl: formData.thumbnailUrl || null,
        status: formData.status,
      };

      const response = await apiClient.post(ENDPOINTS.blogs.post(), payload);
      setSuccessMessage("Blog created successfully!");
      
      // Redirect to blogs list after a short delay
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      setError(getErrorMessage(err));
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
                  setFormData({ ...formData, title: e.target.value });
                  setError(null);
                }}
                placeholder="Enter blog title"
                disabled={isSaving}
                className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
              />
            </div>

            {/* Status */}
            <div className="space-y-2.5">
              <Label htmlFor="status" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Status <span className="text-red-500 font-bold">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
                disabled={isSaving}
              >
                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white focus:border-[color:var(--brand-blue)] focus:ring-2 focus:ring-[color:var(--brand-blue)]/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 font-medium">Choose whether to publish the blog immediately or save as draft</p>
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2.5">
              <Label htmlFor="thumbnail" className="text-sm font-semibold text-slate-800">
                Thumbnail Image
              </Label>
              {formData.thumbnailUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="h-32 w-auto rounded-lg border-2 border-slate-200 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveThumbnail}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      disabled={isSaving || isUploadingThumbnail}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 break-all">{formData.thumbnailUrl}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploadingThumbnail ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-2 text-slate-400 animate-spin" />
                          <p className="text-sm text-slate-500">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isSaving || isUploadingThumbnail}
                    />
                  </label>
                </div>
              )}
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
              isUploadingThumbnail ||
              !formData.title.trim() ||
              !formData.content.trim()
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


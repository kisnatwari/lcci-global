"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2, AlertCircle, Pencil, Eye, Calendar, User, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type Blog = {
  blogId: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  author: string | { userId?: string; profile?: { name?: string; fullName?: string } | null };
  status: string;
  publishedAt: string | null;
  thumbnailUrl: string | null;
};

export default function BlogViewPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.blogId as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.blogs.getById(blogId));
      const data = response.data || response;
      setBlog(data);
    } catch (err: any) {
      console.error("Failed to fetch blog:", err);
      // Check for API error format: { error: { code, message, details } }
      let errorMessage = "Failed to load blog";
      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.error?.message) {
        errorMessage = err.error.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.status === 404) {
        errorMessage = "Blog not found. It may have been deleted.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get author name
  const getAuthorName = (author: string | { userId?: string; profile?: { name?: string; fullName?: string } }): string => {
    if (typeof author === 'string') return author;
    return author?.profile?.name || author?.profile?.fullName || author?.userId || 'Unknown';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/blogs")}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
          
          <Card className="border-2 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Blog</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

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
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">View Blog Post</h1>
              <p className="text-slate-600 mt-1">Blog details and content</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/blogs/${blog.blogId}/edit`)}
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit Blog
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Public Page
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* Blog Details Card */}
        <Card className="border-2 border-slate-200 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">{blog.title}</CardTitle>
            <CardDescription className="text-base">
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    blog.status === 'published' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {blog.status === 'published' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{getAuthorName(blog.author)}</span>
                </div>
                {blog.publishedAt && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Published: {formatDate(blog.publishedAt)}</span>
                  </div>
                )}
                {!blog.publishedAt && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>Not published</span>
                  </div>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Slug</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <code className="text-sm text-slate-700 font-mono">{blog.slug}</code>
              </div>
              <p className="text-xs text-slate-500">URL: /blogs/{blog.slug}</p>
            </div>

            {/* Blog ID */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Blog ID</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <code className="text-sm text-slate-700 font-mono">{blog.blogId}</code>
              </div>
            </div>

            {/* Author ID */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Author ID</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <code className="text-sm text-slate-700 font-mono">{blog.authorId}</code>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Status</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  blog.status === 'published' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {blog.status === 'published' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Published At */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Published At</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                {blog.publishedAt ? (
                  <span className="text-sm text-slate-700">{formatDate(blog.publishedAt)}</span>
                ) : (
                  <span className="text-sm text-slate-500 italic">Not published yet</span>
                )}
              </div>
            </div>

            {/* Thumbnail URL */}
            {blog.thumbnailUrl && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Thumbnail</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <img 
                    src={blog.thumbnailUrl} 
                    alt={blog.title}
                    className="max-w-xs rounded-md"
                  />
                  <p className="text-xs text-slate-500 mt-2 break-all">{blog.thumbnailUrl}</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Content</label>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-md min-h-[200px]">
                <div
                  className="prose prose-lg max-w-none blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/blogs")}
          >
            Back to List
          </Button>
          <Button
            onClick={() => router.push(`/admin/blogs/${blog.blogId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Blog
          </Button>
        </div>
      </div>
    </div>
  );
}


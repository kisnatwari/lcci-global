"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, FileText, Loader2, AlertCircle, CheckCircle2, Eye, Clock } from "lucide-react";
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

interface BlogsPageClientProps {
  initialBlogs: Blog[];
  error: string | null;
}

export function BlogsPageClient({ initialBlogs, error: initialError }: BlogsPageClientProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);

  console.log("blogs", blogs);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper function to extract error message from API response
  // Handles API error format: { error: { code, message, details } }
  const getErrorMessage = (err: any, context: 'fetch' | 'delete' | 'general' = 'general'): string => {
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
    if (err.status === 401) {
      return "Unauthorized. Please log in again";
    }
    if (err.status === 403) {
      return context === 'delete' 
        ? "You don't have permission to delete this blog"
        : "You don't have permission to access blogs";
    }
    if (err.status === 404) {
      return "Blog not found";
    }
    if (err.status === 409) {
      return "A blog with this slug already exists. Please choose a different slug.";
    }
    if (err.status === 400) {
      return "Invalid request. Please check your input and try again.";
    }
    // Default message
    return err.message || (context === 'fetch' ? "Failed to load blogs" : "An error occurred");
  };

  // Fetch blogs from API (for refresh)
  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.blogs.get());
      
      // According to API docs, GET /api/cms/blogs returns a direct array
      let blogsData: Blog[] = [];
      if (Array.isArray(response)) {
        blogsData = response;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        blogsData = response.data;
      } else if (response.data && Array.isArray(response.data.blogs)) {
        blogsData = response.data.blogs;
      } else if (Array.isArray(response.blogs)) {
        blogsData = response.blogs;
      } else {
        blogsData = [];
      }
      
      setBlogs(blogsData);
    } catch (err: any) {
      console.error("Failed to fetch blogs:", err);
      setError(getErrorMessage(err, 'fetch'));
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get author name
  const getAuthorName = (author: string | { userId?: string; profile?: { name?: string; fullName?: string } | null }): string => {
    if (typeof author === 'string') return author;
    return author?.profile?.name || author?.profile?.fullName || author?.userId || 'Unknown';
  };

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAuthorName(blog.author).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = async () => {
    if (!deletingBlog) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await apiClient.delete(ENDPOINTS.blogs.delete(deletingBlog.blogId));
      
      // Check for success message in response (API returns { message: "Blog deleted successfully." })
      const successMsg = response?.message || "Blog deleted successfully!";
      
      // Remove from local state
      setBlogs(blogs.filter((blog) => blog.blogId !== deletingBlog.blogId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingBlog(null);
      setError(null);
      setSuccessMessage(successMsg);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete blog:", err);
      setError(getErrorMessage(err, 'delete'));
    } finally {
      setIsSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Blogs</CardTitle>
              <CardDescription className="mt-1">
                Manage blog posts and articles
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/admin/blogs/new")} className="gap-2">
              <Plus className="h-4 w-4" />
              New Blog
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"} found
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium">Failed to load blogs</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBlogs}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading blogs...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && !error && filteredBlogs.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog, index) => (
                    <TableRow key={blog.blogId || blog.slug || `blog-${index}`}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                          <FileText className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {blog.slug}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {typeof blog.author === 'string' 
                          ? blog.author 
                          : blog.author?.profile?.name || blog.author?.profile?.fullName || blog.author?.userId || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
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
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {blog.publishedAt ? formatDate(blog.publishedAt) : (
                          <span className="text-slate-400 italic">Not published</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/blogs/${blog.blogId}`)}
                            className="h-8 w-8"
                            title="View blog"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/blogs/${blog.blogId}/edit`)}
                            className="h-8 w-8"
                            title="Edit blog"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingBlog(blog);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete blog"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No blogs found" : "No blogs yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first blog post"}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push("/admin/blogs/new")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Blog
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingBlog?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingBlog(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


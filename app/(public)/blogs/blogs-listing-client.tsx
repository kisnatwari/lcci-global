"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, User, Loader2, AlertCircle } from "lucide-react";
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

interface BlogsListingClientProps {
  initialBlogs: Blog[];
  error: string | null;
}

export function BlogsListingClient({ initialBlogs, error: initialError }: BlogsListingClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  console.log(blogs);

  // Helper function to get author name
  const getAuthorName = (author: string | { userId?: string; profile?: { name?: string; fullName?: string } | null }): string => {
    if (typeof author === 'string') return author;
    return author?.profile?.name || author?.profile?.fullName || author?.userId || 'Unknown';
  };

  // Filter blogs based on search and status (only show published blogs)
  const filteredBlogs = blogs
    .filter((blog) => blog.status === 'published' && blog.publishedAt) // Only show published blogs
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAuthorName(blog.author).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    // Remove HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-slate-300 focus:border-[color:var(--brand-blue)]"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-medium">Failed to load blogs</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading blogs...</span>
          </div>
        )}

        {/* Blogs Grid */}
        {!isLoading && !error && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.blogId || blog.slug || `blog-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/blogs/${blog.slug}`}>
                  <Card className="h-full border-2 border-slate-200 hover:border-[color:var(--brand-blue)] transition-all duration-300 hover:shadow-xl cursor-pointer group overflow-hidden flex flex-col">
                    {/* Thumbnail Image */}
                    {blog.thumbnailUrl ? (
                      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                        <img
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-[color:var(--brand-blue)]/10 to-[color:var(--brand-cyan)]/10 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="h-4 w-4" />
                          <span>{getAuthorName(blog.author)}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[color:var(--brand-blue)] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-slate-600 mb-4 line-clamp-3 flex-1">
                        {truncateContent(blog.content)}
                      </p>
                      
                      {blog.publishedAt && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-auto">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              {searchTerm ? "No blogs found" : "No blogs yet"}
            </h3>
            <p className="text-slate-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Check back later for new blog posts"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


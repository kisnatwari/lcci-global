"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface BlogDetailClientProps {
  blog: Blog;
  error: string | null;
}

export function BlogDetailClient({ blog, error }: BlogDetailClientProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get author name
  const getAuthorName = (author: string | { userId?: string; profile?: { name?: string; fullName?: string } | null }): string => {
    if (typeof author === 'string') return author;
    return author?.profile?.name || author?.profile?.fullName || author?.userId || 'Unknown';
  };

  if (error) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/blogs">
              <Button>Back to Blogs</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blogs">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        {/* Blog Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Thumbnail Image */}
          {blog.thumbnailUrl && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{getAuthorName(blog.author)}</span>
              </div>
              {blog.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {blog.title}
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link href="/blogs">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to All Blogs
              </Button>
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}


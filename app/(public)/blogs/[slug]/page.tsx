import { notFound } from "next/navigation";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { BlogDetailClient } from "./blog-detail-client";

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

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let blog: Blog | null = null;
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.blogs.getBySlug(slug));
    
    if (response.success && response.data) {
      blog = response.data;
    } else if (response.blogId) {
      blog = response;
    } else {
      blog = null;
    }
  } catch (err: any) {
    console.error("Failed to fetch blog:", err);
    if (err.status === 404) {
      notFound();
    }
    error = err.message || "Failed to load blog";
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <BlogDetailClient blog={blog} error={error} />
      </main>
      
      <Footer />
    </div>
  );
}


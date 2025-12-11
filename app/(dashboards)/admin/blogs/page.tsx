import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { BlogsPageClient } from "./blogs-client";

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

export default async function BlogsPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Fetch blogs on server
  let blogs: Blog[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.blogs.get());
    
    if (Array.isArray(response)) {
      blogs = response;
    } else if (response.success && response.data && Array.isArray(response.data)) {
      blogs = response.data;
    } else if (response.data && Array.isArray(response.data.blogs)) {
      blogs = response.data.blogs;
    } else if (Array.isArray(response.blogs)) {
      blogs = response.blogs;
    } else {
      blogs = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch blogs:", err);
    error = err.message || "Failed to load blogs";
  }

  return <BlogsPageClient initialBlogs={blogs} error={error} />;
}


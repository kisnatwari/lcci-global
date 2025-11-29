import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { BlogsListingClient } from "./blogs-listing-client";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export default async function BlogsPage() {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <PageHeader
          badge={{ icon: "📝", text: "Latest Updates" }}
          title="Our"
          titleHighlight="Blog"
          description="Stay updated with the latest news, insights, and updates from LCCI Global"
        />

        <BlogsListingClient initialBlogs={blogs} error={error} />
      </main>
      
      <Footer />
    </div>
  );
}


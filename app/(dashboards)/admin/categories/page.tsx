import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { CategoriesPageClient } from "./categories-client";

type Category = {
  categoryId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    courses: number;
  };
};

export default async function CategoriesPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Fetch categories on server
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.categories.get());
    
    if (response.success && response.data && Array.isArray(response.data.categories)) {
      categories = response.data.categories;
    } else if (response.data && Array.isArray(response.data.categories)) {
      categories = response.data.categories;
    } else if (response.categories && Array.isArray(response.categories)) {
      categories = response.categories;
    } else if (Array.isArray(response)) {
      categories = response;
    } else {
      categories = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch categories:", err);
    error = err.message || "Failed to load categories";
  }

  return <CategoriesPageClient initialCategories={categories} error={error} />;
}

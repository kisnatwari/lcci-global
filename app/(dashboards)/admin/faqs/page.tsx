import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { FAQsPageClient } from "./faqs-client";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";

type FAQ = {
  faqId: string;
  question: string;
  answer: string;
  isActive: boolean;
  orderIndex: number;
};

export default async function FAQsPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Fetch FAQs from API
  let faqs: FAQ[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.faqs.get());
    
    // Handle API response structure: array of FAQs
    if (Array.isArray(response)) {
      faqs = response;
    } else if (response.success && response.data && Array.isArray(response.data)) {
      faqs = response.data;
    } else if (response.data && Array.isArray(response.data)) {
      faqs = response.data;
    } else {
      faqs = [];
    }
  } catch (err: any) {
    console.error("Failed to fetch FAQs:", err);
    error = err.message || "Failed to load FAQs";
  }

  return <FAQsPageClient initialFAQs={faqs} error={error} />;
}


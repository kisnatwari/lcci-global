import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { FAQsPageClient } from "./faqs-client";
import { getFAQs } from "@/lib/faqs/static-store";

export default async function FAQsPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/?login=true");
  }

  // Get FAQs from static store (will be replaced with API call later)
  const faqs = getFAQs();

  return <FAQsPageClient initialFAQs={faqs} />;
}


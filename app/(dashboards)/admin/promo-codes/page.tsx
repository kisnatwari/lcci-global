import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import { getServerApiClient } from "@/lib/api/server-client";
import { ENDPOINTS } from "@/lib/api/config";
import { PromoCodesPageClient } from "./promo-codes-client";

type PromoCode = {
  promoId: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  value: number | string;
  maxUses: number;
  usedCount?: number;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default async function PromoCodesPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/admin-login");
  }

  // Fetch promo codes on server
  let promoCodes: PromoCode[] = [];
  let error: string | null = null;

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.get(ENDPOINTS.promoCodes.get());
    
    // Handle nested response structure: { success, data: { promoCodes: [...] } }
    let rawCodes: any[] = [];
    if (response.success && response.data && response.data.promoCodes && Array.isArray(response.data.promoCodes)) {
      rawCodes = response.data.promoCodes;
    } else if (response.data && response.data.promoCodes && Array.isArray(response.data.promoCodes)) {
      rawCodes = response.data.promoCodes;
    } else if (Array.isArray(response)) {
      rawCodes = response;
    } else if (response.data && Array.isArray(response.data)) {
      rawCodes = response.data;
    }
    
    // Normalize all promo codes
    promoCodes = rawCodes.map((code: any) => ({
      ...code,
      promoId: code.promoId || code.id, // Handle both promoId and id
      value: typeof code.value === 'string' ? parseFloat(code.value) : (code.value || 0),
      maxUses: code.maxUses || 0,
      usedCount: code.usedCount || 0,
      isActive: code.isActive !== undefined ? code.isActive : true,
      description: code.description || "",
    }));
  } catch (err: any) {
    console.error("Failed to fetch promo codes:", err);
    error = err.message || "Failed to load promo codes";
  }

  return <PromoCodesPageClient initialPromoCodes={promoCodes} error={error} />;
}


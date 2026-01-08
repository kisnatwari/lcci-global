import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import BulkCertifyClient from "./bulk-certify-client";

export default async function BulkCertifyPage() {
  // Require admin role
  try {
    await requireRole("admin");
  } catch (error) {
    redirect("/?login=true");
  }

  return <BulkCertifyClient />;
}

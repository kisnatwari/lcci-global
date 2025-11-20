import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/server-auth";
import StudentDashboardClient from "./layout-client";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Secure the student dashboard - require "learner" role
  try {
    await requireRole("learner");
  } catch (error) {
    // requireRole will redirect if not authenticated
    redirect("/?login=true");
  }

  return <StudentDashboardClient>{children}</StudentDashboardClient>;
}

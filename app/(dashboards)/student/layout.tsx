"use client";

import { useState } from "react";
import {
  StudentDesktopNavigation,
  StudentMobileNavigation,
} from "@/components/dashboards/student/StudentNavigation";
import { cn } from "@/lib/utils";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <StudentMobileNavigation />
        <div className="mt-6 flex gap-6">
          <aside
            className={cn(
              "hidden shrink-0 transition-[width] duration-200 lg:block",
              isCollapsed ? "w-20" : "w-64"
            )}
          >
            <StudentDesktopNavigation
              collapsed={isCollapsed}
              onToggle={() => setIsCollapsed((prev) => !prev)}
            />
          </aside>
          <main className="flex-1 space-y-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

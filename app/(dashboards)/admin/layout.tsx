import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/dashboards/admin/AdminSidebar";
import { AdminHeader } from "@/components/dashboards/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Unique background decorative elements for entire layout */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          {/* Large gradient mesh */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[color:var(--brand-blue)]/3 via-[color:var(--brand-cyan)]/2 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[color:var(--brand-cyan)]/3 via-[color:var(--brand-blue)]/2 to-transparent rounded-full blur-3xl" />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_2px_2px,rgb(0,174,239)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>
        
        <AdminSidebar />
        <SidebarInset className="flex flex-col h-screen w-full min-w-0 overflow-hidden relative">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 relative bg-gradient-to-br from-background via-muted/10 to-muted/20 min-w-0">
            {/* Unique decorative background elements for main content */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Animated gradient mesh for content area */}
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[color:var(--brand-blue)]/4 via-[color:var(--brand-cyan)]/3 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
              <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-[color:var(--brand-cyan)]/4 via-[color:var(--brand-blue)]/2 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
              <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-l from-[color:var(--brand-blue)]/3 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '4s' }} />
              
              {/* Subtle radial grid pattern */}
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_2px_2px,rgb(0,174,239)_1px,transparent_0)] bg-[size:32px_32px]" />
              
              {/* Geometric accent lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color:var(--brand-blue)]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color:var(--brand-cyan)]/10 to-transparent" />
              
              {/* Vertical accent on the right */}
              <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[color:var(--brand-blue)]/5 to-transparent" />
            </div>
            
            {/* Content wrapper with subtle effects */}
            <div className="relative z-10 w-full min-w-0 max-w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


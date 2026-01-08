"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api/client";
import {
  LayoutDashboard,
  FolderTree,
  Users,
  BookOpen,
  LogOut,
  Building2,
  Tag,
  GraduationCap,
  FileText,
  HelpCircle,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/lib/auth";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Categories",
    icon: FolderTree,
    href: "/admin/categories",
  },
  {
    title: "Courses",
    icon: BookOpen,
    href: "/admin/courses",
  },
  {
    title: "Training Centres",
    icon: Building2,
    href: "/admin/training-centres",
  },
  {
    title: "Promo Codes",
    icon: Tag,
    href: "/admin/promo-codes",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Enrollments",
    icon: ClipboardList,
    href: "/admin/enrollments",
  },
  {
    title: "SQA Students",
    icon: GraduationCap,
    href: "/admin/sqa-students",
  },
  {
    title: "Blogs",
    icon: FileText,
    href: "/admin/blogs",
  },
  {
    title: "FAQs",
    icon: HelpCircle,
    href: "/admin/faqs",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/?login=true");
  };

  return (
    <Sidebar className="border-r border-border/50 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      {/* Unique decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient mesh */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[color:var(--brand-blue)]/8 via-[color:var(--brand-cyan)]/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-muted/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-4 w-24 h-24 bg-[color:var(--brand-blue)]/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-4 w-16 h-16 bg-[color:var(--brand-cyan)]/10 rounded-full blur-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgb(0,174,239)_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      {/* Enhanced header with unique design */}
      <div className="relative p-6 border-b border-border/50 bg-gradient-to-br from-[color:var(--brand-blue)]/5 via-background to-background">
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[color:var(--brand-blue)]/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[color:var(--brand-cyan)]/5 to-transparent rounded-tr-full" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {/* Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="LCCI Global Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground tracking-tight">Admin Panel</h2>
              <p className="text-xs text-muted-foreground font-medium">LCCI Global</p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-foreground">System Active</span>
          </div>
        </div>
      </div>

      <SidebarContent className="p-4 relative z-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                // Fix: Only match exact path for Dashboard, allow subpaths for others
                const isActive = item.href === "/admin"
                  ? pathname === "/admin" || pathname === "/admin/"
                  : pathname === item.href || pathname?.startsWith(item.href + "/");
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      className="relative group overflow-hidden"
                    >
                      <Link href={item.href} className="relative z-10">
                        {/* Active background gradient */}
                        {isActive && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-blue)]/10 via-[color:var(--brand-cyan)]/5 to-transparent" />
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[color:var(--brand-blue)] via-[color:var(--brand-cyan)] to-[color:var(--brand-blue)] rounded-r-full shadow-lg shadow-[color:var(--brand-blue)]/30" />
                          </>
                        )}
                        
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        
                        <Icon className="relative z-10 w-5 h-5" />
                        <span className="relative z-10 font-medium">{item.title}</span>
                        
                        {/* Active indicator dot */}
                        {isActive && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[color:var(--brand-blue)] shadow-sm shadow-[color:var(--brand-blue)]/50" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Enhanced logout section */}
      <div className="mt-auto border-t border-border/50 bg-gradient-to-t from-muted/40 to-transparent relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-blue)]/5 via-transparent to-transparent" />
        <SidebarMenu className="p-4">
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="relative group overflow-hidden text-destructive hover:text-destructive w-full"
            >
              <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <LogOut className="relative z-10" />
              <span className="relative z-10 font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}


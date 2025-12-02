"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { logout, getAuthSession, getUserRole, getAuthToken, clearAuthSession, refreshAccessToken, shouldRefreshToken } from "@/lib/auth";
import { isTokenExpired } from "@/lib/auth/token";

export function AdminHeader() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkAuthStatus = async () => {
    const session = getAuthSession();
    const token = getAuthToken();
    
    if (session && token) {
      const tokenExpired = isTokenExpired(token);
      
      if (tokenExpired) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          setUserRole(undefined);
          clearAuthSession();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          return;
        }
      } else if (shouldRefreshToken(token)) {
        await refreshAccessToken();
      }
      
      const role = getUserRole();
      setUserRole(role);
    } else {
      setUserRole(undefined);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserRole(undefined);
    router.push('/?login=true');
  };

  // Get user info from session (stored from login response)
  const session = getAuthSession();
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (session?.userName) {
      return session.userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return "AD"; // Default admin initials
  };

  // Get user display name
  const getUserName = () => {
    return session?.userName || "Admin";
  };
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border/50 bg-gradient-to-r from-background via-background/95 to-muted/30 px-6 shrink-0 relative overflow-hidden w-full min-w-0">
      {/* Unique decorative background layers */}
      <div className="absolute inset-0">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-blue)]/3 via-transparent to-[color:var(--brand-cyan)]/3" />
        
        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,rgb(0,174,239)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0,174,239)_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating gradient orbs */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-[color:var(--brand-blue)]/8 via-[color:var(--brand-cyan)]/5 to-transparent rounded-full blur-3xl -mr-40 -mt-40 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute left-1/4 top-0 w-48 h-48 bg-gradient-to-br from-[color:var(--brand-cyan)]/6 to-transparent rounded-full blur-2xl -mt-24 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[color:var(--brand-blue)]/20 to-transparent" />
      </div>
      
      <div className="relative z-10 flex items-center gap-4 w-full min-w-0">
        {/* Enhanced sidebar trigger */}
        <div className="relative">
          <SidebarTrigger className="relative hover:bg-accent/50 transition-colors" />
        </div>
        
        {/* Enhanced search with unique styling */}
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <div className="relative flex-1 max-w-md group min-w-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[color:var(--brand-blue)]/10 to-[color:var(--brand-cyan)]/10 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-[color:var(--brand-blue)] transition-colors" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="pl-10 pr-4 bg-background/60 backdrop-blur-md border-border/60 focus:border-[color:var(--brand-blue)]/40 focus:ring-[color:var(--brand-blue)]/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Enhanced action buttons */}
        <div className="flex items-center gap-2">
          {/* Enhanced user menu */}
          {isMounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent/80 transition-all border-2 border-transparent hover:border-[color:var(--brand-blue)]/30 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-[color:var(--brand-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Avatar className="relative z-10 ring-2 ring-[color:var(--brand-blue)]/20 group-hover:ring-[color:var(--brand-blue)]/40 transition-all shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-[color:var(--brand-blue)] via-[color:var(--brand-cyan)] to-[color:var(--brand-blue)] text-white font-bold shadow-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border/50 shadow-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{getUserName()}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole || 'Admin'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push('/admin/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}


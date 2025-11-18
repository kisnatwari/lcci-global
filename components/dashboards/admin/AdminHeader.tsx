"use client";

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
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
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
          {/* Notification button with unique design */}
          <button className="relative rounded-lg p-2.5 hover:bg-accent/80 transition-all group border border-transparent hover:border-[color:var(--brand-blue)]/20">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bell className="h-5 w-5 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background shadow-sm animate-pulse" />
          </button>
          
          {/* Enhanced user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent/80 transition-all border-2 border-transparent hover:border-[color:var(--brand-blue)]/30 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-[color:var(--brand-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Avatar className="relative z-10 ring-2 ring-[color:var(--brand-blue)]/20 group-hover:ring-[color:var(--brand-blue)]/40 transition-all shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-[color:var(--brand-blue)] via-[color:var(--brand-cyan)] to-[color:var(--brand-blue)] text-white font-bold shadow-lg">
                    AD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border/50 shadow-xl">
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


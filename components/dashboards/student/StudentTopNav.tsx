"use client";

import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Settings,
  Menu,
  LogOut,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { logout } from "@/lib/auth";
import { apiClient, ENDPOINTS } from "@/lib/api";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/student",
  },
  {
    id: "learning",
    label: "My Learning",
    icon: BookOpen,
    href: "/student/enrollments",
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Award,
    href: "/student/certificates",
  },
];

interface ProfileData {
  userId: string;
  email: string;
  username: string;
  userType: string;
  status: string;
  trainingCentreId: string | null;
  lcciGQCreditPoints: number;
  createdAt: string;
  updatedAt: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    avatarUrl: string;
    bio: string;
  } | null;
}

export function StudentTopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.profile.me());
        const profileData = response.success && response.data ? response.data : response.data || response;
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const isActive = (href: string) => {
    if (href === "/student") {
      return pathname === "/student";
    }
    return pathname.startsWith(href);
  };

  const getUserInitials = () => {
    if (!profile) return "U";
    if (profile.profile?.firstName && profile.profile?.lastName) {
      return `${profile.profile.firstName[0]}${profile.profile.lastName[0]}`.toUpperCase();
    }
    const name = profile.username || profile.email;
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getDisplayName = () => {
    if (!profile) return "User";
    if (profile.profile?.firstName && profile.profile?.lastName) {
      return `${profile.profile.firstName} ${profile.profile.lastName}`;
    }
    return profile.username || profile.email || "User";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="LCCI Global Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Student Hub</p>
              <p className="text-xs text-slate-500">LCCI GQ</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.profile?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-[color:var(--brand-blue)] text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">
                    {isLoading ? "Loading..." : getDisplayName()}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[120px]">
                    {isLoading ? "" : profile?.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-medium">
                {isLoading ? "Loading..." : getDisplayName()}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/student/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  router.push("/?login=true");
                }}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-base font-semibold text-slate-900">
                  Navigate
                </DrawerTitle>
                <DrawerDescription>Quickly jump between sections.</DrawerDescription>
              </DrawerHeader>
              <div className="space-y-2 px-4 pb-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <Link
                    href="/student/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}


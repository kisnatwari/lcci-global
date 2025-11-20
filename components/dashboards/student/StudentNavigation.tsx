"use client";

import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Target,
  Award,
  BarChart3,
  User,
  Settings,
  Menu,
  Sparkles,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { getAuthSession, logout } from "@/lib/auth";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { useRouter } from "next/navigation";

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
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    href: "/student/achievements",
  },
  {
    id: "progress",
    label: "Progress",
    icon: Target,
    href: "/student/progress",
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Award,
    href: "/student/certificates",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/student/analytics",
  },
];

const useActiveLink = () => {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/student") {
      return pathname === "/student";
    }
    return pathname.startsWith(href);
  };
};

interface DesktopNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface ProfileData {
  profileId: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  bio: string | null;
  user: {
    email: string;
    username: string;
    userType: string;
    status: string;
  };
}

export function StudentDesktopNavigation({ collapsed, onToggle }: DesktopNavProps) {
  const isActive = useActiveLink();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {data} = await apiClient.get(ENDPOINTS.profile.me());
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Get user initials from username or email
  const getUserInitials = () => {
    if (!profile) return "U";
    const name = profile.user.username || profile.user.email;
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!profile) return "User";
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.user.username || profile.user.email || "User";
  };

  return (
    <aside
      className={cn(
        "sticky top-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all",
        collapsed ? "items-center" : "p-6"
      )}
    >
      <div className={cn("mb-6 flex items-center gap-3", collapsed && "justify-center gap-0")}>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <Link href="/" className="transition-colors hover:text-slate-900">
            <p className="text-sm font-semibold text-slate-900">Student Hub</p>
            <p className="text-xs text-slate-500">LCCI Global</p>
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          className={cn(
            "ml-auto rounded-full border border-slate-200 bg-white p-1 text-slate-500 transition",
            collapsed && "absolute right-3 top-3"
          )}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              collapsed && "justify-center px-0 py-2"
            )}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <>
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Current streak</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">7 days</p>
          </div>

          {/* User Account Menu */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-slate-100">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-slate-900 text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {isLoading ? "Loading..." : getDisplayName()}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {isLoading ? "" : profile?.user.email}
                    </p>
                  </div>
                </button>
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
                <DropdownMenuItem asChild>
                  <Link href="/student/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    window.location.href = "/?login=true";
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </aside>
  );
}

export function StudentMobileNavigation() {
  const isActive = useActiveLink();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {data} = await apiClient.get(ENDPOINTS.profile.me());
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Get user initials from username or email
  const getUserInitials = () => {
    if (!profile) return "U";
    const name = profile.user.username || profile.user.email;
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!profile) return "User";
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.user.username || profile.user.email || "User";
  };

  return (
    <header className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Student Hub</p>
            <p className="text-xs text-slate-500">LCCI Global</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            🔥 7 days
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full border border-slate-200">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-slate-900 text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-medium">
                {isLoading ? "Loading..." : getDisplayName()}
              </DropdownMenuLabel>
              {profile && (
                <p className="px-2 py-1.5 text-xs text-slate-500">{profile.user.email}</p>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/student/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/student/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
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

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
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
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                      isActive(item.href)
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

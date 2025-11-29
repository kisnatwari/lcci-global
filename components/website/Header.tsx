"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Sparkles, LogOut, LayoutDashboard, User2, School, GraduationCap, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAuthSession, getUserRole, getAuthToken, clearAuthSession, refreshAccessToken, shouldRefreshToken } from "@/lib/auth";
import { logout } from "@/lib/auth";
import { isTokenExpired } from "@/lib/auth/token";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registrationCentreType, setRegistrationCentreType] = useState<"SQA" | "Cambridge" | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  const checkAuthStatus = async () => {
    const session = getAuthSession();
    const token = getAuthToken();
    
    // Check if session exists and token is not expired
    if (session && token) {
      const tokenExpired = isTokenExpired(token);
      
      if (tokenExpired) {
        // Token expired, try to refresh it
        const newToken = await refreshAccessToken();
        if (!newToken) {
          // Refresh failed, clear session
          setIsLoggedIn(false);
          setUserRole(undefined);
          clearAuthSession();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          return;
        }
        // Token refreshed successfully, continue with updated session
      } else if (shouldRefreshToken(token)) {
        // Token is about to expire soon (within 2 minutes), refresh proactively
        await refreshAccessToken();
      }
      
      // Token is valid (either original or newly refreshed)
      const role = getUserRole();
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      // No session or token
      setIsLoggedIn(false);
      setUserRole(undefined);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Check auth status on mount
    checkAuthStatus();
    
    // Listen for login events (when user logs in via modal)
    const handleLoginSuccess = () => {
      checkAuthStatus();
    };
    window.addEventListener('loginSuccess', handleLoginSuccess);
    
    // Also check periodically (in case session changes elsewhere or token expires)
    // Check every 30 seconds to catch token expiration
    const interval = setInterval(checkAuthStatus, 30000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      clearInterval(interval);
    };
  }, []);

  // Check auth status when pathname changes (e.g., after redirect)
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setUserRole(undefined);
    // Redirect to home with login query parameter to open modal
    router.push('/?login=true');
  };

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'student' || userRole === 'learner') return '/student';
    return '/student'; // default
  };

  const getDashboardLabel = () => {
    if (userRole === 'admin') return 'Admin Dashboard';
    if (userRole === 'student' || userRole === 'learner') return 'Student Dashboard';
    return 'Dashboard';
  };

  // Get user info from session (stored from login response)
  const session = getAuthSession();
  const userInitials = session?.userName
    ? session.userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    : 'U';
  const userName = session?.userName || 'User';

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-white shadow-2xl border-b-2 border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <Logo />
            </Link>

            {/* Desktop Navigation - Completely New Design */}
            <nav className="hidden lg:flex items-center">
              <div className={`flex items-center rounded-2xl transition-all duration-700 ${
                isScrolled
                  ? "bg-slate-50 px-2 py-2 gap-1"
                  : "bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2.5 gap-2"
              }`}>
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isScrolled
                          ? isActive
                            ? "bg-[color:var(--brand-blue)] text-white shadow-lg shadow-[color:var(--brand-blue)]/30"
                            : "text-slate-700 hover:bg-white hover:shadow-md"
                          : isActive
                            ? "bg-white/30 text-white backdrop-blur-sm"
                            : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* CTA Buttons / User Menu - New Design */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isScrolled
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-700"
                          : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[color:var(--brand-blue)] text-white text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden xl:block">{userName}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{userName}</p>
                        <p className="text-xs text-slate-500 capitalize">{userRole || 'User'}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardPath()}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {getDashboardLabel()}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isScrolled
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative px-6 py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 flex items-center gap-2 ${
                          isScrolled
                            ? "bg-[color:var(--brand-blue)] text-white shadow-lg"
                            : "bg-white text-[color:var(--brand-blue)] shadow-lg"
                        }`}
                      >
                        <span className="relative z-10">Register</span>
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Register as</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setRegistrationCentreType(null);
                          setIsRegistrationModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <User2 className="w-4 h-4 mr-2" />
                        Regular Learner
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRegistrationCentreType("SQA");
                          setIsRegistrationModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <School className="w-4 h-4 mr-2" />
                        SQA Student
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setRegistrationCentreType("Cambridge");
                          setIsRegistrationModalOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Cambridge Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            {mounted && (
              <Drawer open={mobileDrawerOpen} onOpenChange={(open) => {
                setMobileDrawerOpen(open);
                if (!open) setShowRegisterOptions(false);
              }}>
                <DrawerTrigger asChild>
                  <button
                    className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                      isScrolled
                        ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                        : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                    }`}
                    aria-label="Menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </DrawerTrigger>
                <DrawerContent className="bg-white">
                  <DrawerHeader className="border-b border-slate-200 pb-4">
                    <DrawerTitle>
                      <div className="flex items-center gap-2 text-slate-900">
                        <Sparkles className="w-5 h-5 text-[color:var(--brand-blue)]" />
                        <span className="text-xl font-bold">Menu</span>
                      </div>
                    </DrawerTitle>
                  </DrawerHeader>

                  <div className="px-4 pb-8 max-h-[80vh] overflow-y-auto">
                    {/* Mobile Menu Content */}
                    <nav className="flex flex-col gap-2 mt-6">
                      {navLinks.map((link) => {
                        const isActive = isLinkActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={`group flex items-center justify-between px-5 py-4 rounded-xl font-semibold transition-all ${
                              isActive
                                ? "bg-[color:var(--brand-blue)] text-white"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{link.label}</span>
                            <ChevronRight className={`w-5 h-5 transition-transform ${
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            } group-hover:translate-x-1`} />
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Mobile CTA Buttons / User Menu */}
                    <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                      {isLoggedIn ? (
                        <>
                          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-slate-50">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-[color:var(--brand-blue)] text-white">
                                {userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">{userName}</p>
                              <p className="text-xs text-slate-500 capitalize">{userRole || 'User'}</p>
                            </div>
                          </div>
                          <Link
                            href={getDashboardPath()}
                            onClick={() => setMobileDrawerOpen(false)}
                            className="w-full px-5 py-4 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                          >
                            <LayoutDashboard className="w-5 h-5" />
                            {getDashboardLabel()}
                          </Link>
                          <button
                            onClick={() => {
                              setMobileDrawerOpen(false);
                              handleLogout();
                            }}
                            className="w-full px-5 py-4 rounded-xl font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                          >
                            <LogOut className="w-5 h-5" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setMobileDrawerOpen(false);
                              setIsLoginModalOpen(true);
                            }}
                            className="w-full px-5 py-4 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all"
                          >
                            Login
                          </button>
                          <div className="space-y-2">
                            <button
                              onClick={() => setShowRegisterOptions(!showRegisterOptions)}
                              className="w-full px-5 py-4 rounded-xl font-bold text-white bg-[color:var(--brand-blue)] hover:opacity-90 transition-all flex items-center justify-between"
                            >
                              <span>Register</span>
                              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showRegisterOptions ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {showRegisterOptions && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="space-y-2 overflow-hidden"
                                >
                                  <button
                                    onClick={() => {
                                      setMobileDrawerOpen(false);
                                      setShowRegisterOptions(false);
                                      setRegistrationCentreType(null);
                                      setIsRegistrationModalOpen(true);
                                    }}
                                    className="w-full px-5 py-3 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-3"
                                  >
                                    <User2 className="w-5 h-5 text-slate-600" />
                                    Regular Learner
                                  </button>
                                  <button
                                    onClick={() => {
                                      setMobileDrawerOpen(false);
                                      setShowRegisterOptions(false);
                                      setRegistrationCentreType("SQA");
                                      setIsRegistrationModalOpen(true);
                                    }}
                                    className="w-full px-5 py-3 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-3"
                                  >
                                    <School className="w-5 h-5 text-slate-600" />
                                    SQA Student
                                  </button>
                                  <button
                                    onClick={() => {
                                      setMobileDrawerOpen(false);
                                      setShowRegisterOptions(false);
                                      setRegistrationCentreType("Cambridge");
                                      setIsRegistrationModalOpen(true);
                                    }}
                                    className="w-full px-5 py-3 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-3"
                                  >
                                    <GraduationCap className="w-5 h-5 text-slate-600" />
                                    Cambridge Student
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
            {!mounted && (
              <button
                className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                }`}
                aria-label="Menu"
                onClick={() => setMobileDrawerOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

      </motion.header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onOpenRegister={() => {
        setIsLoginModalOpen(false);
        setRegistrationCentreType(null);
        setIsRegistrationModalOpen(true);
      }} />
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setRegistrationCentreType(null);
        }} 
        preSelectedCentreType={registrationCentreType}
      />
    </>
  );
}

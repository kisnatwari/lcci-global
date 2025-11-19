"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";
import Logo from "./Logo";
import LoginModal from "./LoginModal";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/student", label: "Student Hub" },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

            {/* CTA Buttons - New Design */}
            <div className="hidden lg:flex items-center gap-3">
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLoginModalOpen(true);
                  // Set register mode when opening from Get Started
                  setTimeout(() => {
                    const event = new CustomEvent('openRegister');
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className={`group relative px-6 py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 ${
                  isScrolled
                    ? "bg-[color:var(--brand-blue)] text-white shadow-lg"
                    : "bg-white text-[color:var(--brand-blue)] shadow-lg"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            {mounted && (
              <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
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

                    {/* Mobile CTA Buttons */}
                    <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                      <button
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          setIsLoginModalOpen(true);
                        }}
                        className="w-full px-5 py-4 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          setIsLoginModalOpen(true);
                          setTimeout(() => {
                            const event = new CustomEvent('openRegister');
                            window.dispatchEvent(event);
                          }, 100);
                        }}
                        className="w-full px-5 py-4 rounded-xl font-bold text-white bg-[color:var(--brand-blue)] hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        Get Started
                        <ChevronRight className="w-5 h-5" />
                      </button>
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

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

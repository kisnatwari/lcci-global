"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import LoginModal from "./LoginModal";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/contact-us", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-[color:var(--brand-blue)]/20"
            : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Logo className="group" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? "text-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/10"
                        : "text-gray-700 hover:text-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/5"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[color:var(--brand-blue)] rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-[color:var(--brand-blue)] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="glossy-button relative px-7 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span className="relative z-10">Get Started</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-[color:var(--brand-blue)]/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in-up">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        isActive
                        ? "text-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/10"
                        : "text-gray-700 hover:text-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="block w-full px-4 py-2 text-center font-semibold text-gray-700 hover:text-[color:var(--brand-blue)] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="glossy-button block w-full px-4 py-2 text-center font-bold text-white rounded-xl shadow-lg relative"
                  >
                    <span className="relative z-10">Get Started</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

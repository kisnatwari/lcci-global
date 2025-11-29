"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Facebook, Linkedin, Youtube } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

interface Category {
  categoryId: string;
  name: string;
  description: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.categories.get());
        
        // Handle different response structures
        let categoriesData: Category[] = [];
        if (response.success && response.data) {
          if (Array.isArray(response.data.categories)) {
            categoriesData = response.data.categories;
          } else if (Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (Array.isArray(response)) {
            categoriesData = response;
          }
        }

        // Shuffle and take 4 random categories
        const shuffled = [...categoriesData].sort(() => Math.random() - 0.5);
        setCategories(shuffled.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Fallback to empty array on error
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);
  return (
    <>
      <footer className="relative bg-slate-900 text-white">

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Logo className="mb-6" />
            <p className="text-blue-200 leading-relaxed mb-6">
              Award-winning qualifications in Business, IT, English and Professional Skills since 1887.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/LCCIGQ.NP"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/lcci-gq/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@lcciglobalqualifications274"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
          </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Courses", href: "/courses" },
                { label: "About", href: "/about" },
                { label: "Contact Us", href: "/contact-us" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                </Link>
              </li>
              ))}
            </ul>
          </motion.div>

          {/* Programmes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6">Programmes</h4>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.categoryId}>
                    <Link
                      href={`/courses?category=${category.categoryId}`}
                      className="group inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback while loading or if no categories
                [
                  { label: "Guided Courses", href: "/courses?type=guided" },
                  { label: "Self-Paced Courses", href: "/courses?type=self-paced" },
                  { label: "Communication Labs", href: "/courses" },
                  { label: "Leadership Tracks", href: "/courses" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-blue-300 mb-1">Email</div>
                  <a href="mailto:info@lccigq.com" className="text-white hover:text-[color:var(--brand-cyan)] transition-colors">
                    info@lccigq.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-blue-300 mb-1">Phone</div>
                  <a href="tel:+977015442886" className="text-white hover:text-[color:var(--brand-cyan)] transition-colors">
                    +977-01-5442886
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
          </div>
          <div>
                  <div className="text-sm text-blue-300 mb-1">Address</div>
                  <a 
                    href="https://maps.app.goo.gl/fiajArULXFvQ13NM6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[color:var(--brand-cyan)] transition-colors leading-relaxed text-sm block"
                  >
                    Ekantakuna Marg, Jawalakhel<br />
                    Lalitpur, Nepal - 44700
                  </a>
                </div>
              </li>
            </ul>
          </motion.div>
          </div>
          
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-200 text-sm">
              © {new Date().getFullYear()} LCCI Global Qualifications PVT.LTD. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm items-center">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </a>
              <Link
                href="/admin-login"
                className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Login
              </Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
    </>
  );
}

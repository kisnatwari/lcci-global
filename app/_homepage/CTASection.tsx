"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-12 lg:p-16 text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Start Your Journey Today
            </motion.div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Ready to Transform
              <span className="block text-[color:var(--brand-blue)] mt-2">
                Your Career?
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of learners who have accelerated their careers with
              industry-recognized LCCI qualifications. Your success story starts here.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/courses"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[color:var(--brand-blue)] px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 hover:border-[color:var(--brand-blue)] hover:text-[color:var(--brand-blue)] transition-all duration-300"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">25,000+ Active Learners</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[color:var(--brand-blue)] rounded-full" />
                <span className="text-sm font-medium">120+ Partner Institutions</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[color:var(--brand-cyan)] rounded-full" />
                <span className="text-sm font-medium">40+ Programmes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

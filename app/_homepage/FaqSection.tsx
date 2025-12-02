"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getActiveFAQs, type FAQ } from "@/lib/faqs/static-store";

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    // Load FAQs from static store (will be replaced with API call later)
    const activeFAQs = getActiveFAQs();
    setFaqs(activeFAQs);
  }, []);
  return (
    <section className="relative py-24 bg-slate-50">

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
            <HelpCircle className="w-4 h-4" />
            FAQs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Common Questions
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about LCCI qualifications
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No FAQs available at the moment.</p>
            </div>
          ) : (
            faqs.map((faq, idx) => (
              <motion.details
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-[color:var(--brand-blue)]/30 transition-all duration-300 overflow-hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-bold text-slate-900 hover:text-[color:var(--brand-blue)] transition-colors">
                  <span className="flex-1 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] group-hover:scale-110 flex items-center justify-center text-white shadow-lg transition-transform">
                    <span className="text-xl group-open:hidden">+</span>
                    <span className="text-xl hidden group-open:inline">−</span>
                  </div>
                </summary>
                <div className="px-6 md:px-8 pb-6 pt-2">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6">
                    <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.details>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Contact Our Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}

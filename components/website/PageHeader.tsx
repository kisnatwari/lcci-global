"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  badge?: { icon: string; text: string };
  title: string;
  titleHighlight?: string;
  description: string;
}

export default function PageHeader({ badge, title, titleHighlight, description }: PageHeaderProps) {
  return (
    <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 bg-slate-900">

      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
            {badge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 mb-4"
            >
              <span className="text-lg">{badge.icon}</span>
              <span className="text-xs font-semibold text-blue-200">{badge.text}</span>
            </motion.div>
            )}
            
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          >
              {title}
              {titleHighlight && (
              <span className="block text-[color:var(--brand-cyan)]">
                    {titleHighlight}
                  </span>
              )}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

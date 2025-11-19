"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Building2, TrendingUp } from "lucide-react";

export default function StatsBannerSection() {
  const stats = [
    {
      icon: BookOpen,
      value: "40+",
      label: "Courses",
      description: "Programmes available",
      color: "from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)]",
    },
    {
      icon: Users,
      value: "25K+",
      label: "Learners",
      description: "Trained globally",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: GraduationCap,
      value: "120+",
      label: "Tutors",
      description: "Expert instructors",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Building2,
      value: "128+",
      label: "Partners",
      description: "Institutions worldwide",
      color: "from-blue-600 to-teal-600",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50" />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-bl from-[color:var(--brand-cyan)]/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--brand-blue)]/10 to-[color:var(--brand-cyan)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
            <TrendingUp className="w-4 h-4" />
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join a global community of learners achieving their professional goals
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-[color:var(--brand-blue)]/30 transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-5xl font-bold text-slate-900 mb-2 group-hover:scale-110 transition-transform duration-300 origin-left">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-lg font-semibold text-slate-900 mb-1">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-slate-600">
                    {stat.description}
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--brand-blue)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

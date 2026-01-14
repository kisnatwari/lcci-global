"use client";

import { motion } from "framer-motion";
import { Award, Users, Globe2, TrendingUp } from "lucide-react";

const outcomes = [
  {
    icon: Users,
    value: "25,000+",
    label: "Learners Trained",
    description: "Students and professionals across 50+ countries",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe2,
    value: "80+",
    label: "Partner Institutions",
    description: "Schools, colleges and training centers worldwide",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Award,
    value: "40+",
    label: "Active Programmes",
    description: "Updated curricula across multiple disciplines",
    gradient: "from-[color:var(--brand-blue)] to-blue-600",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Success Rate",
    description: "Learners achieving their certification goals",
    gradient: "from-orange-500 to-amber-500",
  },
];

export default function OutcomesSection() {
  return (
    <section className="relative py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
            <TrendingUp className="w-4 h-4" />
            Proven Results
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Global Impact
          </h2>
          <p className="text-xl text-slate-600">
            Delivering measurable outcomes for learners and institutions worldwide
          </p>
        </motion.div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <div className="relative h-full bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-[color:var(--brand-blue)] hover:shadow-lg transition-all duration-300 text-center">
                  {/* Icon */}
                  <div className="relative inline-flex mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[color:var(--brand-blue)]/10 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-[color:var(--brand-blue)]" />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    {outcome.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                    {outcome.label}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

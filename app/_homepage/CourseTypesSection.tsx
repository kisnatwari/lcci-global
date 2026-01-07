"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Laptop2, Zap, ArrowRight } from "lucide-react";

const learningModes = [
  {
    title: "Guided Learning",
    subtitle: "Perfect for institutions",
    description: "Instructor-led cohorts with structured timetables, live sessions and dedicated support for schools and training centers.",
    icon: Users,
    features: [
      "Live online sessions",
      "Expert instructor support",
      "Cohort-based learning",
      "Regular assessments",
    ],
    href: "/courses?type=guided",
    gradient: "from-[color:var(--brand-blue)] to-blue-600",
    accentColor: "blue",
  },
  {
    title: "Self-Paced Learning",
    subtitle: "Flexible for professionals",
    description: "Learn on your own schedule with on-demand content, downloadable resources and flexible deadlines that fit your life.",
    icon: Laptop2,
    features: [
      "Learn anytime, anywhere",
      "Flexible deadlines",
      "Downloadable resources",
      "Progress tracking",
    ],
    href: "/courses?type=self-paced",
    gradient: "from-[color:var(--brand-cyan)] to-teal-500",
    accentColor: "cyan",
  },
];

export default function CourseTypesSection() {
  return (
    <section className="relative py-24 bg-white">
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
            <Zap className="w-4 h-4" />
            Learning Modes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Learn Your Way
          </h2>
          <p className="text-xl text-slate-600">
            Choose the learning style that matches your goals and schedule
          </p>
        </motion.div>

        {/* Learning Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {learningModes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Main Card */}
                <div className="relative h-full bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-xl overflow-hidden">
                  {/* Icon Badge */}
                  <div className="relative inline-flex">
                    <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} rounded-2xl blur-xl opacity-50`} />
                    <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.gradient} shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">
                        {mode.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500">
                        {mode.subtitle}
          </p>
        </div>
        
                    <p className="text-slate-600 leading-relaxed">
                      {mode.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 pt-2">
                      {mode.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${mode.gradient} flex items-center justify-center`}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
              ))}
                    </div>

                    {/* CTA Button */}
            <Link
                      href={mode.href}
                      className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-lg"
            >
                      Explore Programs
                      <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600">
            💡 <span className="font-semibold">Not sure which to choose?</span> Our advisors can help you find the perfect fit
          </p>
        </motion.div>
      </div>
    </section>
  );
}

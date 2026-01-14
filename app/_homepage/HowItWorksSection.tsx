"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, BookOpen, Award, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Explore Programmes",
    body: "Browse our catalogue of industry-recognized qualifications across business, IT, English and professional skills.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "02",
    title: "Enroll & Register",
    body: "Sign up through your institution or directly online. Get instant access to learning materials and support resources.",
    icon: UserCheck,
    color: "from-cyan-500 to-blue-500",
  },
  {
    step: "03",
    title: "Learn & Master",
    body: "Follow structured modules, complete assignments and get feedback from expert instructors throughout your journey.",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: "04",
    title: "Earn Certificate",
    body: "Complete assessments and receive your globally-recognized LCCI GQ certificate to advance your career.",
    icon: Award,
    color: "from-orange-500 to-amber-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your Learning Journey
          </h2>
          <p className="text-xl text-slate-600">
            From exploration to certification in four clear steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  {/* Connecting line (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-20 left-[calc(100%+16px)] w-8 h-1 bg-slate-300 z-0" />
                  )}

                  {/* Card */}
                  <div className="relative h-full bg-white border-2 border-slate-200 rounded-3xl p-8">
                    {/* Step Number Badge */}
                    <div className="absolute top-6 right-6">
                      <div className="w-12 h-12 rounded-xl bg-[color:var(--brand-blue)] flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[color:var(--brand-blue)]/10 mb-6">
                      <Icon className="w-8 h-8 text-[color:var(--brand-blue)]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-4">
            Ready to start your journey?
          </p>
          <a
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white font-bold shadow-lg"
          >
            Browse Courses
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

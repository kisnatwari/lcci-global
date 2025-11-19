"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Lightbulb, Shield, Heart, ArrowRight, Sparkles } from "lucide-react";

export default function AboutContent() {
  return (
    <div className="relative py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
            <Target className="w-4 h-4" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Empowering Global Success Through
            <span className="block text-[color:var(--brand-blue)] mt-2">
              Quality Education
            </span>
          </h2>
          <div className="space-y-4 text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
            <p>
              Since 1887, LCCI Global Qualifications has been at the forefront of professional education,
              developing practical capabilities in business, management, English, hospitality and computing
              for learners in a competitive global environment.
            </p>
            <p className="text-slate-900 font-semibold">
              We partner with schools, colleges and organizations worldwide to deliver structured,
              industry‑relevant programmes that create real opportunities.
            </p>
          </div>
        </motion.section>

        {/* What We Offer Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
              <Lightbulb className="w-4 h-4" />
              What We Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Comprehensive Programmes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Flexible, industry-aligned qualifications designed for success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Diverse Qualifications",
                description: "From entry-level certificates to advanced diplomas in business, accounting, finance and professional skills",
                icon: "🎓",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Flexible Delivery",
                description: "Guided cohorts for institutions plus self-paced options for independent learners",
                icon: "⚡",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                title: "Industry Alignment",
                description: "Programmes designed with employer expectations and global qualification frameworks in mind",
                icon: "🎯",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                title: "Ongoing Support",
                description: "Comprehensive academic, operational and marketing support for partner centers and tutors",
                icon: "🤝",
                gradient: "from-orange-500 to-amber-500",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="h-full bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-lg hover:border-[color:var(--brand-blue)] hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[color:var(--brand-blue)]/10 text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
              <Heart className="w-4 h-4" />
              Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Guided by Principles
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "Excellence",
                description: "High standards in programme design, delivery and assessment",
                icon: Shield,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                value: "Accessibility",
                description: "Making professional education reachable for diverse learners",
                icon: Heart,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                value: "Innovation",
                description: "Updating content and delivery to match changing industry needs",
                icon: Lightbulb,
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                value: "Integrity",
                description: "Transparency and responsibility in all partnerships",
                icon: Shield,
                gradient: "from-orange-500 to-amber-500",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="h-full bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg hover:border-[color:var(--brand-blue)] hover:shadow-xl transition-all duration-300 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[color:var(--brand-blue)]/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-[color:var(--brand-blue)]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.value}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 lg:p-16 text-center shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
              <Sparkles className="w-4 h-4" />
              Ready to Start?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Partner With LCCI Today
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Discover how LCCI can support your institution or advance your professional career
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Explore Programmes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

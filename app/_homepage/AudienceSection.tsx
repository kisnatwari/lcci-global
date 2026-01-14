"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    label: "Schools & Colleges",
    description: "Enhance your curriculum with industry-recognized LCCI GQ qualifications",
    points: [
      "Structured progression from foundation to advanced",
      "Full academic and assessment support",
      "Training for teachers and coordinators",
      "Marketing and enrollment assistance",
    ],
    gradient: "from-[color:var(--brand-blue)] to-blue-600",
  },
  {
    icon: Building2,
    label: "Training Providers",
    description: "Differentiate your portfolio with globally-recognized programmes",
    points: [
      "Accredited business and professional qualifications",
      "Flexible delivery models for your learners",
      "Centre branding and marketing materials",
      "Ongoing operational support",
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    label: "Working Professionals",
    description: "Upskill and advance your career with flexible learning options",
    points: [
      "Learn while working with self-paced courses",
      "Practical skills for immediate application",
      "Globally-recognized certificates",
      "Career advancement and salary growth",
    ],
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function AudienceSection() {
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
            <CheckCircle2 className="w-4 h-4" />
            Who We Serve
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Designed for Every Learner
          </h2>
          <p className="text-xl text-slate-600">
            Whether you're an institution or individual, we have the right programme for you
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative h-full bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${audience.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon Badge */}
                  <div className="relative inline-flex mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${audience.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                    <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${audience.gradient} shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {audience.label}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {audience.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {audience.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${audience.gradient} flex items-center justify-center mt-0.5`}>
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-tl ${audience.gradient} opacity-10 rounded-tl-[100px]`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 text-lg">
            💡 <span className="font-semibold">Need guidance?</span> Let us help you find the perfect programme for your goals
          </p>
        </motion.div>
      </div>
    </section>
  );
}

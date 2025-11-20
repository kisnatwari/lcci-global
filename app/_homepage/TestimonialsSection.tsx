"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "LCCI programmes have transformed our students' career prospects. The structured curriculum and industry focus make our graduates highly employable.",
    name: "Dr. Sarah Mitchell",
    role: "Academic Director",
    institution: "Global Business College",
    rating: 5,
    avatar: "SM",
    gradient: "from-[color:var(--brand-blue)] to-blue-600",
  },
  {
    quote: "The Executive Communication Lab helped me lead investor updates with confidence. The coaching and feedback changed how our clients perceive us.",
    name: "James Chen",
    role: "Regional Sales Lead",
    institution: "Executive Communication Lab – Cohort 06",
    rating: 5,
    avatar: "JC",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote: "As a training provider, partnering with LCCI has elevated our portfolio. Their support and recognized credentials give us a competitive edge.",
    name: "Maria Rodriguez",
    role: "Centre Manager",
    institution: "Excellence Training Institute",
    rating: 5,
    avatar: "MR",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 px-4 py-2 text-sm font-semibold text-orange-700 mb-6">
            <Star className="w-4 h-4 fill-current" />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Learners Worldwide
          </h2>
          <p className="text-xl text-slate-600">
            Real experiences from students, institutions and professionals
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
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
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-slate-900" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 fill-yellow-400 text-yellow-400`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-slate-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100 relative z-10">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  
                  <div>
                    <div className="font-bold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-tl ${testimonial.gradient} opacity-10 rounded-tl-[100px]`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">4.9/5</div>
            <div className="text-sm text-slate-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">98%</div>
            <div className="text-sm text-slate-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">1,200+</div>
            <div className="text-sm text-slate-600">Reviews</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const videoTestimonials = [
  {
    videoId: "aR_YwYW7jdw",
    embedUrl: "https://www.youtube.com/embed/aR_YwYW7jdw",
  },
  {
    videoId: "3uitIT7OEAQ",
    embedUrl: "https://www.youtube.com/embed/3uitIT7OEAQ",
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

        {/* Video Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videoTestimonials.map((video, index) => (
            <motion.div
              key={video.videoId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-slate-900">
                <iframe
                  className="w-full h-full"
                  src={video.embedUrl}
                  title={`Testimonial ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

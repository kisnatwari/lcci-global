"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Lightbulb, Shield, Heart, ArrowRight, Sparkles, Users, Award, BookOpen, CheckCircle, GraduationCap, Globe, Building2, Star, ExternalLink } from "lucide-react";

export default function AboutContent() {
  return (
    <div className="relative py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
            <Sparkles className="w-4 h-4" />
            Welcome to LCCI GQ
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            We help people and business grow
          </h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto text-left">
            <p>
              LCCI Global Qualifications (LCCI GQ) is an award-winning organization and a leading provider of professional qualifications in Soft Skills, Management, English, Hospitality, and Computing & IT. We empower individuals and businesses worldwide through internationally recognized training and certification programs, building our reputation as a trusted education enterprise globally.
            </p>
            <p className="text-center pt-4">
              <a
                href="https://lccigq.com/about-us"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[color:var(--brand-blue)] hover:text-[color:var(--brand-blue)]/80 font-semibold transition-colors"
              >
                For more info, visit LCCI GQ
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </div>
        </motion.section>

        {/* Why LCCI GQ Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
              <Star className="w-4 h-4" />
              Why LCCI GQ is Best Service Provider?
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Happy Trainees",
                value: "25000+",
                icon: Users,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Happy Clients",
                value: "120+",
                icon: Building2,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                title: "Training Programmes",
                value: "40+",
                icon: BookOpen,
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                title: "Commitment",
                value: "100%",
                icon: Award,
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
                  className="group"
                >
                  <div className="h-full bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-lg hover:border-[color:var(--brand-blue)] hover:shadow-xl transition-all duration-300 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[color:var(--brand-blue)]/10 mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                      <Icon className="w-8 h-8 text-[color:var(--brand-blue)]" />
                    </div>
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {item.value}
                    </div>
                    <div className="text-lg font-semibold text-slate-600">
                      {item.title}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-lg"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Our Mission
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To become a leading institution of Nepal capable of helping thousands of people annually, to advance career through professional and vocational training and certification programmes for knowledge and skills of international quality in business, life skills and related fields.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-lg"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                <Lightbulb className="w-4 h-4" />
                Our Vision
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Our Vision
              </h3>
              <p className="text-slate-600 leading-relaxed">
                An institution actively helping people to advance career through development of knowledge and skills of international quality in a competitive and prosperous world.
              </p>
            </motion.div>
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
              Our Values
            </h2>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 lg:p-12 shadow-lg">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Commitment to quality",
                "Continual improvement",
                "Innovation in work",
                "Integrity and honesty",
                "Striving for excellence in every work we do",
                "Self-respect and respect for others",
                "Dignity at workplace",
                "Devotion to practical learning",
                "Learning work environment",
                "Linking organizational objectives to fulfil societal needs",
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-[color:var(--brand-blue)]" />
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>
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
              Learn With LCCI GQ Today
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Discover how LCCI GQ can support your institution or advance your professional career
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

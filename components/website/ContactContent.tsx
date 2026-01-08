"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactContent() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                <Send className="w-4 h-4" />
                Get in Touch
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Send Us a Message
              </h3>

                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-bold text-slate-900 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-slate-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm resize-none transition-all hover:border-slate-300"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="group w-full px-6 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
          </motion.div>

          {/* Right: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 border border-[color:var(--brand-blue)]/20 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)] mb-6">
                <Phone className="w-4 h-4" />
                Contact Information
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Reach Out to Us
              </h3>

              <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[color:var(--brand-blue)]/10 flex items-center justify-center group-hover:bg-[color:var(--brand-blue)]/20 transition-colors">
                      <Mail className="w-6 h-6 text-[color:var(--brand-blue)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Email
                      </div>
                      <a
                        href="mailto:info@lccigq.com"
                        className="text-lg font-bold text-slate-900 hover:text-[color:var(--brand-blue)] transition-colors"
                      >
                        info@lccigq.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[color:var(--brand-blue)]/10 flex items-center justify-center group-hover:bg-[color:var(--brand-blue)]/20 transition-colors">
                      <Phone className="w-6 h-6 text-[color:var(--brand-blue)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Phone
                      </div>
                      <a
                        href="tel:+977015442886"
                        className="text-lg font-bold text-slate-900 hover:text-[color:var(--brand-blue)] transition-colors"
                      >
                        +977-01-5442886
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[color:var(--brand-blue)]/10 flex items-center justify-center group-hover:bg-[color:var(--brand-blue)]/20 transition-colors">
                      <MapPin className="w-6 h-6 text-[color:var(--brand-blue)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Office Address
                      </div>
                      <p className="text-slate-900 font-semibold leading-relaxed">
                        LCCI Global Qualifications PVT.LTD
                        <br />
                        Ekantakuna Marg, Jawalakhel
                        <br />
                        Lalitpur, Nepal – 44700
                      </p>
                    </div>
                  </div>
                </div>

              {/* Google Maps */}
              <div className="mt-12">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Location
                </div>
                <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-slate-200 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps?ll=27.670091,85.311197&z=17&output=embed&cid=4239885354496361345"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="LCCI Global Qualifications Location"
                  ></iframe>
                </div>
              </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

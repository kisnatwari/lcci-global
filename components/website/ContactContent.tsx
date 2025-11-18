import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactContent() {
  return (
    <section className="pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Left: form */}
        <div className="relative rounded-2xl bg-white border-2 border-slate-200 p-8 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--brand-blue)] mb-6 uppercase">
              Online inquiry
            </p>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm resize-none transition-all"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-2 px-6 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white text-sm font-semibold shadow-lg shadow-[color:var(--brand-blue)]/30 hover:bg-[#0099d6] hover:shadow-xl transition-all duration-200"
              >
                Send message
              </button>
            </form>
          </div>
        </div>

        {/* Right: contact details */}
        <div className="relative rounded-2xl bg-white border-2 border-slate-200 p-8 shadow-lg md:self-center">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[color:var(--brand-cyan)]/5 to-transparent rounded-full blur-2xl -ml-16 -mb-16" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--brand-blue)] mb-6 uppercase">
              Contact details
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[color:var(--brand-blue)]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[color:var(--brand-blue)]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Email</div>
                  <a
                    href="mailto:info@lccigq.com"
                    className="text-slate-700 hover:text-[color:var(--brand-blue)] transition-colors"
                  >
                    info@lccigq.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[color:var(--brand-blue)]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[color:var(--brand-blue)]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Phone</div>
                  <a href="tel:+977015442886" className="text-slate-700 hover:text-[color:var(--brand-blue)] transition-colors">
                    +977-01-5442886
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[color:var(--brand-blue)]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[color:var(--brand-blue)]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">Office address</div>
                  <p className="text-slate-700 leading-relaxed">
                    LCCI Global Qualifications PVT.LTD
                    <br />
                    Ekantakuna Marg, Jawalakhel
                    <br />
                    Lalitpur, Nepal – 44700
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



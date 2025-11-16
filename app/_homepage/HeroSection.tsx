import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Building2, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Spacer for fixed header */}
      <div className="absolute top-0 left-0 right-0 h-20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-sky-900 border border-sky-200/50">
              <Award className="w-3.5 h-3.5" />
              Award-winning qualifications since 1887
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Start your journey to
                <span className="block text-sky-700 mt-2">
                  professional success
                </span>
                <span className="block mt-2">
                  with LCCI
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                Gain industry-recognized qualifications in business, accounting, finance, IT and English. Learn at your own pace or join guided programmes—start building your future today.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-700/20 hover:bg-sky-800 hover:shadow-xl hover:shadow-sky-700/30 transition-all duration-200"
              >
                Start learning now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Learn more about us
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-slate-900">25,000+</div>
                  <div className="text-slate-600">Learners trained</div>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                <div className="text-sm">
                  <div className="font-semibold text-slate-900">120+</div>
                  <div className="text-slate-600">Partner institutions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Feature Card */}
          <div className="relative lg:pl-8">
            {/* Main feature card */}
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-8 lg:p-10 space-y-6">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl opacity-50 blur-2xl -z-10" />
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Choose your path
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  What would you like to learn?
                </h3>
              </div>

              {/* Feature list */}
              <div className="space-y-4">
                {[
                  {
                    title: "Business & Finance",
                    description: "Accounting, bookkeeping, financial management and business administration",
                    icon: "💼",
                    color: "from-blue-500 to-sky-500"
                  },
                  {
                    title: "English & Communication",
                    description: "Cambridge-aligned English language and professional communication skills",
                    icon: "🗣️",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Computing & IT",
                    description: "Digital skills, software applications and IT fundamentals",
                    icon: "💻",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Hospitality & Soft Skills",
                    description: "Customer service, leadership and interpersonal effectiveness",
                    icon: "✨",
                    color: "from-orange-500 to-amber-500"
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-default"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom accent */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center">
                  Flexible delivery: Guided cohorts or self-paced learning
                </p>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-sky-600 to-blue-600 rounded-2xl shadow-xl shadow-sky-900/20 p-6 max-w-[240px] hidden lg:block">
              <div className="flex items-center gap-3 text-white">
                <Users className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">40+</div>
                  <div className="text-sm text-sky-100">Active programmes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

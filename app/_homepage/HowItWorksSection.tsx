import { Search, UserCheck, BookOpen, Award } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Explore programmes",
      body: "Choose the qualification level, subject area and delivery style that fits your learners or career goals.",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "Enroll via centre or online",
      body: "Register through your school, college, training centre or directly with LCCI-approved partners.",
      icon: UserCheck,
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Learn & get assessed",
      body: "Follow structured content, activities and assessments designed to measure real understanding and skills.",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
    },
    {
      step: "04",
      title: "Earn your certificate",
      body: "On successful completion, receive an LCCI certificate that can support further study and employment.",
      icon: Award,
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white border-t border-slate-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[color:var(--brand-blue)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[color:var(--brand-cyan)]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[color:var(--brand-blue)] mb-4">
            How learning with LCCI works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            A clear path from enrolment to certification
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            We work with learners and institutions through a simple, structured process so
            everyone knows what to expect at each stage.
          </p>
        </div>

        {/* Steps - New Unique Design */}
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[color:var(--brand-blue)] via-[color:var(--brand-cyan)] to-[color:var(--brand-blue)] opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isLast = idx === steps.length - 1;
              
              return (
                <div key={item.step} className="relative group">
                  {/* Step Card */}
                  <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:border-[color:var(--brand-blue)]/40 transition-all duration-500 hover:-translate-y-2 h-full">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--brand-blue)]/0 to-[color:var(--brand-cyan)]/0 group-hover:from-[color:var(--brand-blue)]/5 group-hover:to-[color:var(--brand-cyan)]/5 transition-all duration-500" />
                    
                    {/* Icon with gradient background */}
                    <div className="relative mb-6">
                      <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--brand-blue)] text-white text-xs font-bold shadow-md border-2 border-white">
                        {item.step}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative space-y-3">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.body}
                      </p>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[color:var(--brand-blue)]/10 to-transparent rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Arrow connector for desktop (except last) */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-24 -right-3 w-6 h-6 z-20">
                      <div className="w-full h-0.5 bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)]" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-[color:var(--brand-cyan)] border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Ready to start your journey?{" "}
            <a href="/courses" className="text-[color:var(--brand-blue)] font-semibold hover:underline">
              Browse our programmes →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

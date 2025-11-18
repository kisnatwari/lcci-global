import Link from "next/link";

export default function AboutContent() {
  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-20 space-y-16">
      {/* Mission Section */}
      <section className="relative rounded-2xl bg-white border-2 border-slate-200 p-8 lg:p-10 shadow-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-2xl -mr-20 -mt-20" />
        <div className="relative space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Our mission
          </h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            LCCI Global Qualifications (LCCI GQ) is focused on developing practical soft skills,
            management, English, hospitality and computing &amp; IT capabilities for thousands of
            learners in a competitive, global environment.
          </p>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            We are building an institution of repute that partners with schools, colleges and
            organisations to deliver structured, industry‑relevant programmes.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="relative rounded-2xl bg-white border-2 border-slate-200 p-8 lg:p-10 shadow-lg">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[color:var(--brand-cyan)]/5 to-transparent rounded-full blur-2xl -ml-20 -mb-20" />
        <div className="relative space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            What we offer
          </h2>
          <p className="text-base md:text-lg text-slate-700 mb-4">
            LCCI Global works with institutions and professionals across a range of programmes:
          </p>
          <ul className="space-y-3 text-base text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span>Comprehensive qualifications from entry‑level certificates to advanced diplomas in
                business, accounting, finance and professional skills.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span>Flexible delivery models – guided cohorts for schools, colleges and centres, plus
                self‑paced options for independent learners.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span>Programmes aligned with employer expectations and global qualification frameworks.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span>Ongoing academic and operational support for partner centres and tutors.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="relative rounded-2xl bg-white border-2 border-slate-200 p-8 lg:p-10 shadow-lg">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-2xl -ml-20 -mt-20" />
        <div className="relative space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Our values
          </h2>
          <p className="text-base md:text-lg text-slate-700 mb-4">
            A few principles guide how we work with learners and partners:
          </p>
          <ul className="space-y-3 text-base text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span><span className="font-bold text-slate-900">Excellence</span> – high standards in programme design,
                delivery and assessment.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span><span className="font-bold text-slate-900">Accessibility</span> – making professional education
                reachable for diverse learners.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span><span className="font-bold text-slate-900">Innovation</span> – updating content and delivery to match
                changing industry needs.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[color:var(--brand-blue)] mt-1.5 font-bold">•</span>
              <span><span className="font-bold text-slate-900">Integrity</span> – transparency and responsibility in all
                partnerships.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative rounded-2xl bg-gradient-to-br from-[color:var(--brand-blue)]/10 via-white to-[color:var(--brand-cyan)]/5 border-2 border-slate-200 p-8 lg:p-10 text-center shadow-xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent opacity-50" />
        <div className="relative space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Work with us on your next programme
          </h2>
          <p className="text-base md:text-lg text-slate-700 mb-6 max-w-2xl mx-auto">
            Explore how LCCI Global can support your institution or organisation with structured programmes
            in business, finance and professional skills.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl bg-[color:var(--brand-blue)] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-[color:var(--brand-blue)]/30 hover:bg-[#0099d6] hover:shadow-2xl hover:shadow-[color:var(--brand-blue)]/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse programmes
          </Link>
        </div>
      </section>
    </div>
  );
}



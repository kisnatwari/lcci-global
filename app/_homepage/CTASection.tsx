import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
          Ready to begin
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
          Plan your next programme with LCCI
        </h2>
        <p className="text-sm md:text-base text-slate-600 mb-6 max-w-2xl mx-auto">
          Whether you&apos;re an institution looking to add LCCI qualifications or a professional
          planning your next step, we can help you map the right learning path.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg bg-[color:var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#3b89bc] transition-colors"
          >
            Browse programmes
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Talk to our team
          </Link>
        </div>
      </div>
    </section>
  );
}



import Link from "next/link";

export default function AboutContent() {
  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-20 space-y-16">
      {/* Mission Section */}
      <section className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          Our mission
        </h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          LCCI Global Qualifications (LCCI GQ) is focused on developing practical soft skills,
          management, English, hospitality and computing &amp; IT capabilities for thousands of
          learners in a competitive, global environment.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          We are building an institution of repute that partners with schools, colleges and
          organisations to deliver structured, industry‑relevant programmes.
        </p>
      </section>

      {/* What We Offer */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          What we offer
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-3">
          LCCI Global works with institutions and professionals across a range of programmes:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-gray-700">
          <li>
            Comprehensive qualifications from entry‑level certificates to advanced diplomas in
            business, accounting, finance and professional skills.
          </li>
          <li>
            Flexible delivery models – guided cohorts for schools, colleges and centres, plus
            self‑paced options for independent learners.
          </li>
          <li>
            Programmes aligned with employer expectations and global qualification frameworks.
          </li>
          <li>
            Ongoing academic and operational support for partner centres and tutors.
          </li>
        </ul>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          Our values
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-3">
          A few principles guide how we work with learners and partners:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-gray-700">
          <li>
            <span className="font-semibold">Excellence</span> – high standards in programme design,
            delivery and assessment.
          </li>
          <li>
            <span className="font-semibold">Accessibility</span> – making professional education
            reachable for diverse learners.
          </li>
          <li>
            <span className="font-semibold">Innovation</span> – updating content and delivery to match
            changing industry needs.
          </li>
          <li>
            <span className="font-semibold">Integrity</span> – transparency and responsibility in all
            partnerships.
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-white/95 border border-gray-200 p-8 text-center shadow-sm">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          Work with us on your next programme
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-6 max-w-2xl mx-auto">
          Explore how LCCI Global can support your institution or organisation with structured programmes
          in business, finance and professional skills.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-lg bg-[color:var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#3b89bc] transition-colors"
        >
          Browse programmes
        </Link>
      </section>
    </div>
  );
}



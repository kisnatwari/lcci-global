const faqs = [
  {
    q: "How do learners enroll in LCCI programmes?",
    a: "Learners typically enroll through a partner school, college, training centre or organisation. For some self-paced courses, direct online registration may be available through approved partners.",
  },
  {
    q: "What is the difference between guided and self-paced courses?",
    a: "Guided programmes follow a timetable with instructor-led sessions and cohort-based activities. Self-paced courses allow learners to move through the content on their own schedule with structured modules and assessments.",
  },
  {
    q: "What kinds of assessments are used?",
    a: "Assessments vary by programme and can include written exams, projects, practical tasks and coursework. All assessments are designed to measure real-world skills and knowledge.",
  },
  {
    q: "Are LCCI qualifications recognised by employers?",
    a: "LCCI qualifications have a long history of recognition by employers, educational institutions and professional bodies around the world, particularly in business, finance and related fields.",
  },
  {
    q: "Can we customise programmes for our institution or organisation?",
    a: "Yes. Many centres work with LCCI Global to align programmes with local requirements, sector needs and timetables while maintaining the integrity of the qualification.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Frequently asked questions
          </p>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            Answers to common questions about LCCI
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            If you need more details, our team can provide programme guides, syllabuses and centre
            support information.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={faq.q}
              className="group rounded-xl border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl hover:border-[color:var(--brand-blue)]/40 transition-all duration-300 overflow-hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-semibold text-slate-900 hover:text-[color:var(--brand-blue)] transition-colors">
                <span className="flex-1 pr-4">{faq.q}</span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[color:var(--brand-blue)]/10 flex items-center justify-center transition-colors">
                  <span className="text-lg text-slate-600 group-hover:text-[color:var(--brand-blue)] group-open:hidden transition-colors">+</span>
                  <span className="text-lg text-slate-600 group-hover:text-[color:var(--brand-blue)] hidden group-open:inline transition-colors">−</span>
                </div>
              </summary>
              <div className="px-6 pb-5 pt-0">
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}




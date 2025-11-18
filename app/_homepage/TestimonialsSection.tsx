export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Voices from our community
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            What learners and partners say about LCCI
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Real impact across classrooms, training centres and workplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700">
          <TestimonialCard
            quote="LCCI programmes have helped our students graduate with practical skills that employers recognise. The structure and assessments are clear and industry-relevant."
            name="Academic Coordinator"
            role="Hospitality College Partner"
          />
          <TestimonialCard
            quote="The self-paced computing and IT courses allowed me to upskill alongside my full-time job. The content was structured, and the certificate helped me move into a new role."
            name="Professional learner"
            role="Diploma in Computing & IT"
          />
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <figure className="group rounded-2xl bg-white border-2 border-slate-200 p-8 flex flex-col gap-5 shadow-lg hover:shadow-2xl hover:border-[color:var(--brand-blue)]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-xl -ml-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <blockquote className="text-base text-slate-700 leading-relaxed relative z-10 italic">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="text-sm text-slate-600 relative z-10 pt-4 border-t border-slate-100">
        <div className="font-bold text-slate-900 mb-1">{name}</div>
        <div className="text-xs text-slate-500">{role}</div>
      </figcaption>
    </figure>
  );
}




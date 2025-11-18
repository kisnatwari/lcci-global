import { Building2, GraduationCap, Briefcase } from "lucide-react";

export default function AudienceSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Who we work with
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            Built for institutions and individual learners
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            LCCI programmes are designed to support schools, colleges, training providers and
            working professionals at different stages of their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-700">
          <AudienceCard
            icon={GraduationCap}
            label="Schools & colleges"
            points={[
              "Integrate LCCI into existing curricula.",
              "Offer clear progression routes from foundation to advanced levels.",
              "Access teaching resources and assessment support.",
            ]}
          />
          <AudienceCard
            icon={Building2}
            label="Training providers"
            points={[
              "Run accredited programmes with recognised outcomes.",
              "Differentiate your portfolio with LCCI branding.",
              "Benefit from structured syllabuses and exam support.",
            ]}
          />
          <AudienceCard
            icon={Briefcase}
            label="Working professionals"
            points={[
              "Upskill in business, finance, IT, English and soft skills.",
              "Blend self-paced modules with live workshops where available.",
              "Gain recognised certificates to support career progression.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

interface AudienceCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  points: string[];
}

function AudienceCard({ icon: Icon, label, points }: AudienceCardProps) {
  return (
    <div className="group rounded-2xl bg-white border-2 border-slate-200 p-8 h-full flex flex-col shadow-lg hover:shadow-2xl hover:border-[color:var(--brand-blue)]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[color:var(--brand-blue)] text-white shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <h3 className="font-bold text-lg text-slate-900">{label}</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-slate-700 flex-1 relative z-10">
        {points.map((p, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-[color:var(--brand-blue)] mt-1.5">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}




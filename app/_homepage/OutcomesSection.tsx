import { Award, Users, Globe2 } from "lucide-react";

export default function OutcomesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[color:var(--brand-blue)]/5 via-white to-[color:var(--brand-cyan)]/5 border-t border-slate-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Outcomes
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            Impact for learners and organisations
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            LCCI Global programmes are designed to deliver tangible skills and credentials that
            matter in classrooms, workplaces and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-700">
          <OutcomeCard
            icon={<Users className="w-6 h-6" />}
            stat="25,000+"
            label="Learners trained"
            body="Students, graduates and working professionals who have completed LCCI programmes."
          />
          <OutcomeCard
            icon={<Globe2 className="w-6 h-6" />}
            stat="120+"
            label="Partner institutions"
            body="Schools, colleges, training providers and organisations collaborating with LCCI."
          />
          <OutcomeCard
            icon={<Award className="w-6 h-6" />}
            stat="40+"
            label="Active programmes"
            body="Courses across business, finance, IT, English and soft skills, updated for industry needs."
          />
        </div>
      </div>
    </section>
  );
}

interface OutcomeCardProps {
  icon: React.ReactNode;
  stat: string;
  label: string;
  body: string;
}

function OutcomeCard({ icon, stat, label, body }: OutcomeCardProps) {
  return (
    <div className="group rounded-2xl bg-white border-2 border-slate-200 p-8 flex flex-col gap-4 shadow-lg hover:shadow-2xl hover:border-[color:var(--brand-blue)]/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stat}</div>
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">
            {label}
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed relative z-10">{body}</p>
    </div>
  );
}




import { Users, BookOpen, GraduationCap, Building2 } from "lucide-react";

/**
 * Statistics Banner Section
 * Prominent display of key metrics - inspired by reference site
 */
export default function StatsBannerSection() {
  const stats = [
    {
      icon: BookOpen,
      value: "40+",
      label: "Courses",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      value: "25,000+",
      label: "Members",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      value: "120+",
      label: "Authors",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Building2,
      value: "128+",
      label: "Partner Institutions",
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


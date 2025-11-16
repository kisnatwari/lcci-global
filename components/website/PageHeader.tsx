interface PageHeaderProps {
  badge?: {
    icon: string;
    text: string;
  };
  title: string;
  titleHighlight?: string;
  description: string;
  extraContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function PageHeader({
  badge,
  title,
  titleHighlight,
  description,
  extraContent,
  rightContent,
}: PageHeaderProps) {
  return (
    <section className="relative pt-24 bg-transparent">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10">
        <div className="max-w-3xl mx-auto text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-1.5 text-[11px] font-semibold text-sky-700 shadow-sm mb-4 uppercase tracking-[0.16em]">
              {badge.icon && <span className="text-xs">{badge.icon}</span>}
              <span>{badge.text}</span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.16em] text-slate-900 mb-3 uppercase">
            {title}{" "}
            {titleHighlight && (
              <span className="text-sky-700">{titleHighlight}</span>
            )}
          </h1>

          <p className="text-sm md:text-base text-slate-600 mb-4">
            {description}
          </p>

          {extraContent && <div className="mt-4">{extraContent}</div>}
        </div>

        <div className="mt-6 h-px w-full bg-slate-200" />
      </div>
    </section>
  );
}

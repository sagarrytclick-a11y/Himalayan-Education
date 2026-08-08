import { Users, GraduationCap, Clock, Award, type LucideIcon } from "lucide-react";

export type AboutStat = {
  number: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
};

export const aboutStats: AboutStat[] = [
  { number: "5000+", label: "Students Guided", icon: Users },
  { number: "150+", label: "College Partners", icon: GraduationCap, accent: true },
  { number: "15+", label: "Years of Guidance", icon: Clock },
  { number: "98%", label: "Families Recommend Us", icon: Award },
];

export function AboutStats({ stats = aboutStats }: { stats?: AboutStat[] }) {
  return (
    <section className="he-section bg-surface">
      <div className="he-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="he-stat group rounded-[20px] border border-border bg-white px-5 py-7 sm:px-6 sm:py-8 shadow-[0_4px_20px_rgba(15,32,66,0.06)]"
            >
              <stat.icon
                className={`mb-4 h-5 w-5 ${
                  stat.accent ? "text-accent-deep" : "text-primary/50"
                }`}
              />
              <p
                className={`he-stat-value font-display text-3xl sm:text-4xl font-extrabold leading-none ${
                  stat.accent ? "text-accent-deep" : "text-primary"
                }`}
              >
                {stat.number}
              </p>
              <p className="mt-3 font-body text-sm font-semibold text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

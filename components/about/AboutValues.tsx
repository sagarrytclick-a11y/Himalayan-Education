import { CheckCircle2, Target, Eye, Compass, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const values: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Give every NEET aspirant clear, honest admission support — so choosing a college feels informed, not overwhelming.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "Be the counselling partner families trust for medical admissions in India and abroad, built on clarity and follow-through.",
  },
  {
    icon: Compass,
    title: "Our Approach",
    desc: "Listen first, then shortlist. We match score, budget, and preference — and stay with you until admission is confirmed.",
  },
];

const achievements = [
  "NEET counselling support",
  "India & abroad shortlists",
  "Fee & recognition clarity",
  "Document & form guidance",
  "Visa & travel support",
  "Post-admission follow-up",
];

export function AboutValues() {
  return (
    <section className="he-section bg-surface border-y border-border">
      <div className="he-container">
        <SectionHeader
          eyebrow="What we stand for"
          title="Mission, vision & approach"
          description="The same principles behind every shortlist, call, and document review."
          className="mb-10"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            const featured = i === 0;
            return (
              <div
                key={v.title}
                className={`group rounded-[20px] border p-6 h-full ${
                  featured
                    ? "border-primary bg-primary text-white shadow-[0_8px_28px_rgba(15,32,66,0.2)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(15,32,66,0.3)]"
                    : "he-card he-card-line border-border bg-white"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    featured ? "text-accent" : "text-accent-deep"
                  }`}
                />
                <h3
                  className={`mt-4 font-display text-xl font-extrabold ${
                    featured ? "text-white" : "text-text"
                  }`}
                >
                  {v.title}
                </h3>
                <p
                  className={`mt-2 font-body text-sm leading-relaxed ${
                    featured ? "text-white/85" : "text-muted"
                  }`}
                >
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {achievements.map((item) => (
            <div
              key={item}
              className="he-card he-card-line flex items-center gap-2.5 px-4 py-3.5"
            >
              <CheckCircle2 className="h-4 w-4 text-accent-deep shrink-0" />
              <p className="font-body text-sm font-semibold text-text">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

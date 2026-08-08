"use client";

import React from "react";
import { Users, Building2, BookOpen, HeartHandshake } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const stats = [
  { value: "5,000+", label: "Students guided", accent: false, icon: Users },
  { value: "150+", label: "Partner institutions", accent: true, icon: Building2 },
  { value: "25+", label: "Programs covered", accent: false, icon: BookOpen },
  { value: "95%", label: "Families recommend us", accent: false, icon: HeartHandshake },
];

export default function StatsSection() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Impact · Clarity · Trust"
            title={
              <>
                Numbers that reflect{" "}
                <span className="text-secondary">steady guidance</span>
              </>
            }
            description="We measure success by informed decisions — not pressure, shortcuts, or noise."
            className="mb-8"
          />
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={i * 0.07}>
                <div className="he-stat group rounded-[20px] border border-border bg-white px-5 py-7 sm:px-6 sm:py-8 shadow-[0_4px_20px_rgba(15,32,66,0.06)]">
                  <Icon
                    className={`mb-4 h-5 w-5 ${
                      stat.accent ? "text-accent-deep" : "text-primary/50"
                    }`}
                  />
                  <p
                    className={`he-stat-value font-display text-3xl sm:text-4xl font-extrabold leading-none ${
                      stat.accent ? "text-accent-deep" : "text-primary"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-3 font-body text-sm font-semibold text-muted">{stat.label}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

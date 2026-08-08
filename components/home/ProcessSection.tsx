"use client";

import React from "react";
import { Search, Scale, FileCheck2, Handshake } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const steps = [
  {
    n: "01",
    title: "Explore",
    desc: "Share your NEET score, budget, and preferences — India, abroad, or PG.",
    icon: Search,
  },
  {
    n: "02",
    title: "Compare",
    desc: "We shortlist realistic colleges with fees, recognition, and timelines side by side.",
    icon: Scale,
  },
  {
    n: "03",
    title: "Apply",
    desc: "Documents, applications, and counselling rounds — handled with checklists.",
    icon: FileCheck2,
  },
  {
    n: "04",
    title: "Get guidance",
    desc: "Stay supported through admission confirmation and next-step planning.",
    icon: Handshake,
  },
];

export default function ProcessSection() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="How it works"
            title={
              <>
                A clear process from{" "}
                <span className="text-secondary">first call to seat</span>
              </>
            }
            description="No labyrinth of forms. Four steps designed for students and parents who want clarity."
            className="mb-8"
          />
        </FadeIn>

        <div className="hidden md:grid md:grid-cols-4 gap-5 relative">
          <div className="pointer-events-none absolute top-10 left-[12%] right-[12%] h-px bg-border" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.n} delay={i * 0.08}>
                <div className="group relative rounded-[20px] border border-border bg-white p-6 shadow-[0_4px_20px_rgba(15,32,66,0.06)] h-full transition-colors duration-300 hover:border-primary/30 hover:bg-surface">
                  <span className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary transition-all duration-300 group-hover:border-accent group-hover:text-accent-deep">
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  </span>
                  <span
                    className={`block font-display text-2xl font-extrabold transition-colors duration-300 group-hover:text-accent-deep ${
                      i === 2 ? "text-accent-deep" : "text-primary"
                    }`}
                  >
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-text">{step.title}</h3>
                  <p className="mt-2 font-body text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="md:hidden space-y-4 border-l-2 border-border ml-3 pl-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.n} delay={i * 0.05}>
                <div className="relative">
                  <span
                    className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                      i === 2 ? "bg-accent" : "bg-primary"
                    }`}
                  />
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 ${
                        i === 2 ? "text-accent-deep" : "text-primary"
                      }`}
                    />
                    <p
                      className={`font-body text-xs font-bold tracking-widest ${
                        i === 2 ? "text-accent-deep" : "text-primary"
                      }`}
                    >
                      {step.n}
                    </p>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold text-text">{step.title}</h3>
                  <p className="mt-1.5 font-body text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const faqs = [
  {
    q: "Do you help with both India and abroad MBBS?",
    a: "Yes. We shortlist based on your NEET score, budget, and preference — including government/private seats in India and NMC-aware abroad options.",
  },
  {
    q: "Is the first counselling call free?",
    a: "Yes. The first counselling session is free. We map realistic options before you commit to any application pathway.",
  },
  {
    q: "How do you verify college recognition?",
    a: "We cross-check publicly available recognition context (such as NMC/WHO listings where relevant) and explain what that means for your return pathway.",
  },
  {
    q: "Can parents join the counselling session?",
    a: "Absolutely. We encourage parents to join — fee structures, timelines, and hostel realities are clearer when everyone hears the same plan.",
  },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="he-section bg-surface border-t border-border scroll-mt-24">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Questions"
            title={
              <>
                Straight answers before{" "}
                <span className="text-secondary">you apply</span>
              </>
            }
            description="A few of the questions families ask us most often during admission season."
            className="mb-4"
          />
        </FadeIn>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={item.q} delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-[16px] border bg-background transition-all duration-300 ${
                    isOpen
                      ? "border-accent/50 bg-white shadow-[0_8px_24px_rgba(15,32,66,0.08)]"
                      : "border-border hover:border-primary/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-body text-sm sm:text-base font-bold text-text">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-accent-deep" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 font-body text-sm text-muted leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

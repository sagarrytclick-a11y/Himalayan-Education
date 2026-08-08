"use client";

import React from "react";
import { Compass, MessageSquareHeart, FileCheck2, Handshake } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../ui/FadeIn";

const benefits = [
  {
    icon: Compass,
    title: "Honest shortlists",
    desc: "We match score, budget, and preference — not the loudest brochure.",
  },
  {
    icon: MessageSquareHeart,
    title: "Parent-friendly calls",
    desc: "Clear answers on fees, recognition, hostel, and timelines without jargon.",
  },
  {
    icon: FileCheck2,
    title: "Document discipline",
    desc: "Checklists and reviews so applications don’t stall on paperwork.",
  },
  {
    icon: Handshake,
    title: "After-admission care",
    desc: "Guidance continues through confirmation, travel planning, and settling in.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="he-section bg-surface border-y border-border">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Why Choose Us"
            title="What makes Himalayan Education worth?"
            description="Real guidance backed by clear outcomes — not just promises."
            className="mb-8"
          />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            const featured = i === 0;
            return (
              <FadeIn key={b.title} delay={i * 0.07}>
                <div
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
                    {b.title}
                  </h3>
                  <p
                    className={`mt-2 font-body text-sm leading-relaxed ${
                      featured ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {b.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

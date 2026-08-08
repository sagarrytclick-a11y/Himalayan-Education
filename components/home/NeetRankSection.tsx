"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Target, TrendingUp, Building2 } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/FadeIn";

const points = [
  {
    icon: Target,
    title: "Score to AIR",
    desc: "Enter your NEET UG marks and get an estimated All India Rank range.",
  },
  {
    icon: TrendingUp,
    title: "Trend-based",
    desc: "Estimates use previous-year score–rank patterns for a practical view.",
  },
  {
    icon: Building2,
    title: "College context",
    desc: "See which college bands often open around your predicted rank.",
  },
];

export default function NeetRankSection() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="NEET tools"
            title={
              <>
                Check your likely{" "}
                <span className="text-secondary">NEET rank</span>
              </>
            }
            description="A quick score-to-rank estimate — then talk to us for a realistic college shortlist."
            className="mb-8"
          />
        </FadeIn>

        <div className="grid gap-5 lg:grid-cols-12 items-stretch">
          <FadeIn className="lg:col-span-7" delay={0.05}>
            <div className="grid gap-4 sm:grid-cols-3 h-full">
              {points.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="he-card he-card-line group p-5 sm:p-6 h-full"
                  >
                    <Icon className="h-6 w-6 text-accent-deep" />
                    <h3 className="mt-4 font-display text-lg font-extrabold text-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn className="lg:col-span-5" delay={0.1}>
            <div className="relative overflow-hidden rounded-[20px] border border-primary bg-primary p-6 sm:p-8 h-full flex flex-col justify-center shadow-[0_8px_28px_rgba(15,32,66,0.2)]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/20 blur-3xl" />
              <p className="relative font-body text-[12px] font-bold uppercase tracking-[0.14em] text-accent mb-3">
                Free rank predictor
              </p>
              <h3 className="relative font-display text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Know where your score may land
              </h3>
              <p className="relative mt-3 font-body text-sm text-white/75 leading-relaxed">
                Approximate AIR from your NEET UG score — then plan India or
                abroad options with counselling support.
              </p>
              <Link href="/neet-rank-predictor" className="relative mt-6 inline-flex">
                <Button size="lg" className="group">
                  Open NEET rank predictor
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

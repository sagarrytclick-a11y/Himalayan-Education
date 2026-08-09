"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { usePopup } from "../contexts/PopupContext";
import { Button } from "./ui/Button";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const highlights = [
  "NEET counselling support",
  "India & abroad shortlists",
  "Document-ready guidance",
];

const HeroSection = () => {
  const { openPopup } = usePopup();

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="he-container relative z-10 grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-12 lg:gap-10 lg:py-16 xl:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 transition-colors hover:border-accent/40 hover:bg-accent/10">
            <Sparkles className="h-3.5 w-3.5 text-accent-deep animate-[pulse_2.4s_ease-in-out_infinite]" />
            <span className="font-body text-[11px] font-bold tracking-[0.16em] uppercase text-accent-deep">
              Education · Opportunity · Future
            </span>
          </div>

          <p className="font-body text-xs font-bold tracking-[0.18em] uppercase text-muted mb-3">
            {SITE_IDENTITY.name}
          </p>

          <h1 className="font-display text-[1.85rem] leading-[1.15] sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-primary">
            Build your future with the{" "}
            <span className="text-secondary">right education</span> path.
          </h1>

          <p className="mt-5 max-w-xl font-body text-base sm:text-lg text-muted leading-relaxed">
            Calm, honest counselling for NEET aspirants and parents — shortlist
            colleges, compare options, and move from confusion to a clear next
            step.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button onClick={openPopup} size="lg" className="group">
              Get Guidance
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Link
              href="/colleges/mbbs-india"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border border-primary/20 bg-white px-6 font-body text-[15px] font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface hover:shadow-[0_8px_20px_rgba(15,32,66,0.08)]"
            >
              Explore colleges
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {highlights.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
                className="group inline-flex items-center gap-2 font-body text-sm font-semibold text-text"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-deep transition-transform duration-300 group-hover:scale-110" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="lg:col-span-6 relative"
        >
          <div className="group relative rounded-[24px] overflow-hidden border border-border bg-white shadow-[0_4px_20px_rgba(15,32,66,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(15,32,66,0.12)]">
            <div className="relative aspect-[4/3] sm:aspect-[5/4]">
              <Image
                src="https://i.pinimg.com/1200x/91/de/4a/91de4a338810dca49107783681772f25.jpg"
                alt="Medical professionals in surgery — your NEET journey starts with clear guidance"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                priority
                sizes="(max-width: 1024px) 100vw, 540px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042]/65 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: "5K+", label: "Students guided" },
                { value: "150+", label: "Institutions" },
                { value: "15+", label: "Years trust" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="rounded-[12px] bg-white/95 backdrop-blur-sm border border-white/50 px-2.5 py-3 sm:px-3 text-center transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <p
                    className={`font-display text-xl sm:text-2xl font-extrabold leading-none ${
                      i === 1 ? "text-accent-deep" : "text-primary"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1.5 font-body text-[10px] sm:text-[11px] font-semibold text-muted leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

         
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

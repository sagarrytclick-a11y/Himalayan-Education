"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { abroadCountries, indiaStates } from "@/lib/nav-mega-data";

type SlideKey = "india" | "abroad";

type Slide = {
  key: SlideKey;
  badge: string;
  titleLead: string;
  titleAccent: string;
  featuredLabel: string;
  description: string;
  secondaryHref: string;
  secondaryLabel: string;
  imageSrc: string;
  imageAlt: string;
  colleges: string[];
};

const indiaNames = indiaStates
  .flatMap((s) => s.colleges.map((c) => c.name))
  .filter((name, i, arr) => arr.indexOf(name) === i)
  .slice(0, 14);

const abroadNames = abroadCountries
  .flatMap((c) => c.colleges.map((col) => col.name))
  .filter((name, i, arr) => arr.indexOf(name) === i)
  .slice(0, 14);

const slides: Slide[] = [
  {
    key: "india",
    badge: "MBBS in India – Leading Colleges",
    titleLead: "Study MBBS in",
    titleAccent: "India's Top Colleges",
    featuredLabel: "Featured college (India)",
    description:
      "Admission guidance for MBBS across India — counselling, college shortlisting, and documentation support.",
    secondaryHref: "/colleges/mbbs-india",
    secondaryLabel: "Explore States",
    imageSrc: "/hero-2.png",
    imageAlt: "Medical student preparing for MBBS in India",
    colleges: indiaNames,
  },
  {
    key: "abroad",
    badge: "MBBS Abroad – Global Pathways",
    titleLead: "Studying MBBS at",
    titleAccent: "Top Universities Abroad",
    featuredLabel: "Featured college (Abroad)",
    description:
      "Trusted support for MBBS abroad — university selection, applications, and visa assistance end to end.",
    secondaryHref: "/colleges/mbbs-abroad",
    secondaryLabel: "Explore Countries",
    imageSrc: "/hero-2.png",
    imageAlt: "Medical student exploring MBBS universities abroad",
    colleges: abroadNames,
  },
];

function TypewriterNames({ names }: { names: string[] }) {
  const [nameIndex, setNameIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = names[nameIndex] || "";

  useEffect(() => {
    if (!current) return;

    if (!deleting && charCount === current.length) {
      const hold = window.setTimeout(() => setDeleting(true), 1400);
      return () => window.clearTimeout(hold);
    }

    if (deleting && charCount === 0) {
      const next = window.setTimeout(() => {
        setDeleting(false);
        setNameIndex((i) => (i + 1) % names.length);
      }, 280);
      return () => window.clearTimeout(next);
    }

    const delay = deleting ? 28 : 55;
    const tick = window.setTimeout(() => {
      setCharCount((n) => n + (deleting ? -1 : 1));
    }, delay);
    return () => window.clearTimeout(tick);
  }, [charCount, current, deleting, names.length]);

  return (
    <span className="inline-flex min-h-[1.4em] items-center font-body text-[15px] font-semibold text-white sm:text-base">
      {current.slice(0, charCount)}
      <span className="ml-0.5 inline-block h-[1.05em] w-0.5 animate-pulse bg-accent" />
    </span>
  );
}

function GlobeMark() {
  return (
    <svg
      viewBox="0 0 480 480"
      className="pointer-events-none absolute -right-16 top-8 h-[520px] w-[520px] opacity-[0.14]"
      aria-hidden
    >
      <circle cx="240" cy="240" r="210" fill="none" stroke="white" strokeWidth="1.2" />
      <ellipse cx="240" cy="240" rx="210" ry="80" fill="none" stroke="white" strokeWidth="1" />
      <ellipse cx="240" cy="240" rx="140" ry="210" fill="none" stroke="white" strokeWidth="1" />
      <ellipse cx="240" cy="240" rx="70" ry="210" fill="none" stroke="white" strokeWidth="1" />
      <path d="M30 240h420M240 30v420" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  );
}

function EcgLine() {
  return (
    <svg
      viewBox="0 0 1440 80"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-25"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 48h180l18-22 16 40 14-18h90l22-36 20 52 16-16H1440"
        fill="none"
        stroke="white"
        strokeWidth="1.6"
      />
    </svg>
  );
}

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slide = slides[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 16000);
    return () => window.clearInterval(id);
  }, [paused]);

  const go = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#143a8c] text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2a6b] via-[#1747a8] to-[#2563eb]" />
      <GlobeMark />
      <EcgLine />

      <div
        className="he-container relative z-10 grid min-h-[560px] items-center gap-6 py-8 sm:py-10 lg:grid-cols-12 lg:min-h-[620px] lg:gap-8 lg:py-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-56 overflow-hidden rounded-[20px] sm:h-72 lg:hidden">
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 90vw, 42vw"
            className="object-cover object-[center_20%]"
          />
        </div>

        <div className="relative hidden h-full min-h-[560px] lg:col-span-5 lg:block">
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 0px, 42vw"
            className="object-cover object-[center_18%] [mask-image:linear-gradient(to_right,black_72%,transparent)]"
          />
        </div>

        <div className="relative lg:col-span-7 lg:py-16 xl:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-white">
                  {slide.badge}
                </span>
              </div>

              <h1 className="font-display text-[2rem] leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-[3.35rem]">
                {slide.titleLead}
                <br />
                <span className="text-accent">{slide.titleAccent}</span>
              </h1>

              <div className="mt-7 max-w-xl rounded-[14px] border border-white/25 bg-[#0f2f7a]/55 px-4 py-3 backdrop-blur-md">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                  {slide.featuredLabel}
                </p>
                <div className="mt-1.5 min-h-[1.6em]">
                  <TypewriterNames key={slide.key} names={slide.colleges} />
                </div>
              </div>

              <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-white/80 sm:text-[15px]">
                {slide.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-accent px-6 font-body text-[15px] font-extrabold text-primary shadow-[0_8px_24px_rgba(241,184,45,0.35)] transition-transform hover:-translate-y-0.5"
                >
                  Get Expert Counselling
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
                <Link
                  href={slide.secondaryHref}
                  className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/40 px-6 font-body text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  {slide.secondaryLabel}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-3 hidden items-center lg:flex">
        <button
          type="button"
          onClick={() => go(-1)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm hover:bg-black/35"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-3 hidden items-center lg:flex">
        <button
          type="button"
          onClick={() => go(1)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm hover:bg-black/35"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, ExternalLink } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import { FadeIn } from "./ui/FadeIn";

interface ReviewItem {
  name: string;
  university: string;
  country: string;
  course: string;
  quote: string;
  image: string;
}

const reviews: ReviewItem[] = [
  {
    name: "Priya Sharma",
    university: "Kazan Federal University",
    country: "Russia",
    course: "MBBS",
    image:
      "https://i.pinimg.com/736x/30/40/11/3040115f26d6545718e80bca3fb1fa0c.jpg",
    quote:
      "Himalayan Education guided me through NEET counselling and university selection in Russia. Visa and hostel paperwork were handled smoothly, and I started MBBS on time.",
  },
  {
    name: "Rahul Patel",
    university: "Tbilisi State Medical University",
    country: "Georgia",
    course: "MBBS",
    image:
      "https://i.pinimg.com/736x/37/71/4f/37714fc967378d97d443f87a0c372d39.jpg",
    quote:
      "Transparent fee structure and honest comparisons helped me choose Georgia. The team stayed available even after I landed in Tbilisi.",
  },
  {
    name: "Ananya Gupta",
    university: "Al-Farabi Kazakh National University",
    country: "Kazakhstan",
    course: "MBBS",
    image:
      "https://i.pinimg.com/736x/3a/15/7a/3a157a46d3ba77921779b08f5d86fae1.jpg",
    quote:
      "From document verification to airport pickup coordination, Himalayan Education made my first year abroad stress-free. Highly recommend for Kazakhstan MBBS.",
  },
  {
    name: "Sneha Reddy",
    university: "Grant Medical College pathway",
    country: "India",
    course: "MBBS India",
    image:
      "https://i.pinimg.com/1200x/ec/26/16/ec261607eff327fee32c90c1d02b707c.jpg",
    quote:
      "India MBBS counselling helped me understand realistic cut-offs for my score. Their state-wise guidance was clear and practical for my family.",
  },
  {
    name: "Imran Hossain",
    university: "Dhaka National Medical College",
    country: "Bangladesh",
    course: "MBBS",
    image:
      "https://i.pinimg.com/736x/dd/4b/49/dd4b49943e2466dc27df65f1128e4b61.jpg",
    quote:
      "As an Indian student, I needed clarity on SAARC quotas and NMC compliance. Every form and embassy appointment had a checklist.",
  },
  {
    name: "Kavya Nair",
    university: "Bashkir State Medical University",
    country: "Russia",
    course: "MBBS",
    image:
      "https://i.pinimg.com/736x/4f/0a/0e/4f0a0e5242c22b392f1f200d390e29b4.jpg",
    quote:
      "The entire admission process was transparent. I received my visa on time and the university campus matched what was explained during counselling.",
  },
  {
    name: "Arjun Singh",
    university: "Batumi Shota Rustaveli State University",
    country: "Georgia",
    course: "MBBS",
    image:
      "https://i.pinimg.com/736x/ec/13/dc/ec13dc1935fb9fcac9bc752911ddb9d0.jpg",
    quote:
      "Best decision I made was choosing Himalayan Education. They helped me compare universities and pick one within my budget — forever grateful.",
  },
  {
    name: "Fatima Khan",
    university: "South Kazakhstan Medical Academy",
    country: "Kazakhstan",
    course: "MBBS",
    image:
      "https://i.pinimg.com/1200x/ad/0e/ee/ad0eee336eaa57314e59f90e95390012.jpg",
    quote:
      "From NEET score to flight tickets, everything was handled step by step. My parents were at ease knowing I was supported throughout.",
  },
];

const TestimonialSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 340;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (direction === "right" && scrollLeft + clientWidth + cardWidth >= scrollWidth - 20) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === "left" && scrollLeft - cardWidth <= 0) {
      scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (!isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const cardWidth = 340;
      if (scrollLeft + clientWidth + cardWidth >= scrollWidth - 20) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  return (
    <section className="he-section bg-background overflow-hidden">
      <div className="he-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Student stories"
            title={
              <>
                Success stories from{" "}
                <span className="text-secondary">our students</span>
              </>
            }
            description="Real journeys from families who chose calm counselling for MBBS in India and abroad."
            className="mb-4"
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <div className="group inline-flex items-center gap-3 rounded-full border border-border bg-white px-5 py-2.5 shadow-[0_4px_20px_rgba(15,32,66,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(15,32,66,0.08)]">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-accent text-accent transition-transform duration-300 group-hover:scale-110"
                  />
                ))}
                <Star className="h-3.5 w-3.5 fill-accent/40 text-accent/40" />
              </div>
              <span className="font-body text-sm font-extrabold text-primary">4.2</span>
              <span className="text-muted">·</span>
              <span className="font-body text-sm text-muted">115 Google reviews</span>
            </div>

            <a
              href="https://www.google.com/search?q=Himalayan+Edu+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-[12px] bg-accent px-5 py-2.5 font-body text-sm font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep"
            >
              View on Google
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </FadeIn>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory custom-scrollbar"
          >
            {reviews.map((review) => (
              <article
                key={review.name + review.university}
                className="he-card shrink-0 w-[300px] sm:w-[340px] snap-start p-6 flex flex-col hover:border-accent/50"
              >
                <Quote className="mb-4 h-7 w-7 text-accent-deep/70" />

                <div className="mb-4 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>

                <p className="font-body text-sm leading-relaxed text-muted flex-1">
                  “{review.quote}”
                </p>

                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-accent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={review.image}
                        alt={review.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-body text-sm font-extrabold text-primary truncate">
                        {review.name}
                      </h4>
                      <p className="font-body text-xs text-muted truncate">
                        {review.course} · {review.university}
                      </p>
                    </div>
                  </div>
                  <span className="mt-3 inline-flex rounded-full bg-accent/15 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-accent-deep">
                    {review.country}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                scroll("left");
                setTimeout(() => setIsAutoPlaying(true), 4000);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-border bg-white text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_8px_20px_rgba(15,32,66,0.12)]"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                scroll("right");
                setTimeout(() => setIsAutoPlaying(true), 4000);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-border bg-white text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_8px_20px_rgba(15,32,66,0.12)]"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

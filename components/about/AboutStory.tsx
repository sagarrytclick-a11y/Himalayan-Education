import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function AboutStory() {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Our Story"
              title={
                <>
                  Built for students who want{" "}
                  <span className="text-secondary">clarity, not chaos</span>
                </>
              }
            />
            <div className="mt-6 space-y-4 font-body text-muted leading-relaxed">
              <p>
                {SITE_IDENTITY.name} began with a simple idea: medical admissions
                should feel clear for students and parents — not rushed or
                confusing.
              </p>
              <p>
                Over the years we have worked with families across India,
                comparing colleges, fees, recognition, and timelines so decisions
                are based on facts.
              </p>
              <p>
                Today we guide aspirants for MBBS in India and abroad, MD/MS
                pathways, and related counselling — with the same calm,
                step-by-step process from first call to seat confirmation.
              </p>
            </div>
            <Link href="/contact" className="mt-7 inline-flex">
              <Button variant="accent" className="group">
                Speak with our team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-border shadow-[0_12px_32px_rgba(15,32,66,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.pinimg.com/1200x/93/10/bd/9310bd271e36a69fbfb51a782cdeda47.jpg"
                decoding="async"
                alt={`Counselling team at ${SITE_IDENTITY.name}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display text-xl font-bold text-white">
                  Guidance that stays practical
                </p>
                <p className="mt-1 font-body text-sm text-white/80">
                  Score, budget, and preference — matched honestly
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-3 hidden sm:block rounded-[12px] border border-border bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,32,66,0.1)]">
              <p className="font-display text-lg font-extrabold text-accent-deep">
                15+
              </p>
              <p className="font-body text-[11px] font-semibold text-muted">
                Years guiding families
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

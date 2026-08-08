import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import PageHero from "@/components/ui/PageHero";
import PageCTA from "@/components/ui/PageCTA";
import { Button } from "@/components/ui/Button";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";

export default function AboutPage() {
  const phoneTel = SITE_IDENTITY.contact.phone
    .split(",")[0]
    .trim()
    .replace(/[^0-9+]/g, "");

  return (
    <div className="bg-background overflow-hidden">
      <PageHero
        eyebrow={`About ${SITE_IDENTITY.name}`}
        title={
          <>
            Clear guidance from{" "}
            <span className="text-accent">NEET to admission</span>
          </>
        }
        description={`${SITE_IDENTITY.name} supports students and parents with practical counselling for MBBS in India and abroad — honest shortlists, steady follow-up, and no unnecessary noise.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        image="https://i.pinimg.com/1200x/d7/b5/f9/d7b5f917245633fb0d63badd6d68b7fa.jpg"
        imageAlt={`About ${SITE_IDENTITY.name}`}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact">
            <Button size="lg" className="group">
              Get Guidance
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/colleges/mbbs-india">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-white/30"
            >
              Explore colleges
            </Button>
          </Link>
        </div>
      </PageHero>

      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutTestimonials />

      <PageCTA
        title="Want honest guidance for your next step?"
        description="Tell us your score, budget, and preference — we’ll help you build a clear shortlist for India or abroad."
        primaryLabel="Get Guidance"
        primaryHref="/contact"
        secondaryLabel="Call now"
        secondaryHref={`tel:${phoneTel}`}
      />
    </div>
  );
}

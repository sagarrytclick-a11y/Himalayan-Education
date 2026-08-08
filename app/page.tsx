import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import StatsSection from "@/components/home/StatsSection";
import OfferingsSection from "@/components/home/OfferingsSection";
import ProcessSection from "@/components/home/ProcessSection";
import NeetRankSection from "@/components/home/NeetRankSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";
import FAQPreview from "@/components/home/FAQPreview";

const FeaturedColleges = dynamic(() => import("@/components/home/FeaturedColleges"));
const DestinationsSection = dynamic(() => import("@/components/home/DestinationsSection"));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialSection"));
const BlogTeaser = dynamic(() => import("@/components/home/BlogTeaser"));
const PopupModal = dynamic(() => import("@/components/PopupModal"));

export const metadata: Metadata = {
  title: `${SITE_IDENTITY.name} | MBBS Admission Counselling in Noida`,
  description: `${SITE_IDENTITY.name} offers clear counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance. Shortlist colleges, compare options, and plan your next step with clarity.`,
  alternates: {
    canonical: SITE_IDENTITY.website,
  },
  openGraph: {
    title: `${SITE_IDENTITY.name} | MBBS Admission Counselling in Noida`,
    description:
      "Clear guidance from NEET to admission — India, abroad, and postgraduate pathways.",
    url: SITE_IDENTITY.website,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you help with both India and abroad MBBS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We shortlist based on your NEET score, budget, and preference — including government/private seats in India and NMC-aware abroad options.",
      },
    },
    {
      "@type": "Question",
      name: "Is the first counselling call free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The first counselling session is free. We map realistic options before you commit to any application pathway.",
      },
    },
    {
      "@type": "Question",
      name: "How do you verify college recognition?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We cross-check publicly available recognition context (such as NMC/WHO listings where relevant) and explain what that means for your return pathway.",
      },
    },
    {
      "@type": "Question",
      name: "Can parents join the counselling session?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We encourage parents to join — fee structures, timelines, and hostel realities are clearer when everyone hears the same plan.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="home-stack">
        <HeroSection />
        <TrustBar />
        <StatsSection />
        <FeaturedColleges />
        <OfferingsSection />
        <ProcessSection />
        <NeetRankSection />
        <DestinationsSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <BlogTeaser />
        <CTASection />
        <FAQPreview />
      </div>
      <PopupModal />
    </div>
  );
}

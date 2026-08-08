import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/colleges/mbbs-india`;

export const metadata: Metadata = {
  title: "MBBS in India 2025-26 | Colleges, Fees & NEET Cutoffs",
  description: `Explore top MBBS colleges in India. Government & private medical colleges, fees, NEET cutoffs, and admission counselling by ${SITE_IDENTITY.name}.`,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `MBBS in India 2025-26 | ${SITE_IDENTITY.name}`,
    description:
      "Browse top Government & Private medical colleges in India. NEET cutoffs, fees, admission process, and expert counselling.",
    url: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "MBBS India", item: pageUrl },
  ],
};

export default function MbbsIndiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}

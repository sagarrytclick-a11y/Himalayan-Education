import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/neet-rank-predictor`;

export const metadata: Metadata = {
  title: "NEET Rank Predictor 2025 | Estimate Your Rank",
  description: `Predict your NEET rank from your score. Check estimated rank range, cutoff trends, and college options with ${SITE_IDENTITY.name}.`,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `NEET Rank Predictor 2025 | ${SITE_IDENTITY.name}`,
    description:
      "Estimate your NEET rank from your score. Check cutoff trends and explore college options for MBBS admission.",
    url: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "NEET Rank Predictor", item: pageUrl },
  ],
};

export default function NeetRankPredictorLayout({
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

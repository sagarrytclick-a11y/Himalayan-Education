import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/colleges/md-ms`;

export const metadata: Metadata = {
  title: "MD MS in India 2025-26 | Colleges & NEET PG",
  description: `Explore MD & MS colleges in India for postgraduate medical education. Specializations, NEET PG cutoffs, and admission guidance by ${SITE_IDENTITY.name}.`,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `MD MS in India 2025-26 | ${SITE_IDENTITY.name}`,
    description:
      "Find top MD & MS colleges in India. Browse specializations, NEET PG cutoffs, fees, and admission support.",
    url: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "MD/MS", item: pageUrl },
  ],
};

export default function MdMsLayout({
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

import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/colleges/mbbs-abroad`;

export const metadata: Metadata = {
  title: "MBBS Abroad 2025-26 | Russia, Kyrgyzstan & More",
  description: `Study MBBS abroad at medical universities in Russia, Kyrgyzstan, Kazakhstan, Nepal, Bangladesh & more. Affordable fees and admission guidance by ${SITE_IDENTITY.name}.`,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `MBBS Abroad 2025-26 | ${SITE_IDENTITY.name}`,
    description:
      "Study MBBS abroad at NMC-aware universities. Russia, Kyrgyzstan, Kazakhstan, Nepal, Bangladesh — fees, visa & admission support.",
    url: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "MBBS Abroad", item: pageUrl },
  ],
};

export default function MbbsAbroadLayout({
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

import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/blog`;

export const metadata: Metadata = {
  title: "Blog & Guides | MBBS Admission Tips",
  description: `Read MBBS admission guides, NEET counselling tips, and study-abroad insights from ${SITE_IDENTITY.name}.`,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Blog & Guides | ${SITE_IDENTITY.name}`,
    description:
      "MBBS admission guides, NEET counselling tips, and study-abroad insights for students and parents.",
    url: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl },
  ],
};

export default function BlogLayout({
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

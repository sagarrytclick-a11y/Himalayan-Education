import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/about`;

export const metadata: Metadata = {
  title: "About Us | MBBS Admission Consultants in Noida",
  description: `Learn about ${SITE_IDENTITY.name} — Noida's trusted MBBS admission consultancy with ${SITE_IDENTITY.statistics.yearsExperience} years of experience, ${SITE_IDENTITY.statistics.studentsCounselled} students guided, and ${SITE_IDENTITY.statistics.partnerColleges} partner colleges.`,
  keywords: [
    `About ${SITE_IDENTITY.name}`,
    "MBBS admission consultants Noida",
    "NEET counselling Noida",
    "MBBS abroad consultants",
    "medical admission guidance India",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `About ${SITE_IDENTITY.name} | MBBS Admission Consultants`,
    description: `Trusted MBBS admission consultants in Noida with ${SITE_IDENTITY.statistics.yearsExperience} years of experience. Clear guidance for India & abroad.`,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: SITE_IDENTITY.logo.primary,
        width: 1200,
        height: 630,
        alt: SITE_IDENTITY.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_IDENTITY.name}`,
    description: `Clear guidance from NEET to admission — India, abroad, and postgraduate pathways.`,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "About Us", item: pageUrl },
  ],
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${SITE_IDENTITY.name}`,
  url: pageUrl,
  description: `${SITE_IDENTITY.name} provides MBBS admission counselling in Noida for India and abroad.`,
  mainEntity: {
    "@type": "EducationalOrganization",
    name: SITE_IDENTITY.name,
    url: SITE_IDENTITY.website,
    email: SITE_IDENTITY.contact.email,
    telephone: SITE_IDENTITY.contact.phone.split(",")[0].trim(),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_IDENTITY.address.full,
      addressLocality: SITE_IDENTITY.address.city,
      addressRegion: "Uttar Pradesh",
      postalCode: SITE_IDENTITY.address.pincode,
      addressCountry: "IN",
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}

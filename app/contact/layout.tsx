import type { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const pageUrl = `${SITE_IDENTITY.website}/contact`;

export const metadata: Metadata = {
  title: "Contact Us | Get Guidance for MBBS Admissions",
  description: `Contact ${SITE_IDENTITY.name} to get guidance for MBBS admissions. Call ${SITE_IDENTITY.contact.phone.split(",")[0].trim()}, email ${SITE_IDENTITY.contact.email}, or visit our Noida office.`,
  keywords: [
    `Contact ${SITE_IDENTITY.name}`,
    "MBBS counselling Noida",
    "NEET admission helpline",
    "MBBS admission guidance",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Contact ${SITE_IDENTITY.name} | MBBS Admission Consultants`,
    description:
      "Reach out for expert MBBS admission counselling. Free guidance for medical admissions in India & abroad.",
    url: pageUrl,
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_IDENTITY.website },
    { "@type": "ListItem", position: 2, name: "Contact Us", item: pageUrl },
  ],
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${SITE_IDENTITY.name}`,
  url: pageUrl,
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

export default function ContactLayout({
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
          __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}

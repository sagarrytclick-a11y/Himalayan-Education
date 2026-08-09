import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { PopupProvider } from "@/contexts/PopupContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { jsonLdScript } from "@/lib/seo";

const sans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const siteUrl = SITE_IDENTITY.website;
const phone = SITE_IDENTITY.contact.phone.split(",")[0].trim().replace(/\s/g, "");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F2042",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_IDENTITY.name} | MBBS Admission Counselling in Noida`,
    template: `%s | ${SITE_IDENTITY.name}`,
  },
  description: `${SITE_IDENTITY.name} offers clear counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance. Shortlist colleges, compare fees, and plan your next step with clarity.`,
  applicationName: SITE_IDENTITY.name,
  keywords: [
    SITE_IDENTITY.name,
    "MBBS admission consultants",
    "MBBS in India",
    "MBBS abroad",
    "NEET counseling",
    "medical college admission",
    "MBBS in Russia",
    "MBBS in Kyrgyzstan",
    "MBBS in Kazakhstan",
    "study medicine abroad",
    "Noida MBBS consultant",
    "NEET UG counseling",
    "NEET PG counseling",
    "MD MS admission India",
  ],
  authors: [{ name: SITE_IDENTITY.name, url: siteUrl }],
  creator: SITE_IDENTITY.name,
  publisher: SITE_IDENTITY.name,
  category: "education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: SITE_IDENTITY.name,
    title: `${SITE_IDENTITY.name} | MBBS Admission Counselling`,
    description:
      "Clear counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance.",
    images: [
      {
        url: SITE_IDENTITY.logo.primary,
        width: 1200,
        height: 630,
        alt: `${SITE_IDENTITY.name} - Education Consultancy`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_IDENTITY.name} | MBBS Admission Counselling`,
    description: SITE_IDENTITY.tagline,
    images: [SITE_IDENTITY.logo.primary],
  },
  icons: {
    icon: [
      { url: SITE_IDENTITY.logo.favicon, type: "image/png", sizes: "any" },
      { url: "/favicon.ico", sizes: "64x64" },
    ],
    shortcut: SITE_IDENTITY.logo.favicon,
    apple: SITE_IDENTITY.logo.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: SITE_IDENTITY.name,
    legalName: SITE_IDENTITY.name,
    description: `${SITE_IDENTITY.name} offers counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance.`,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}${SITE_IDENTITY.logo.primary}`,
    },
    image: `${siteUrl}${SITE_IDENTITY.logo.primary}`,
    email: SITE_IDENTITY.contact.email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE_IDENTITY.address.landmark}, ${SITE_IDENTITY.address.building}, ${SITE_IDENTITY.address.details}`,
      addressLocality: SITE_IDENTITY.address.city,
      addressRegion: "Uttar Pradesh",
      postalCode: SITE_IDENTITY.address.pincode,
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    sameAs: [
      SITE_IDENTITY.social.instagram,
      SITE_IDENTITY.social.facebook,
      SITE_IDENTITY.social.linkedin,
      SITE_IDENTITY.social.youtube,
      SITE_IDENTITY.social.twitter,
    ].filter(Boolean),
    areaServed: ["IN", "RU", "KZ", "KG", "NP", "BD", "GE", "UZ"],
    foundingDate: "2010",
    slogan: SITE_IDENTITY.tagline,
    priceRange: "$$",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_IDENTITY.name,
    description: SITE_IDENTITY.tagline,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-IN",
  };

  return (
    <html
      lang="en-IN"
      className={`${sans.variable} h-full antialiased font-body`}
    >
      <head>
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="" />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }}
        />
        <PopupProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </PopupProvider>
      </body>
    </html>
  );
}

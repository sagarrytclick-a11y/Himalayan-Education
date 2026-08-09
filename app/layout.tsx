import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { PopupProvider } from "@/contexts/PopupContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const display = Open_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const body = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = SITE_IDENTITY.website;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F2042",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_IDENTITY.name} | MBBS Admission Counselling in Noida`,
    template: `%s | ${SITE_IDENTITY.name}`,
  },
  description: `${SITE_IDENTITY.name} offers clear counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance. Shortlist colleges, compare fees, and plan your next step with clarity.`,
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
  authors: [{ name: SITE_IDENTITY.name }],
  creator: SITE_IDENTITY.name,
  publisher: SITE_IDENTITY.name,
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
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_IDENTITY.name,
    description: `${SITE_IDENTITY.name} offers counselling for MBBS in India & abroad, MD/MS pathways, and NEET guidance.`,
    url: siteUrl,
    logo: `${siteUrl}${SITE_IDENTITY.logo.primary}`,
    email: SITE_IDENTITY.contact.email,
    telephone: SITE_IDENTITY.contact.phone
      .split(",")[0]
      .trim()
      .replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_IDENTITY.address.full,
      addressLocality: SITE_IDENTITY.address.city,
      addressRegion: "Uttar Pradesh",
      postalCode: SITE_IDENTITY.address.pincode,
      addressCountry: "IN",
    },
    sameAs: [
      SITE_IDENTITY.social.instagram,
      SITE_IDENTITY.social.facebook,
      SITE_IDENTITY.social.linkedin,
      SITE_IDENTITY.social.youtube,
    ],
    areaServed: ["IN", "RU", "KZ", "KG", "NP", "BD", "GE", "UZ"],
    foundingDate: "2010",
    slogan: SITE_IDENTITY.tagline,
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased font-body`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <PopupProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </PopupProvider>
      </body>
    </html>
  );
}

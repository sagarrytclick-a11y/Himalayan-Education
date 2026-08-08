import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${SITE_IDENTITY.website}/sitemap.xml`,
  };
}

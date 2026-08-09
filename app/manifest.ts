import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Himalayan Education - MBBS Admission Consultants",
    short_name: "Himalayan Education",
    description: "Leading MBBS admission consultancy in Noida for India & abroad medical admissions.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F2042",
    theme_color: "#0F2042",
    icons: [
      { src: "/favicon.png", sizes: "any", type: "image/png" },
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
    ],
  };
}

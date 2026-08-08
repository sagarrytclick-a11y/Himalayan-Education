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
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}

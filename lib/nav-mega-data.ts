import mbbsIndia from "../public/mbbs-india.json";
import mbbsAbroad from "../public/mbbs-abroad.json";
import mdMs from "../public/md-ms.json";

export function collegeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function countrySlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export type NavCollege = {
  id: number;
  name: string;
  city: string;
  href: string;
  type: string;
};

export type NavState = {
  name: string;
  colleges: NavCollege[];
};

export type NavCountry = {
  name: string;
  slug: string;
  href: string;
  colleges: NavCollege[];
};

export type NavMdState = {
  name: string;
  slug: string;
  href: string;
  count: number;
  initials: string;
  colleges: NavCollege[];
};

function mapCollege(c: {
  id: number;
  name: string;
  city: string;
  type?: string;
}): NavCollege {
  const slug = collegeSlug(c.name);
  return {
    id: c.id,
    name: c.name,
    city: c.city,
    type: c.type || "College",
    href: `/colleges/${slug}`,
  };
}

export const indiaStates: NavState[] = (mbbsIndia.states || []).map(
  (s: { name: string; colleges?: Array<{ id: number; name: string; city: string; type?: string }> }) => ({
    name: s.name,
    colleges: (s.colleges || []).map((c) => mapCollege(c)),
  })
);

export const abroadCountries: NavCountry[] = (mbbsAbroad.countries || []).map(
  (c: { name: string; colleges?: Array<{ id: number; name: string; city: string; type?: string }> }) => {
    const slug = countrySlug(c.name);
    return {
      name: c.name,
      slug,
      href: `/country/${slug}`,
      colleges: (c.colleges || []).map((col) => mapCollege(col)),
    };
  }
);

export const mdMsStates: NavMdState[] = (mdMs.states || []).map(
  (s: {
    name: string;
    slug: string;
    colleges?: Array<{ id: number; name: string; city: string; type?: string }>;
  }) => ({
    name: s.name,
    slug: s.slug,
    href: `/colleges/md-ms/${s.slug}`,
    count: s.colleges?.length || 0,
    initials: s.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    colleges: (s.colleges || []).map((c) => mapCollege(c)),
  })
);

export function splitGovPrivate(colleges: NavCollege[], limit = 6) {
  const gov = colleges.filter((c) => c.type.toLowerCase() === "government").slice(0, limit);
  const priv = colleges
    .filter((c) => c.type.toLowerCase() !== "government")
    .slice(0, limit);
  return { gov, priv };
}

export function collegesForIndiaState(stateName: string | "all", limit = 6) {
  if (stateName === "all") {
    const all = indiaStates.flatMap((s) => s.colleges);
    return splitGovPrivate(all, limit);
  }
  const state = indiaStates.find((s) => s.name === stateName);
  return splitGovPrivate(state?.colleges || [], limit);
}

export type InterestOption = {
  value: string;
  label: string;
  meta?: string;
  group: "pathway" | "india" | "abroad" | "mdms";
};

export const pathwayOptions: InterestOption[] = [
  { value: "mbbs-india", label: "MBBS India", group: "pathway" },
  { value: "mbbs-abroad", label: "MBBS Abroad", group: "pathway" },
  { value: "md-ms", label: "MD / MS", group: "pathway" },
  { value: "neet-ug", label: "NEET UG Counseling", group: "pathway" },
  { value: "neet-pg", label: "NEET PG Counseling", group: "pathway" },
  { value: "general-inquiry", label: "General Inquiry", group: "pathway" },
];

export const allNavColleges: InterestOption[] = [
  ...indiaStates.flatMap((s) =>
    s.colleges.map((c) => ({
      value: `college:india:${c.id}`,
      label: c.name,
      meta: `${c.city} · MBBS India · ${s.name}`,
      group: "india" as const,
    }))
  ),
  ...abroadCountries.flatMap((country) =>
    country.colleges.map((c) => ({
      value: `college:abroad:${c.id}`,
      label: c.name,
      meta: `${c.city} · MBBS Abroad · ${country.name}`,
      group: "abroad" as const,
    }))
  ),
  ...mdMsStates.flatMap((s) =>
    s.colleges.map((c) => ({
      value: `college:mdms:${c.id}`,
      label: c.name,
      meta: `${c.city} · MD / MS · ${s.name}`,
      group: "mdms" as const,
    }))
  ),
];

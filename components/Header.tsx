"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  GraduationCap,
  Globe2,
  Stethoscope,
  MapPin,
  Search,
  BookOpen,
  Activity,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "./Logo";
import { Button } from "./ui/Button";
import { usePopup } from "../contexts/PopupContext";
import { usePathname } from "next/navigation";
import {
  abroadCountries,
  collegesForIndiaState,
  indiaStates,
  mdMsStates,
  type NavCollege,
} from "@/lib/nav-mega-data";
import { SITE_IDENTITY } from "@/app/config/site_identity";

type PanelKey = "india" | "abroad" | "mdms" | "resources" | null;

const pathways: {
  key: Exclude<PanelKey, null>;
  label: string;
  href: string;
  icon: typeof GraduationCap;
}[] = [
  { key: "india", label: "MBBS India", href: "/colleges/mbbs-india", icon: GraduationCap },
  { key: "abroad", label: "MBBS Abroad", href: "/colleges/mbbs-abroad", icon: Globe2 },
  { key: "mdms", label: "MD / MS", href: "/colleges/md-ms", icon: Stethoscope },
];

function matchesQuery(c: NavCollege, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    c.name.toLowerCase().includes(needle) ||
    c.city.toLowerCase().includes(needle) ||
    c.type.toLowerCase().includes(needle)
  );
}

function MegaSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative mb-4 block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[12px] border border-border bg-white py-2.5 pl-9 pr-3 font-body text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary/30"
      />
    </label>
  );
}

function CollegeLinks({ list }: { list: NavCollege[] }) {
  if (list.length === 0) {
    return (
      <p className="font-body text-sm text-muted col-span-2">
        No colleges match your search.
      </p>
    );
  }

  return (
    <>
      {list.map((c) => (
        <Link
          key={c.id}
          href={c.href}
          prefetch={false}
          className="rounded-[12px] border border-border bg-white px-3.5 py-3 transition-colors hover:border-primary/25"
        >
          <p className="font-body text-sm font-bold text-text line-clamp-1">
            {c.name}
          </p>
          <p className="mt-1 font-body text-[11px] text-muted">
            {c.city}
            {c.type ? ` · ${c.type}` : ""}
          </p>
        </Link>
      ))}
    </>
  );
}

function IndiaPanel() {
  const [state, setState] = useState(indiaStates[0]?.name || "Delhi");
  const [query, setQuery] = useState("");
  const q = query.trim();

  const states = q
    ? indiaStates.filter(
        (s) =>
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.colleges.some((c) => matchesQuery(c, q))
      )
    : indiaStates;

  const pool = q
    ? indiaStates.flatMap((s) => s.colleges).filter((c) => matchesQuery(c, q))
    : (() => {
        const { gov, priv } = collegesForIndiaState(state, 5);
        return [...gov, ...priv];
      })();
  const list = pool.slice(0, 8);

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr_180px]">
      <div>
        <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
          States
        </p>
        <ul className="max-h-[280px] space-y-0.5 overflow-y-auto pr-1">
          {states.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => {
                  setState(s.name);
                  setQuery("");
                }}
                className={`w-full rounded-[10px] px-3 py-2 text-left font-body text-sm font-semibold transition-colors ${
                  state === s.name && !q
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-surface hover:text-primary"
                }`}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[16px] border border-border bg-surface/80 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-extrabold text-primary">
              {q ? "Search results" : state}
            </p>
            <p className="mt-0.5 font-body text-xs text-muted">
              {q
                ? `${pool.length} college${pool.length === 1 ? "" : "s"} found`
                : "Featured colleges in this state"}
            </p>
          </div>
          <MapPin className="h-4 w-4 text-accent-deep shrink-0" />
        </div>
        <MegaSearch
          value={query}
          onChange={setQuery}
          placeholder="Search college, city…"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <CollegeLinks list={list} />
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-5">
        <div>
          <GraduationCap className="h-6 w-6 text-accent-deep" />
          <p className="mt-4 font-display text-base font-extrabold text-primary leading-snug">
            Browse the full India directory
          </p>
          <p className="mt-2 font-body text-xs text-muted leading-relaxed">
            Filters for state, type, and search — with counselling support.
          </p>
        </div>
        <Link
          href="/colleges/mbbs-india"
          className="mt-6 inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary"
        >
          Open listing
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function AbroadPanel() {
  const [slug, setSlug] = useState(abroadCountries[0]?.slug || "");
  const [query, setQuery] = useState("");
  const q = query.trim();
  const active = abroadCountries.find((c) => c.slug === slug) || abroadCountries[0];

  const countries = q
    ? abroadCountries.filter(
        (c) =>
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.colleges.some((col) => matchesQuery(col, q))
      )
    : abroadCountries;

  const pool = q
    ? abroadCountries.flatMap((c) => c.colleges).filter((c) => matchesQuery(c, q))
    : active?.colleges || [];
  const list = pool.slice(0, 8);

  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr_180px]">
      <div>
        <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
          Countries
        </p>
        <ul className="max-h-[280px] space-y-0.5 overflow-y-auto pr-1">
          {countries.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => {
                  setSlug(c.slug);
                  setQuery("");
                }}
                className={`w-full rounded-[10px] px-3 py-2 text-left font-body text-sm font-semibold transition-colors ${
                  active.slug === c.slug && !q
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-surface hover:text-primary"
                }`}
              >
                {c.name}
                <span
                  className={`ml-1.5 text-[10px] ${
                    active.slug === c.slug && !q ? "text-white/70" : "text-muted"
                  }`}
                >
                  ({c.colleges.length})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[16px] border border-border bg-surface/80 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-extrabold text-primary">
              {q ? "Search results" : active.name}
            </p>
            <p className="mt-0.5 font-body text-xs text-muted">
              {q
                ? `${pool.length} college${pool.length === 1 ? "" : "s"} found`
                : `${active.colleges.length} colleges · pick one to view details`}
            </p>
          </div>
          <Globe2 className="h-4 w-4 text-accent-deep shrink-0" />
        </div>
        <MegaSearch
          value={query}
          onChange={setQuery}
          placeholder="Search college, city…"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <CollegeLinks list={list} />
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-5">
        <div>
          <Globe2 className="h-6 w-6 text-accent-deep" />
          <p className="mt-4 font-display text-base font-extrabold text-primary leading-snug">
            Explore {active.name}
          </p>
          <p className="mt-2 font-body text-xs text-muted leading-relaxed">
            Fees, recognition, and counselling for this destination.
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <Link
            href={active.href}
            className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary"
          >
            Country page
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/colleges/mbbs-abroad"
            className="block font-body text-xs font-semibold text-muted hover:text-primary"
          >
            All abroad colleges →
          </Link>
        </div>
      </div>
    </div>
  );
}

function MdMsPanel() {
  const [slug, setSlug] = useState(mdMsStates[0]?.slug || "");
  const [query, setQuery] = useState("");
  const q = query.trim();
  const active = mdMsStates.find((s) => s.slug === slug) || mdMsStates[0];

  const states = q
    ? mdMsStates.filter(
        (s) =>
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.colleges.some((c) => matchesQuery(c, q))
      )
    : mdMsStates;

  const pool = q
    ? mdMsStates.flatMap((s) => s.colleges).filter((c) => matchesQuery(c, q))
    : active?.colleges || [];
  const list = pool.slice(0, 8);

  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr_180px]">
      <div>
        <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
          States
        </p>
        <ul className="max-h-[280px] space-y-0.5 overflow-y-auto pr-1">
          {states.map((s) => (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => {
                  setSlug(s.slug);
                  setQuery("");
                }}
                className={`w-full rounded-[10px] px-3 py-2 text-left font-body text-sm font-semibold transition-colors ${
                  active.slug === s.slug && !q
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-surface hover:text-primary"
                }`}
              >
                {s.name}
                <span
                  className={`ml-1.5 text-[10px] ${
                    active.slug === s.slug && !q ? "text-white/70" : "text-muted"
                  }`}
                >
                  ({s.count})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[16px] border border-border bg-surface/80 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-extrabold text-primary">
              {q ? "Search results" : active.name}
            </p>
            <p className="mt-0.5 font-body text-xs text-muted">
              {q
                ? `${pool.length} college${pool.length === 1 ? "" : "s"} found`
                : "MD / MS colleges in this state"}
            </p>
          </div>
          <Stethoscope className="h-4 w-4 text-accent-deep shrink-0" />
        </div>
        <MegaSearch
          value={query}
          onChange={setQuery}
          placeholder="Search college, city…"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <CollegeLinks list={list} />
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-5">
        <div>
          <Stethoscope className="h-6 w-6 text-accent-deep" />
          <p className="mt-4 font-display text-base font-extrabold text-primary leading-snug">
            Full {active.name} list
          </p>
          <p className="mt-2 font-body text-xs text-muted leading-relaxed">
            See all PG options and counselling support for this state.
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <Link
            href={active.href}
            className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary"
          >
            Open state
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/colleges/md-ms"
            className="block font-body text-xs font-semibold text-muted hover:text-primary"
          >
            All MD / MS →
          </Link>
        </div>
      </div>
    </div>
  );
}

const resourceLinks = [
  {
    href: "/neet-rank-predictor",
    title: "NEET Rank Predictor",
    desc: "Estimate AIR from your score and category.",
    icon: Activity,
    badge: "NEW",
  },
  {
    href: "/blog",
    title: "Latest Updates",
    desc: "Counselling notes, cutoffs, and admission guides.",
    icon: BookOpen,
  },
  {
    href: "/about",
    title: "About us",
    desc: "How we counsel students and parents.",
    icon: GraduationCap,
  },
  {
    href: "/contact",
    title: "Contact",
    desc: "Talk to a counsellor in Noida.",
    icon: MapPin,
  },
];

function ResourcesPanel() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {resourceLinks.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-[16px] border border-border bg-white p-5 transition-colors hover:border-primary/25 hover:bg-surface"
          >
            <div className="flex items-start justify-between gap-2">
              <Icon className="h-5 w-5 text-accent-deep" />
              {item.badge && (
                <span className="rounded-full bg-accent px-2 py-0.5 font-body text-[10px] font-extrabold text-primary">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-base font-extrabold text-primary">
              {item.title}
            </p>
            <p className="mt-1.5 font-body text-xs leading-relaxed text-muted">
              {item.desc}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function useAnnounceOpen() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("he-announce", onChange);
      return () => window.removeEventListener("he-announce", onChange);
    },
    () => {
      try {
        return sessionStorage.getItem("he-announce-dismissed") !== "1";
      } catch {
        return true;
      }
    },
    () => true
  );
}

export default function Header() {
  const { openPopup } = usePopup();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [mobileSection, setMobileSection] = useState<PanelKey>(null);
  const [routeKey, setRouteKey] = useState(pathname);
  const showAnnounce = useAnnounceOpen();
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phonePrimary = SITE_IDENTITY.contact.phone.split(",")[0].trim();
  const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");

  if (pathname !== routeKey) {
    setRouteKey(pathname);
    setMobileOpen(false);
    setPanel(null);
    setMobileSection(null);
  }

  const dismissAnnounce = () => {
    try {
      sessionStorage.setItem("he-announce-dismissed", "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("he-announce"));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openPanel = (key: Exclude<PanelKey, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 200);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header
      ref={rootRef}
      className={`sticky top-0 z-50 w-full font-body transition-all duration-300 ${
        scrolled || panel
          ? "bg-white border-b border-border shadow-[0_4px_20px_rgba(15,32,66,0.06)]"
          : "bg-white/95 border-b border-transparent"
      }`}
    >
      {showAnnounce && (
        <div className="relative bg-[#0a1224] text-white">
          <div className="mx-auto flex max-w-[1360px] items-center justify-center gap-2 px-10 py-2 sm:gap-3 sm:px-12">
            <p className="min-w-0 truncate text-center font-body text-[11px] font-semibold text-white/90 sm:text-[13px]">
              <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-accent" />
              <span className="font-extrabold text-accent">NEW:</span> College
              Predictor 2026 — know which colleges match your NEET rank in
              seconds
            </p>
            <Link
              href="/neet-rank-predictor"
              className="hidden shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 font-body text-[11px] font-extrabold text-primary sm:inline-flex"
            >
              Try now
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <button
            type="button"
            onClick={dismissAnnounce}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="hidden border-b border-border bg-white sm:block">
        <div className="mx-auto flex h-11 max-w-[1360px] items-center justify-between gap-3 px-4 xl:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <a
              href={`tel:${phoneTel}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-body text-[12px] font-bold text-white"
            >
              <Phone className="h-3 w-3" />
              {phonePrimary}
            </a>
            <a
              href={`mailto:${SITE_IDENTITY.contact.email}`}
              className="inline-flex max-w-[280px] items-center gap-1.5 truncate rounded-full bg-accent px-3 py-1 font-body text-[12px] font-bold text-primary"
            >
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{SITE_IDENTITY.contact.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              {
                href: SITE_IDENTITY.social.facebook,
                label: "Facebook",
                Icon: FaFacebookF,
                className: "bg-[#1877F2] text-white",
              },
              {
                href: SITE_IDENTITY.social.instagram,
                label: "Instagram",
                Icon: FaInstagram,
                className: "bg-linear-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
              },
              {
                href: SITE_IDENTITY.social.youtube,
                label: "YouTube",
                Icon: FaYoutube,
                className: "bg-[#FF0000] text-white",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] ${item.className}`}
              >
                <item.Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center gap-3 px-4 xl:h-[72px] xl:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5"
          aria-label={`${SITE_IDENTITY.name} home`}
        >
          <Logo
            showText={false}
            className="h-9 w-9 object-contain xl:h-10 xl:w-10"
          />
          <span className="hidden font-display text-[15px] font-bold tracking-tight text-primary xl:inline">
            {SITE_IDENTITY.shortName}
          </span>
        </Link>

        <nav className="hidden min-[1180px]:flex flex-1 items-center justify-center gap-0.5">
          <Link
            href="/"
            onMouseEnter={scheduleClose}
            className={`px-2.5 py-1.5 rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-colors ${
              isActive("/") && !panel
                ? "bg-primary text-white"
                : "text-text/75 hover:text-primary hover:bg-primary/5"
            }`}
          >
            Home
          </Link>

          {pathways.map((item) => {
            const open = panel === item.key;
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => openPanel(item.key)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setPanel((v) => (v === item.key ? null : item.key))
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-colors ${
                    open || isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-text/75 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}

          <div
            className="relative"
            onMouseEnter={() => openPanel("resources")}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={panel === "resources"}
              onClick={() =>
                setPanel((v) => (v === "resources" ? null : "resources"))
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-colors ${
                panel === "resources" ||
                isActive("/blog") ||
                isActive("/about") ||
                isActive("/contact")
                  ? "bg-accent/20 text-primary"
                  : "text-text/75 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Updates
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  panel === "resources" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        <div className="hidden min-[1180px]:flex ml-auto shrink-0 items-center gap-2">
          <Link
            href="/neet-rank-predictor"
            onMouseEnter={scheduleClose}
            className="relative inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[#0F766E] px-3 font-body text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Activity className="h-3.5 w-3.5" />
            NEET Predictor
            <span className="rounded-full bg-accent px-1.5 py-px font-body text-[9px] font-extrabold text-primary">
              NEW
            </span>
          </Link>
          <Button onClick={openPopup} size="sm">
            Get Guidance
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text min-[1180px]:hidden"
          onClick={() => {
            setPanel(null);
            setMobileOpen((v) => !v);
          }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop dropdown — absolute so it always paints above the page */}
      <AnimatePresence>
        {panel && (
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full z-[60] hidden min-[1180px]:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="border-b border-border bg-white shadow-[0_16px_40px_rgba(15,32,66,0.12)]">
              <div className="he-container py-6 lg:py-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-8 rounded-full bg-accent" />
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                      Explore ·{" "}
                      {panel === "india"
                        ? "MBBS India"
                        : panel === "abroad"
                          ? "MBBS Abroad"
                          : panel === "mdms"
                            ? "MD / MS"
                            : "Guidance"}
                    </p>
                  </div>
                  <Link
                    href={
                      panel === "india"
                        ? "/colleges/mbbs-india"
                        : panel === "abroad"
                          ? "/colleges/mbbs-abroad"
                          : panel === "mdms"
                            ? "/colleges/md-ms"
                            : "/neet-rank-predictor"
                    }
                    className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary hover:text-secondary"
                    onClick={() => setPanel(null)}
                  >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {panel === "india" && <IndiaPanel />}
                {panel === "abroad" && <AbroadPanel />}
                {panel === "mdms" && <MdMsPanel />}
                {panel === "resources" && <ResourcesPanel />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="min-[1180px]:hidden overflow-hidden border-t border-border bg-white max-h-[80vh] overflow-y-auto"
          >
            <div className="he-container py-4 space-y-1">
              <Link
                href="/"
                className={`block rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                  isActive("/") ? "bg-primary text-white" : "text-text"
                }`}
              >
                Home
              </Link>

              {pathways.map((item) => (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSection((v) => (v === item.key ? null : item.key))
                    }
                    className={`flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                      isActive(item.href) || mobileSection === item.key
                        ? "bg-primary text-white"
                        : "text-text"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <item.icon
                        className={`h-4 w-4 ${
                          isActive(item.href) || mobileSection === item.key
                            ? "text-white"
                            : "text-accent-deep"
                        }`}
                      />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        mobileSection === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileSection === item.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 pb-2 pl-4"
                      >
                        <Link
                          href={item.href}
                          className="block rounded-[10px] bg-surface px-4 py-2.5 text-sm font-bold text-primary"
                        >
                          View all
                        </Link>
                        {item.key === "india" &&
                          indiaStates.slice(0, 8).map((s) => (
                            <Link
                              key={s.name}
                              href="/colleges/mbbs-india"
                              className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                            >
                              {s.name}
                            </Link>
                          ))}
                        {item.key === "abroad" &&
                          abroadCountries.map((c) => (
                            <Link
                              key={c.slug}
                              href={c.href}
                              className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                            >
                              {c.name}
                            </Link>
                          ))}
                        {item.key === "mdms" &&
                          mdMsStates.map((s) => (
                            <Link
                              key={s.slug}
                              href={s.href}
                              className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                            >
                              {s.name}
                            </Link>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileSection((v) => (v === "resources" ? null : "resources"))
                  }
                  className={`flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                    mobileSection === "resources" ||
                    isActive("/blog") ||
                    isActive("/about") ||
                    isActive("/contact")
                      ? "bg-accent/20 text-primary"
                      : "text-text"
                  }`}
                >
                  Latest Updates
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileSection === "resources" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileSection === "resources" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 pb-2 pl-4"
                    >
                      {resourceLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-[10px] px-4 py-2 text-sm font-semibold text-muted"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/neet-rank-predictor"
                className={`block rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                  isActive("/neet-rank-predictor")
                    ? "bg-primary text-white"
                    : "text-text"
                }`}
              >
                NEET Predictor
              </Link>

              <div className="pt-3">
                <Button onClick={openPopup} className="w-full" size="lg">
                  Get Guidance
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
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

type PanelKey = "india" | "abroad" | "mdms" | null;

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

export default function Header() {
  const { openPopup } = usePopup();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [mobileSection, setMobileSection] = useState<PanelKey>(null);
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setPanel(null);
    setMobileSection(null);
  }, [pathname]);

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
      className={`relative sticky top-0 z-50 w-full font-body transition-all duration-300 ${
        scrolled || panel
          ? "bg-white border-b border-border shadow-[0_4px_20px_rgba(15,32,66,0.06)]"
          : "bg-white/95 border-b border-transparent"
      }`}
    >
      <div className="he-container h-[72px] flex items-center justify-between gap-3">
        <Link href="/" className="shrink-0" aria-label={`${SITE_IDENTITY.name} home`}>
          <Logo className="h-10 w-10 sm:h-11 sm:w-11 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            onMouseEnter={scheduleClose}
            className={`px-3.5 py-2 rounded-[10px] text-sm font-bold transition-colors ${
              isActive("/") && !panel
                ? "text-primary bg-primary/8"
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-bold transition-colors ${
                    open || isActive(item.href)
                      ? "text-primary bg-primary/8"
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

          <Link
            href="/about"
            onMouseEnter={scheduleClose}
            className={`px-3.5 py-2 rounded-[10px] text-sm font-bold transition-colors ${
              isActive("/about")
                ? "text-primary bg-primary/8"
                : "text-text/75 hover:text-primary hover:bg-primary/5"
            }`}
          >
            About
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button onClick={openPopup} size="md">
            Get Guidance
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text"
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
            className="absolute left-0 right-0 top-full z-[60] hidden lg:block"
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
                          : "MD / MS"}
                    </p>
                  </div>
                  <Link
                    href={
                      panel === "india"
                        ? "/colleges/mbbs-india"
                        : panel === "abroad"
                          ? "/colleges/mbbs-abroad"
                          : "/colleges/md-ms"
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
            className="lg:hidden overflow-hidden border-t border-border bg-white max-h-[80vh] overflow-y-auto"
          >
            <div className="he-container py-4 space-y-1">
              <Link
                href="/"
                className={`block rounded-[12px] px-4 py-3 text-[15px] font-bold ${
                  isActive("/") ? "bg-primary/8 text-primary" : "text-text"
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
                    className="flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-[15px] font-bold text-text"
                  >
                    <span className="inline-flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-accent-deep" />
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

              <Link
                href="/about"
                className="block rounded-[12px] px-4 py-3 text-[15px] font-bold text-text"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block rounded-[12px] px-4 py-3 text-[15px] font-bold text-text"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block rounded-[12px] px-4 py-3 text-[15px] font-bold text-text"
              >
                Contact
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

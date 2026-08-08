"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import Logo from "./Logo";
import { Button } from "./ui/Button";
import { usePopup } from "../contexts/PopupContext";
import { SITE_IDENTITY } from "../app/config/site_identity";

const explore = [
  { name: "MBBS India", href: "/colleges/mbbs-india" },
  { name: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
  { name: "MD / MS", href: "/colleges/md-ms" },
  { name: "NEET Rank Predictor", href: "/neet-rank-predictor" },
  { name: "Get Guidance", href: "/contact" },
];

const destinations = [
  { name: "Russia", href: "/country/russia" },
  { name: "Kazakhstan", href: "/country/kazakhstan" },
  { name: "Kyrgyzstan", href: "/country/kyrgyzstan" },
  { name: "Uzbekistan", href: "/country/uzbekistan" },
  { name: "Georgia", href: "/country/georgia" },
  { name: "Nepal", href: "/country/nepal" },
  { name: "Bangladesh", href: "/country/bangladesh" },
];

const resources = [
  { name: "Blog & Guides", href: "/blog" },
  { name: "Sitemap", href: "/sitemap" },
  { name: "FAQs", href: "/#faq" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const legal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Use", href: "/terms" },
];

const social = [
  {
    label: "Instagram",
    href: SITE_IDENTITY.social.instagram,
    Icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: SITE_IDENTITY.social.facebook,
    Icon: FaFacebookF,
  },
  {
    label: "LinkedIn",
    href: SITE_IDENTITY.social.linkedin,
    Icon: FaLinkedinIn,
  },
  {
    label: "YouTube",
    href: SITE_IDENTITY.social.youtube,
    Icon: FaYoutube,
  },
];

const stats = [
  { value: SITE_IDENTITY.statistics.studentsCounselled, label: "Students guided" },
  { value: SITE_IDENTITY.statistics.yearsExperience, label: "Years experience" },
  { value: SITE_IDENTITY.statistics.partnerColleges, label: "Partner colleges" },
];

export default function Footer() {
  const { openPopup } = usePopup();
  const year = new Date().getFullYear();
  const phones = SITE_IDENTITY.contact.phone.split(",").map((p) => p.trim());

  return (
    <footer className="bg-footer text-white font-body">
      <div className="border-b border-white/10 bg-white/[0.03]">
        <div className="he-container py-8 sm:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                Start today
              </p>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-extrabold text-white leading-snug">
                Confused between India and abroad? Get a clear shortlist.
              </h3>
              <p className="mt-2 font-body text-sm text-white/60 leading-relaxed">
                Share your NEET score and preference — we&apos;ll help with colleges,
                fees, and counselling timelines.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap shrink-0">
              <Button onClick={openPopup} className="shadow-none w-full sm:w-auto">
                Get Guidance
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a
                href={`tel:${phones[0].replace(/[^0-9+]/g, "")}`}
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-[12px] border border-white/25 px-5 font-body text-sm font-bold text-white transition-colors hover:border-accent/50 hover:bg-white/5 hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                Call now
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="he-container py-6">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="font-display text-xl sm:text-2xl font-extrabold text-accent">
                  {s.value}
                </p>
                <p className="mt-1 font-body text-[11px] sm:text-xs text-white/50 uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="he-container pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + social — always left */}
          <div className="sm:col-span-2 lg:col-span-3 order-1 text-left">
            <Logo light showText className="h-12 w-12 object-contain brightness-110" />
            <p className="mt-5 text-sm leading-relaxed text-white/70 max-w-sm">
              {SITE_IDENTITY.name} supports students and parents with practical counselling
              for MBBS in India & abroad, MD/MS pathways, and NEET guidance.
            </p>
            <p className="mt-4 font-body text-xs font-semibold text-white/45 uppercase tracking-[0.12em]">
              {SITE_IDENTITY.tagline}
            </p>
            <div className="mt-6 flex flex-col items-start">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                Follow us
              </p>
              <div className="flex flex-wrap justify-start gap-2">
                {social.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-accent/45 hover:bg-white/[0.08] hover:text-accent"
                  >
                    <Icon className="h-4 w-4 text-accent" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Pathways
            </h4>
            <ul className="space-y-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 order-3">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Destinations
            </h4>
            <ul className="space-y-2.5">
              {destinations.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 order-4">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {resources.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mb-4 mt-7 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3 order-5">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="leading-relaxed">{SITE_IDENTITY.address.full}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="space-y-1">
                  {phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/[^0-9+]/g, "")}`}
                      className="block hover:text-white"
                    >
                      {p.startsWith("+") ? p : `+91 ${p}`}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`mailto:${SITE_IDENTITY.contact.email}`}
                  className="break-all hover:text-white"
                >
                  {SITE_IDENTITY.contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  Mon–Sat · {SITE_IDENTITY.officeHours.mondayToSaturday}
                  <br />
                  <span className="text-white/50">
                    Sunday · {SITE_IDENTITY.officeHours.sunday}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-[14px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Disclaimer
          </p>
          <p className="mt-2 font-body text-xs sm:text-sm leading-relaxed text-white/55">
            {SITE_IDENTITY.name} provides educational counselling and guidance only. We are
            not a university, admission authority, or counselling board. College fees, seat
            availability, rankings, recognition status, cut-offs, and admission rules change
            every year and remain the responsibility of the respective institutions and
            official counselling bodies (such as MCC / state authorities). Information on
            this website is indicative and for general awareness — always verify details
            from official sources before making decisions. Using our services does not
            guarantee admission, scholarship, visa approval, or any specific outcome.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {year} {SITE_IDENTITY.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70">
              Terms
            </Link>
            <Link href="/sitemap" className="hover:text-white/70">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

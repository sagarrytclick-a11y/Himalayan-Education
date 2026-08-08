"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePopup } from "@/contexts/PopupContext";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Award,
  Users,
  BookOpen,
  FileText,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  ClipboardList,
  Info,
  Calendar,
  Building2,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CollegeDetailSkeleton } from "@/components/ui/Skeleton";

interface CollegeData {
  id: number;
  name: string;
  city: string;
  fees: string;
  seats: number;
  recognition: string;
  ranking: string;
  type: string;
  image: string;
  admissionProcess?: string;
  placements?: string;
  entranceExams?: string[];
  academicHighlights?: string[];
  detailedFees?: {
    tuitionFee: string;
    hostelFee: string;
    otherFees: string;
  };
  documentsRequired?: string[];
}

const CollegeSlugPage: React.FC = () => {
  const params = useParams();
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [collegeType, setCollegeType] = useState<"india" | "abroad" | "mdms">(
    "india"
  );
  const [relatedColleges, setRelatedColleges] = useState<CollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "fees" | "admission" | "placement" | "documents"
  >("overview");
  const { openPopup, updateFormData } = usePopup();

  useEffect(() => {
    if (loading || !college) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(
              entry.target.id as
                | "overview"
                | "fees"
                | "admission"
                | "placement"
                | "documents"
            );
          }
        });
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
    );

    const timeoutId = setTimeout(() => {
      ["overview", "fees", "admission", "placement", "documents"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (el) observer.observe(el);
        }
      );
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loading, college]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 140;
    const top =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchCollegeBySlug = async () => {
      try {
        setLoading(true);
        const slug = params.slug as string;

        const [indiaResponse, abroadResponse, mdMsResponse] = await Promise.all([
          fetch("/mbbs-india.json"),
          fetch("/mbbs-abroad.json"),
          fetch("/md-ms.json"),
        ]);

        if (!indiaResponse.ok && !abroadResponse.ok && !mdMsResponse.ok) {
          throw new Error("Failed to fetch college data");
        }

        const toSlug = (name: string) =>
          name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        if (indiaResponse.ok) {
          const indiaData = await indiaResponse.json();
          for (const state of indiaData.states) {
            const found = state.colleges.find(
              (c: CollegeData) => toSlug(c.name) === slug
            );
            if (found) {
              setCollege(found);
              setCollegeType("india");
              setRelatedColleges(
                state.colleges
                  .filter((c: CollegeData) => c.id !== found.id)
                  .slice(0, 6)
              );
              setLoading(false);
              return;
            }
          }
        }

        if (abroadResponse.ok) {
          const abroadData = await abroadResponse.json();
          for (const country of abroadData.countries) {
            if (!country.colleges) continue;
            const found = country.colleges.find(
              (c: CollegeData) => toSlug(c.name) === slug
            );
            if (found) {
              setCollege(found);
              setCollegeType("abroad");
              setRelatedColleges(
                country.colleges
                  .filter((c: CollegeData) => c.id !== found.id)
                  .slice(0, 6)
              );
              setLoading(false);
              return;
            }
          }
        }

        if (mdMsResponse.ok) {
          const mdMsData = await mdMsResponse.json();
          for (const state of mdMsData.states || []) {
            const found = (state.colleges || []).find(
              (c: CollegeData) => toSlug(c.name) === slug
            );
            if (found) {
              setCollege(found);
              setCollegeType("mdms");
              setRelatedColleges(
                (state.colleges || [])
                  .filter((c: CollegeData) => c.id !== found.id)
                  .slice(0, 6)
              );
              setLoading(false);
              return;
            }
          }
        }

        setError("College not found");
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load college details"
        );
        setLoading(false);
      }
    };

    fetchCollegeBySlug();
  }, [params.slug]);

  if (loading) {
    return <CollegeDetailSkeleton />;
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="he-card p-10 text-center max-w-lg w-full hover:transform-none">
          <h1 className="font-display text-2xl font-extrabold text-primary mb-4">
            College Not Found
          </h1>
          <p className="font-body text-muted mb-8">
            {error || "The requested college could not be found."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/colleges/mbbs-india">
              <Button size="md">Browse India Colleges</Button>
            </Link>
            <Link href="/colleges/mbbs-abroad">
              <Button variant="accent" size="md">
                Browse Abroad Colleges
              </Button>
            </Link>
            <Link href="/colleges/md-ms">
              <Button variant="secondary" size="md">
                Browse MD/MS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getCollegeSlug = (collegeName: string) =>
    collegeName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "fees", label: "Fees", icon: IndianRupee },
    { id: "admission", label: "Admission", icon: GraduationCap },
    { id: "placement", label: "Career", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: FileText },
  ] as const;

  const pathwayLabel =
    collegeType === "india"
      ? "MBBS India"
      : collegeType === "abroad"
        ? "MBBS Abroad"
        : "MD / MS";
  const pathwayHref =
    collegeType === "india"
      ? "/colleges/mbbs-india"
      : collegeType === "abroad"
        ? "/colleges/mbbs-abroad"
        : "/colleges/md-ms";

  const feeRows = [
    {
      label: "Tuition fee (annual)",
      value: college.detailedFees?.tuitionFee || college.fees,
      note: "As published for the current cycle",
    },
    {
      label: "Hostel & mess",
      value: college.detailedFees?.hostelFee || "As per campus allotment",
      note: "May vary by room type",
    },
    {
      label: "University / misc. charges",
      value: college.detailedFees?.otherFees || "As per university norms",
      note: "Exam, lab, library, etc.",
    },
  ];

  const overviewCopy =
    collegeType === "india"
      ? `${college.name} is a ${String(college.type || "medical").toLowerCase()} medical college in ${college.city}. Recognition: ${college.recognition}. Ranking reference: ${college.ranking}. The MBBS intake listed here is ${college.seats} seats — use this page for fees, admission steps, and documents before counselling.`
      : collegeType === "abroad"
        ? `${college.name} is a medical university option for students exploring MBBS abroad, based in ${college.city}. Recognition listed: ${college.recognition}. Ranking reference: ${college.ranking}. Seat intake shown: ${college.seats}. Confirm current fees, eligibility, and visa steps with a counsellor before you apply.`
        : `${college.name} offers postgraduate medical (MD/MS) programmes in ${college.city}. Recognition: ${college.recognition}. Ranking reference: ${college.ranking}. Listed PG intake: ${college.seats} seats — use this page for fees, NEET PG admission steps, and documents before counselling.`;

  return (
    <div className="min-h-screen bg-surface font-body">
      <PageHero
        eyebrow={pathwayLabel}
        title={college.name}
        description={`${college.city} · ${college.seats} seats · ${college.recognition}`}
        image={college.image}
        imageAlt={college.name}
        imageSide="right"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: pathwayLabel, href: pathwayHref },
          { label: college.name },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-[10px] border border-white/20 bg-white/10 px-3 py-1.5 font-body text-xs font-semibold text-white">
            {college.type || "College"}
          </span>
          <span className="rounded-[10px] border border-white/20 bg-white/10 px-3 py-1.5 font-body text-xs font-semibold text-white">
            {college.recognition}
          </span>
          <span className="rounded-[10px] bg-accent px-3 py-1.5 font-body text-xs font-bold text-primary">
            {college.ranking}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-5 font-body text-sm text-white/75">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} className="text-accent" />
            {college.city}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users size={16} className="text-accent" />
            {college.seats} seats
          </span>
          <span className="inline-flex items-center gap-2">
            <Award size={16} className="text-accent" />
            {college.recognition}
          </span>
        </div>
      </PageHero>

      {/* Tabs — under header */}
      <div className="sticky top-[72px] z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="he-container">
          <nav
            aria-label="College sections"
            className="flex gap-1 overflow-x-auto no-scrollbar py-2.5"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-[10px] px-3.5 py-2 font-body text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-surface hover:text-primary"
                  }`}
                >
                  <Icon
                    size={15}
                    className={active ? "text-accent" : "text-accent-deep"}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="he-section he-container !pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            {/* Overview */}
            <section
              id="overview"
              className="scroll-mt-36 rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-[var(--shadow-soft)]"
            >
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Overview
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                About the college
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-muted">
                {overviewCopy}
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-[16px] border border-border bg-surface/80 p-5">
                  <h3 className="font-display text-base font-bold text-primary">
                    Academic notes
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {(
                      college.academicHighlights || [
                        "Clinical teaching hospital exposure",
                        "Standard MBBS curriculum as per NMC norms",
                        "Faculty-led practical training",
                        "Library and lab facilities",
                      ]
                    ).map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 font-body text-sm text-text"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-accent-deep"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[16px] border border-primary bg-primary p-5 text-white">
                  <h3 className="font-display text-base font-bold text-white">
                    At a glance
                  </h3>
                  <dl className="mt-4 space-y-3 font-body text-sm">
                    {[
                      ["Seats", String(college.seats)],
                      ["Type", college.type || "—"],
                      ["City", college.city],
                      ["Recognition", college.recognition],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-white/65">{k}</dt>
                        <dd className="font-semibold text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>

            {/* Fees table */}
            <section
              id="fees"
              className="scroll-mt-36 rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-[var(--shadow-soft)]"
            >
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Fees
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                Fee structure
              </h2>
              <p className="mt-2 max-w-2xl font-body text-sm text-muted leading-relaxed">
                Indicative annual costs. Final payable amount depends on
                counselling allotment, category, hostel choice, and university
                circulars for the admission year.
              </p>

              <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left font-body text-sm">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="px-4 py-3.5 font-semibold sm:px-5">
                          Particulars
                        </th>
                        <th className="px-4 py-3.5 font-semibold sm:px-5">
                          Amount (approx.)
                        </th>
                        <th className="hidden px-4 py-3.5 font-semibold sm:table-cell sm:px-5">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeRows.map((row, i) => (
                        <tr
                          key={row.label}
                          className={
                            i % 2 === 0 ? "bg-white" : "bg-surface/70"
                          }
                        >
                          <td className="border-t border-border px-4 py-3.5 font-semibold text-text sm:px-5">
                            {row.label}
                          </td>
                          <td className="border-t border-border px-4 py-3.5 font-bold text-primary sm:px-5">
                            {row.value}
                          </td>
                          <td className="hidden border-t border-border px-4 py-3.5 text-muted sm:table-cell sm:px-5">
                            {row.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-primary/20 bg-accent/10">
                        <td className="px-4 py-4 font-display text-base font-extrabold text-primary sm:px-5">
                          Indicative annual total
                        </td>
                        <td className="px-4 py-4 font-display text-lg font-extrabold text-accent-deep sm:px-5">
                          {college.fees}
                        </td>
                        <td className="hidden px-4 py-4 text-xs text-muted sm:table-cell sm:px-5">
                          Subject to change
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-2 font-body text-xs text-muted leading-relaxed">
                <Info size={14} className="mt-0.5 shrink-0 text-accent-deep" />
                Refundable deposits and one-time charges (if any) are usually
                collected at reporting and are not always included above.
              </p>
            </section>

            {/* Admission */}
            <section
              id="admission"
              className="scroll-mt-36 rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-[var(--shadow-soft)]"
            >
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Admission
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                How admission works
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-muted">
                {college.admissionProcess ||
                  (collegeType === "india"
                    ? "MBBS seats are filled through NEET UG followed by MCC (AIQ) and/or state counselling. Seat allotment depends on rank, category, and choices filled."
                    : collegeType === "abroad"
                      ? "Admission typically requires NEET qualification (as applicable), university offer, document verification, fee payment, and visa processing for the destination country."
                      : "MD/MS seats are typically filled through NEET PG followed by MCC and/or state counselling. Allotment depends on rank, category, and preferred specialisation.")}
              </p>

              <div className="mt-6 rounded-[14px] border border-border bg-surface/60 p-5 sm:p-6">
                <h3 className="mb-5 flex items-center gap-2 font-display text-base font-bold text-primary">
                  <ClipboardList size={18} className="text-accent-deep" />
                  Typical steps
                </h3>
                <ol className="space-y-4">
                  {(collegeType === "india"
                    ? [
                        {
                          step: "Qualify NEET UG",
                          desc: "Meet the eligibility percentile for your category.",
                        },
                        {
                          step: "Register for counselling",
                          desc: "MCC for All India Quota and/or your state counselling portal.",
                        },
                        {
                          step: "Choice filling & locking",
                          desc: "Prioritise colleges carefully before each round closes.",
                        },
                        {
                          step: "Seat allotment",
                          desc: "Check result and download the allotment letter.",
                        },
                        {
                          step: "Report & pay fees",
                          desc: "Complete document verification and fee payment at the college.",
                        },
                      ]
                    : collegeType === "mdms"
                      ? [
                          {
                            step: "Qualify NEET PG",
                            desc: "Meet the eligibility percentile for your category and branch.",
                          },
                          {
                            step: "Register for counselling",
                            desc: "MCC and/or state NEET PG counselling portals.",
                          },
                          {
                            step: "Choice filling & locking",
                            desc: "Prioritise colleges and specialisations carefully each round.",
                          },
                          {
                            step: "Seat allotment",
                            desc: "Check result and download the allotment letter.",
                          },
                          {
                            step: "Report & pay fees",
                            desc: "Complete document verification and fee payment at the college.",
                          },
                        ]
                      : [
                          {
                            step: "Shortlist universities",
                            desc: "Compare fees, recognition, language of instruction, and city.",
                          },
                          {
                            step: "Check eligibility",
                            desc: "NEET status, academics, and passport readiness.",
                          },
                          {
                            step: "Apply & get offer",
                            desc: "Submit documents and receive the admission / invitation letter.",
                          },
                          {
                            step: "Pay tuition (as guided)",
                            desc: "Follow university fee schedule — avoid unofficial channels.",
                          },
                          {
                            step: "Visa & travel",
                            desc: "Complete embassy process, then fly with reporting documents.",
                          },
                        ]
                  ).map((item, idx) => (
                    <li key={item.step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-accent">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-primary">
                          {item.step}
                        </p>
                        <p className="mt-0.5 font-body text-sm text-muted">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[14px] border border-border p-4">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                    <Calendar size={16} className="text-accent-deep" />
                    Entrance
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(
                      college.entranceExams ||
                      (collegeType === "mdms"
                        ? ["NEET PG"]
                        : collegeType === "abroad"
                          ? ["NEET UG"]
                          : ["NEET UG"])
                    ).map((exam) => (
                      <span
                        key={exam}
                        className="rounded-[8px] border border-border bg-surface px-2.5 py-1 font-body text-xs font-semibold text-text"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[14px] border border-border p-4">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-primary">
                    <Users size={16} className="text-accent-deep" />
                    Eligibility (indicative)
                  </h3>
                  <p className="mt-3 font-body text-sm text-muted leading-relaxed">
                    Age 17+, Class 12 PCB with category-wise minimum marks, and
                    a valid NEET score where required for the pathway.
                  </p>
                </div>
              </div>
            </section>

            {/* Career */}
            <section
              id="placement"
              className="scroll-mt-36 rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-[var(--shadow-soft)]"
            >
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Career
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                After MBBS
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-muted">
                {college.placements ||
                  "Graduates typically complete internship, then prepare for NEET PG / INI-CET or licensing pathways. Outcomes vary by student performance, specialisation choice, and counselling year."}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[14px] border border-border bg-surface/60 p-5">
                  <h3 className="font-display text-sm font-bold text-primary">
                    Internship
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                    Compulsory rotatory internship in the affiliated teaching
                    hospital covers core clinical departments and bedside
                    training.
                  </p>
                </div>
                <div className="rounded-[14px] border border-border bg-surface/60 p-5">
                  <h3 className="font-display text-sm font-bold text-primary">
                    PG & practice
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                    Many students aim for MD/MS via NEET PG. Abroad graduates
                    should plan licensing (e.g. FMGE/NExT) early if returning to
                    India.
                  </p>
                </div>
              </div>
            </section>

            {/* Documents */}
            <section
              id="documents"
              className="scroll-mt-36 rounded-[var(--radius-xl)] border border-border bg-white p-6 sm:p-8 shadow-[var(--shadow-soft)]"
            >
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep">
                Documents
              </p>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                Documents checklist
              </h2>
              <p className="mt-2 font-body text-sm text-muted">
                Carry originals plus photocopies when reporting. Exact list can
                vary by college / counselling authority.
              </p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {(
                  college.documentsRequired || [
                    "NEET UG admit card",
                    "NEET UG scorecard / rank letter",
                    "Class 10 certificate & marksheet",
                    "Class 12 certificate & marksheet",
                    "Photo ID (Aadhaar / PAN / passport)",
                    "Passport-size photographs",
                    "Provisional allotment letter",
                    "Category certificate (if applicable)",
                    "Migration certificate",
                    "Transfer certificate",
                  ]
                ).map((doc) => (
                  <li
                    key={doc}
                    className="flex items-center gap-2.5 rounded-[12px] border border-border bg-surface/50 px-3.5 py-3"
                  >
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-accent-deep"
                    />
                    <span className="font-body text-sm text-text">{doc}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-[12px] border border-error/20 bg-error/5 px-4 py-3 font-body text-sm text-error">
                Missing originals at reporting can lead to seat cancellation —
                verify the official list before you travel.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="sticky top-[132px] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-white shadow-[var(--shadow-soft)]">
              <div className="bg-primary p-6 text-white">
                <h3 className="font-display text-lg font-extrabold">
                  Need help shortlisting?
                </h3>
                <p className="mt-2 font-body text-sm text-white/70 leading-relaxed">
                  Get counselling support for fees, cut-offs, and reporting
                  timelines for {college.name}.
                </p>
                <Button
                  className="mt-5 w-full"
                  size="lg"
                  onClick={() => {
                    updateFormData({
                      courseInterest: `${college.name} - ${pathwayLabel}`,
                    });
                    openPopup();
                  }}
                >
                  Get Guidance
                </Button>
              </div>

              <div className="p-5">
                <table className="w-full font-body text-sm">
                  <tbody>
                    {[
                      ["Fees", college.fees],
                      ["Seats", String(college.seats)],
                      ["Type", college.type || "—"],
                      ["City", college.city],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-border last:border-0">
                        <td className="py-2.5 text-muted">{k}</td>
                        <td className="py-2.5 text-right font-semibold text-primary">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-5 space-y-1">
                  <p className="mb-2 font-body text-[10px] font-bold uppercase tracking-wider text-muted">
                    Explore
                  </p>
                  <Link
                    href="/colleges/mbbs-india"
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 font-body text-sm text-muted transition-colors hover:bg-surface hover:text-primary"
                  >
                    <BookOpen size={15} />
                    MBBS India colleges
                  </Link>
                  <Link
                    href="/colleges/mbbs-abroad"
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 font-body text-sm text-muted transition-colors hover:bg-surface hover:text-primary"
                  >
                    <MapPin size={15} />
                    MBBS abroad
                  </Link>
                  <Link
                    href="/colleges/md-ms"
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 font-body text-sm text-muted transition-colors hover:bg-surface hover:text-primary"
                  >
                    <GraduationCap size={15} />
                    MD / MS colleges
                  </Link>
                </div>
              </div>
            </div>

            {relatedColleges.length > 0 && (
              <div className="rounded-[var(--radius-xl)] border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
                <h3 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold text-primary">
                  <Building2 size={18} className="text-accent-deep" />
                  Similar colleges
                </h3>
                <div className="space-y-2">
                  {relatedColleges.map((related) => (
                    <Link
                      key={related.id}
                      href={`/colleges/${getCollegeSlug(related.name)}`}
                      className="block rounded-[12px] border border-transparent bg-surface/70 px-3.5 py-3 transition-colors hover:border-border hover:bg-white"
                    >
                      <p className="font-display text-sm font-bold text-primary line-clamp-1">
                        {related.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between font-body text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} />
                          {related.city}
                        </span>
                        <span className="font-semibold text-accent-deep">
                          {related.fees}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CollegeSlugPage;

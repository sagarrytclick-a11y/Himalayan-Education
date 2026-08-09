"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Building2,
  GraduationCap,
  Target,
  Info,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageCTA } from "@/components/ui/PageCTA";
import { Button } from "@/components/ui/Button";

interface RankEntry {
  minScore: number;
  maxScore: number;
  minRank: number;
  maxRank: number;
  label: string;
}

type CategoryId = "general" | "ews" | "obc" | "sc" | "st" | "pwbd";

interface CategoryOption {
  id: CategoryId;
  label: string;
  short: string;
  /**
   * Approx. share of candidates in this category.
   * Category rank ≈ AIR × poolShare (lower pool → better category rank).
   */
  poolShare: number;
  /**
   * How much farther AIR can still compete for reserved seats vs UR closing ranks.
   * Higher = reserved seats stay open at worse AIRs.
   */
  seatRelief: number;
  hint: string;
}

const categories: CategoryOption[] = [
  {
    id: "general",
    label: "General (UR)",
    short: "UR",
    poolShare: 1,
    seatRelief: 1,
    hint: "Unreserved All India / state quota cutoffs — toughest closing ranks.",
  },
  {
    id: "ews",
    label: "EWS",
    short: "EWS",
    poolShare: 0.12,
    seatRelief: 1.15,
    hint: "Economically Weaker Section — 10% reservation; milder cutoffs than UR.",
  },
  {
    id: "obc",
    label: "OBC-NCL",
    short: "OBC",
    poolShare: 0.27,
    seatRelief: 1.35,
    hint: "Other Backward Classes (Non-Creamy Layer) — wider seat access than UR.",
  },
  {
    id: "sc",
    label: "SC",
    short: "SC",
    poolShare: 0.15,
    seatRelief: 2.1,
    hint: "Scheduled Caste — category ranks and closing AIRs are much lower than UR.",
  },
  {
    id: "st",
    label: "ST",
    short: "ST",
    poolShare: 0.075,
    seatRelief: 2.4,
    hint: "Scheduled Tribe — usually the lowest closing ranks among vertical categories.",
  },
  {
    id: "pwbd",
    label: "PwBD",
    short: "PwBD",
    poolShare: 0.04,
    seatRelief: 2.8,
    hint: "Persons with Benchmark Disability — horizontal reservation across quotas.",
  },
];

const rankData: RankEntry[] = [
  { minScore: 720, maxScore: 720, minRank: 1, maxRank: 1, label: "AIR 1 (Top of India)" },
  { minScore: 700, maxScore: 719, minRank: 2, maxRank: 800, label: "Top 800 — Premier colleges" },
  { minScore: 680, maxScore: 699, minRank: 801, maxRank: 5000, label: "Top 5K — AIIMS / top government" },
  { minScore: 650, maxScore: 679, minRank: 5001, maxRank: 20000, label: "Top 20K — Top government colleges" },
  { minScore: 630, maxScore: 649, minRank: 20001, maxRank: 45000, label: "Top 45K — Good government colleges" },
  { minScore: 600, maxScore: 629, minRank: 45001, maxRank: 80000, label: "Top 80K — Mid government / top private" },
  { minScore: 550, maxScore: 599, minRank: 80001, maxRank: 180000, label: "Top 1.8L — Private / deemed colleges" },
  { minScore: 500, maxScore: 549, minRank: 180001, maxRank: 350000, label: "Top 3.5L — Private colleges" },
  { minScore: 450, maxScore: 499, minRank: 350001, maxRank: 580000, label: "Top 5.8L — Private / state colleges" },
  { minScore: 400, maxScore: 449, minRank: 580001, maxRank: 900000, label: "Top 9L — Private colleges (higher fees)" },
  { minScore: 300, maxScore: 399, minRank: 900001, maxRank: 1600000, label: "Top 16L — Limited options" },
  { minScore: 0, maxScore: 299, minRank: 1600001, maxRank: 2400000, label: "May not qualify for MBBS admission" },
];

const collegeCategories = [
  {
    title: "Top Government Colleges",
    rankRange: "AIR 1 – 20,000",
    icon: Trophy,
    colleges: [
      "AIIMS Delhi",
      "Maulana Azad Medical College",
      "SMS Medical College Jaipur",
      "Gandhi Medical College Bhopal",
      "King George's Medical University",
    ],
  },
  {
    title: "Good Government / Top Private",
    rankRange: "AIR 20,000 – 1,80,000",
    icon: Building2,
    colleges: [
      "Hamdard Institute of Medical Sciences",
      "JSS Medical College Mysore",
      "Christian Medical College Vellore (non-NEET)",
      "Kasturba Medical College Manipal",
    ],
  },
  {
    title: "Private / Deemed Colleges",
    rankRange: "AIR 1,80,000+",
    icon: GraduationCap,
    colleges: [
      "DY Patil Medical College",
      "SRM Medical College",
      "Sharda University",
      "Teerthanker Mahaveer Medical College",
    ],
  },
];

interface PredictionResult {
  entry: RankEntry;
  airMin: number;
  airMax: number;
  categoryMin: number;
  categoryMax: number;
  effectiveAir: number;
  outlook: { title: string; detail: string };
}

function clampRank(n: number) {
  return Math.max(1, Math.round(n));
}

function buildPrediction(score: number, cat: CategoryOption): PredictionResult | null {
  const entry = rankData.find((r) => score >= r.minScore && score <= r.maxScore);
  if (!entry) return null;

  const airMin = entry.minRank;
  const airMax = entry.maxRank;
  const airMid = (airMin + airMax) / 2;

  // Category rank ≈ position among same-category candidates
  const categoryMin = clampRank(airMin * cat.poolShare);
  const categoryMax = Math.max(categoryMin, clampRank(airMax * cat.poolShare));

  // Seat competitiveness vs UR closing ranks (lower = better chance)
  const effectiveAir = clampRank(airMid / cat.seatRelief);

  let outlook: { title: string; detail: string };
  if (effectiveAir <= 20000) {
    outlook = {
      title: "Strong government seat chances",
      detail: `Under ${cat.short}, this score often competes for good government / AIIMS-track options (state + AIQ cutoffs still apply). Est. ${cat.short} rank ~${formatRankPlain(categoryMin)}–${formatRankPlain(categoryMax)}.`,
    };
  } else if (effectiveAir <= 80000) {
    outlook = {
      title: "Solid mid-tier government / top private",
      detail: `With ${cat.label}, expect competitive state quota and stronger private options than the same AIR under General (UR).`,
    };
  } else if (effectiveAir <= 350000) {
    outlook = {
      title: "Private / deemed focused shortlist",
      detail: `${cat.short} reservation can still open select government seats in some states — private / deemed remains the safer planning path.`,
    };
  } else if (effectiveAir <= 900000) {
    outlook = {
      title: "Limited government; plan private carefully",
      detail: `Focus on affordable private or abroad backups. Even with ${cat.short}, Indian MBBS seats are tight at this score.`,
    };
  } else {
    outlook = {
      title: "Admission outlook is tight",
      detail: `Consider reattempt, state-specific rules, or MBBS abroad counselling. ${cat.label} still needs a stronger score for most Indian MBBS seats.`,
    };
  }

  return {
    entry,
    airMin,
    airMax,
    categoryMin,
    categoryMax,
    effectiveAir,
    outlook,
  };
}

function formatRankPlain(rank: number) {
  if (rank >= 100000) return `${(rank / 100000).toFixed(1)}L`;
  if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`;
  return String(rank);
}

function formatRank(rank: number) {
  if (rank >= 10000000) return `${(rank / 10000000).toFixed(1)} Cr`;
  if (rank >= 100000) return `${(rank / 100000).toFixed(1)} L`;
  if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`;
  return rank.toString();
}

const NeetRankPredictorPage: React.FC = () => {
  const [score, setScore] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("general");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const category = categories.find((c) => c.id === categoryId) || categories[0];

  const prediction = useMemo(() => {
    if (!submitted) return null;
    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > 720) return null;
    return buildPrediction(numScore, category);
  }, [submitted, score, category]);

  const handlePredict = () => {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > 720) {
      setError("Enter a valid score between 0 and 720.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        surface="surface"
        align="center"
        eyebrow="NEET 2026"
        title={
          <>
            Predict your{" "}
            <span className="text-secondary">NEET rank</span>
          </>
        }
        description="Estimate All India Rank from your NEET UG score, plus a category-wise rank and seat outlook. Approximate only — actual ranks and cutoffs vary by year, paper, and counselling round."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "NEET Rank Predictor" },
        ]}
      />

      <section className="he-section">
        <div className="he-container">
          <div className="he-card mx-auto max-w-2xl p-6 sm:p-8 hover:transform-none">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-accent/15 text-accent-deep">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-primary">
                  Enter score & category
                </h2>
                <p className="mt-1 font-body text-sm text-muted">
                  AIR from score + category rank for counselling context.
                </p>
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2.5 font-body text-sm font-semibold text-text">
                Category / caste
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((c) => {
                  const active = categoryId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCategoryId(c.id);
                        // Keep result visible — prediction recomputes via useMemo
                      }}
                      className={`rounded-[12px] border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-text hover:border-primary/30 hover:bg-white"
                      }`}
                    >
                      <span className="block font-body text-sm font-bold leading-tight">
                        {c.label}
                      </span>
                      <span
                        className={`mt-0.5 block font-body text-[10px] leading-snug ${
                          active ? "text-white/70" : "text-muted"
                        }`}
                      >
                        {c.short}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2.5 font-body text-xs text-muted leading-relaxed">
                {category.hint}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="0"
                max="720"
                value={score}
                onChange={(e) => {
                  setScore(e.target.value);
                  setSubmitted(false);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
                placeholder="e.g. 650"
                className="h-12 w-full sm:flex-1 rounded-[12px] border border-border bg-surface px-5 text-center font-display text-xl font-extrabold text-primary outline-none transition-colors placeholder:font-body placeholder:text-base placeholder:font-medium placeholder:text-muted/60 focus:border-accent focus:bg-white"
              />
              <Button onClick={handlePredict} size="lg" className="w-full sm:w-auto shrink-0 group">
                Predict rank
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {error && (
              <p className="mt-3 font-body text-sm text-error">{error}</p>
            )}

            {prediction && (
              <div className="mt-7 overflow-hidden rounded-[16px] border border-accent/30 bg-accent/10">
                <div className="grid sm:grid-cols-2 gap-3 p-5 sm:p-6">
                  <div className="rounded-[12px] border border-border bg-white p-4">
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-2">
                      Estimated All India Rank
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-primary leading-none">
                      {formatRank(prediction.airMin)}
                      <span className="mx-1.5 text-muted font-bold">–</span>
                      {formatRank(prediction.airMax)}
                    </p>
                    <p className="mt-2 font-body text-xs text-muted">
                      Same for every category at this score
                    </p>
                  </div>

                  <div className="rounded-[12px] border border-accent/40 bg-accent/10 p-4">
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep mb-2">
                      Est. {category.short} category rank
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-accent-deep leading-none">
                      {formatRank(prediction.categoryMin)}
                      <span className="mx-1.5 text-muted font-bold">–</span>
                      {formatRank(prediction.categoryMax)}
                    </p>
                    <p className="mt-2 font-body text-xs text-muted">
                      Changes with {category.label}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-accent/20 bg-white/50 px-5 py-3">
                  <div>
                    <p className="font-body text-xs font-semibold text-muted">Your score</p>
                    <p className="font-display text-xl font-extrabold text-primary">
                      {score}
                      <span className="text-sm font-bold text-muted">/720</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs font-semibold text-muted">Category</p>
                    <p className="font-display text-lg font-extrabold text-primary">
                      {category.label}
                    </p>
                  </div>
                </div>

                <div className="border-t border-accent/20 bg-white/70 px-5 py-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                    {category.label} seat outlook
                  </p>
                  <p className="mt-1.5 font-display text-base font-extrabold text-primary">
                    {prediction.outlook.title}
                  </p>
                  <p className="mt-1 font-body text-sm text-muted leading-relaxed">
                    {prediction.outlook.detail}
                  </p>
                  <p className="mt-2 font-body text-xs text-muted">
                    {prediction.entry.label}
                  </p>
                </div>

                <div className="flex items-start gap-2 border-t border-accent/20 bg-white/50 px-5 py-3">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
                  <p className="font-body text-xs text-muted leading-relaxed">
                    AIR depends on marks. Category rank and seat chances change with reservation.
                    Switch category above to compare — numbers update instantly. Approximate only.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="he-section bg-surface border-y border-border">
        <div className="he-container">
          <SectionHeader
            eyebrow="Reference"
            title={
              <>
                Score vs rank{" "}
                <span className="text-secondary">trends</span>
              </>
            }
            description="Quick lookup from previous-year NEET UG patterns (All India Rank from score)."
            className="mb-8"
          />

          <div className="overflow-hidden rounded-[16px] border border-border bg-white shadow-[0_4px_20px_rgba(15,32,66,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm font-body">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-5 py-3.5 text-left font-semibold">Score</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Est. AIR</th>
                    <th className="px-5 py-3.5 text-left font-semibold">
                      Est. {category.short} rank
                    </th>
                    <th className="px-5 py-3.5 text-left font-semibold">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {rankData.map((row, i) => {
                    const numScore = parseInt(score, 10);
                    const isActive =
                      submitted &&
                      !isNaN(numScore) &&
                      numScore >= row.minScore &&
                      numScore <= row.maxScore;
                    const catMin = clampRank(row.minRank * category.poolShare);
                    const catMax = Math.max(
                      catMin,
                      clampRank(row.maxRank * category.poolShare)
                    );
                    return (
                      <tr
                        key={`${row.minScore}-${row.maxScore}`}
                        className={`border-b border-border last:border-0 transition-colors ${
                          isActive
                            ? "bg-accent/15"
                            : i % 2 === 0
                              ? "bg-white"
                              : "bg-surface/60"
                        }`}
                      >
                        <td className="px-5 py-3 font-bold text-primary whitespace-nowrap">
                          {row.minScore === row.maxScore
                            ? row.minScore
                            : `${row.minScore} – ${row.maxScore}`}
                        </td>
                        <td className="px-5 py-3 font-semibold text-primary whitespace-nowrap">
                          {formatRank(row.minRank)} – {formatRank(row.maxRank)}
                        </td>
                        <td className="px-5 py-3 font-semibold text-accent-deep whitespace-nowrap">
                          {formatRank(catMin)} – {formatRank(catMax)}
                        </td>
                        <td className="px-5 py-3 text-muted text-xs sm:text-sm">
                          {row.label}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-center font-body text-xs text-muted">
            Table updates for <strong className="text-text">{category.label}</strong>. AIR stays
            score-based; category rank column changes with reservation pool size.
          </p>
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          <SectionHeader
            eyebrow="College targets"
            title={
              <>
                Where your rank can{" "}
                <span className="text-secondary">take you</span>
              </>
            }
            description="Sample institutions often discussed in each rank band — reserved categories may reach better seats at the same AIR. Shortlists still need personal counselling."
            className="mb-8"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collegeCategories.map((cat, i) => {
              const Icon = cat.icon;
              const featured = i === 0;
              return (
                <div
                  key={cat.title}
                  className={`group rounded-[20px] border p-6 h-full ${
                    featured
                      ? "border-primary bg-primary text-white shadow-[0_8px_28px_rgba(15,32,66,0.2)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(15,32,66,0.3)]"
                      : "he-card he-card-line border-border bg-white"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      featured ? "text-accent" : "text-accent-deep"
                    }`}
                  />
                  <h3
                    className={`mt-4 font-display text-xl font-extrabold ${
                      featured ? "text-white" : "text-text"
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`mt-1 font-body text-xs font-bold ${
                      featured ? "text-accent" : "text-accent-deep"
                    }`}
                  >
                    {cat.rankRange}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {cat.colleges.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            featured ? "text-accent" : "text-accent-deep"
                          }`}
                        />
                        <span
                          className={`font-body text-sm leading-snug ${
                            featured ? "text-white/85" : "text-muted"
                          }`}
                        >
                          {c}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PageCTA
        title="Need help with NEET counselling?"
        description="Get personalized guidance for college selection, counselling registration, and admissions."
        primaryLabel="Get Guidance"
        primaryHref="/contact"
        secondaryLabel="Browse MBBS colleges"
        secondaryHref="/colleges/mbbs-india"
      />
    </div>
  );
};

export default NeetRankPredictorPage;

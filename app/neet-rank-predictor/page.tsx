"use client";

import React, { useState } from "react";
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
  /** Lower = reserved seats open at higher AIRs (more college options at same score) */
  factor: number;
  hint: string;
}

const categories: CategoryOption[] = [
  {
    id: "general",
    label: "General (UR)",
    short: "UR",
    factor: 1,
    hint: "Unreserved All India / state quota cutoffs",
  },
  {
    id: "ews",
    label: "EWS",
    short: "EWS",
    factor: 0.92,
    hint: "Economically Weaker Section — 10% reservation",
  },
  {
    id: "obc",
    label: "OBC-NCL",
    short: "OBC",
    factor: 0.78,
    hint: "Other Backward Classes (Non-Creamy Layer)",
  },
  {
    id: "sc",
    label: "SC",
    short: "SC",
    factor: 0.55,
    hint: "Scheduled Caste — lower closing ranks vs UR",
  },
  {
    id: "st",
    label: "ST",
    short: "ST",
    factor: 0.48,
    hint: "Scheduled Tribe — category cutoffs usually lowest",
  },
  {
    id: "pwbd",
    label: "PwBD",
    short: "PwBD",
    factor: 0.42,
    hint: "Persons with Benchmark Disability — horizontal reservation",
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
    accent: true,
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
    accent: false,
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
    accent: false,
    colleges: [
      "DY Patil Medical College",
      "SRM Medical College",
      "Sharda University",
      "Teerthanker Mahaveer Medical College",
    ],
  },
];

function categoryOutlook(
  entry: RankEntry,
  cat: CategoryOption
): { title: string; detail: string } {
  const mid = (entry.minRank + entry.maxRank) / 2;
  const effective = Math.max(1, Math.round(mid * cat.factor));

  if (effective <= 20000) {
    return {
      title: "Strong government seat chances",
      detail: `Under ${cat.short}, this score band often competes for good government / AIIMS-track options in counselling (subject to state & AIQ cutoffs).`,
    };
  }
  if (effective <= 80000) {
    return {
      title: "Solid mid-tier government / top private",
      detail: `With ${cat.label}, expect competitive state quota and better private options than the same AIR under General.`,
    };
  }
  if (effective <= 350000) {
    return {
      title: "Private / deemed focused shortlist",
      detail: `${cat.short} reservation can still open select government seats in some states — private colleges remain the safer planning path.`,
    };
  }
  if (effective <= 900000) {
    return {
      title: "Limited government; plan private carefully",
      detail: `Focus on affordable private / abroad backups. Category relief for ${cat.short} is limited at this score range.`,
    };
  }
  return {
    title: "Admission outlook is tight",
    detail: `Consider reattempt, state-specific rules, or MBBS abroad counselling. ${cat.label} cutoffs still need a higher score for most Indian MBBS seats.`,
  };
}

const NeetRankPredictorPage: React.FC = () => {
  const [score, setScore] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("general");
  const [prediction, setPrediction] = useState<RankEntry | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [error, setError] = useState("");

  const category = categories.find((c) => c.id === categoryId) || categories[0];

  const handlePredict = () => {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > 720) {
      setError("Enter a valid score between 0 and 720.");
      setShowPrediction(false);
      setPrediction(null);
      return;
    }
    setError("");
    const matched = rankData.find(
      (r) => numScore >= r.minScore && numScore <= r.maxScore
    );
    setPrediction(matched || null);
    setShowPrediction(true);
  };

  const formatRank = (rank: number) => {
    if (rank >= 10000000) return `${(rank / 10000000).toFixed(1)} Cr`;
    if (rank >= 100000) return `${(rank / 100000).toFixed(1)} L`;
    if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`;
    return rank.toString();
  };

  const outlook =
    showPrediction && prediction ? categoryOutlook(prediction, category) : null;

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
        description="Estimate your All India Rank from your NEET UG score and category. Approximate only — actual ranks and cutoffs vary by year, paper, and counselling round."
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
                  AIR from score, plus category-based admission outlook.
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
                        setShowPrediction(false);
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
                  setShowPrediction(false);
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

            {showPrediction && prediction && outlook && (
              <div className="mt-7 overflow-hidden rounded-[16px] border border-accent/30 bg-accent/10">
                <div className="grid sm:grid-cols-[1fr_auto] gap-4 p-5 sm:p-6">
                  <div>
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent-deep mb-2">
                      Estimated All India Rank
                    </p>
                    <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-none">
                      {formatRank(prediction.minRank)}
                      <span className="mx-1.5 text-muted font-bold">–</span>
                      {formatRank(prediction.maxRank)}
                    </p>
                    <p className="mt-3 font-body text-sm text-muted leading-relaxed">
                      {prediction.label}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center justify-center gap-2 rounded-[12px] border border-border bg-white px-5 py-3 self-start">
                    <p className="font-body text-xs font-semibold text-muted">Your score</p>
                    <p className="font-display text-2xl font-extrabold text-accent-deep">
                      {score}
                      <span className="text-sm font-bold text-muted">/720</span>
                    </p>
                    <p className="font-body text-[11px] font-bold text-primary">
                      {category.short}
                    </p>
                  </div>
                </div>

                <div className="border-t border-accent/20 bg-white/70 px-5 py-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                    {category.label} outlook
                  </p>
                  <p className="mt-1.5 font-display text-base font-extrabold text-primary">
                    {outlook.title}
                  </p>
                  <p className="mt-1 font-body text-sm text-muted leading-relaxed">
                    {outlook.detail}
                  </p>
                </div>

                <div className="flex items-start gap-2 border-t border-accent/20 bg-white/50 px-5 py-3">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
                  <p className="font-body text-xs text-muted leading-relaxed">
                    AIR is score-based. Category changes counselling cutoffs, not the AIR formula. Use this as a starting point — not a guarantee.
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
                    <th className="px-5 py-3.5 text-left font-semibold">Est. rank</th>
                    <th className="px-5 py-3.5 text-left font-semibold">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {rankData.map((row, i) => {
                    const isActive =
                      showPrediction &&
                      prediction &&
                      parseInt(score, 10) >= row.minScore &&
                      parseInt(score, 10) <= row.maxScore;
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
                        <td className="px-5 py-3 font-semibold text-accent-deep whitespace-nowrap">
                          {formatRank(row.minRank)} – {formatRank(row.maxRank)}
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
            Ranges are approximate. Actual AIR depends on paper difficulty and total candidates. Category cutoffs differ in counselling.
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

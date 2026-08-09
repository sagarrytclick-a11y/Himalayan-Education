"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaUniversity,
  FaArrowRight,
  FaHeadset,
} from "react-icons/fa";
import { PageHero } from "@/components/ui/PageHero";
import { PageCTA } from "@/components/ui/PageCTA";
import { Button } from "@/components/ui/Button";
import { CollegeFilterBar } from "@/components/ui/CollegeFilterBar";
import { CollegeMediaCard } from "@/components/ui/CollegeMediaCard";
import { Pagination } from "@/components/ui/Pagination";
import { CollegeGridSkeleton } from "@/components/ui/Skeleton";
import { usePopup } from "@/contexts/PopupContext";

function collegeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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
}

interface StateData {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  colleges: CollegeData[];
}

interface MdMsData {
  states: StateData[];
}

const MdMsPage: React.FC = () => {
  const { openPopup } = usePopup();
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const collegesPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        let data: MdMsData | null = null;
        try {
          const res = await fetch("/md-ms.json");
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // fallback
        }
        setStates(data?.states || []);
      } catch (err) {
        console.error("Data loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const allColleges = useMemo(() => {
    return states.flatMap((state) => state.colleges);
  }, [states]);

  const filteredColleges = useMemo(() => {
    return allColleges.filter((college) => {
      const matchesState =
        selectedState === "" ||
        states.find(
          (s) =>
            s.name === selectedState &&
            s.colleges.some((c) => c.id === college.id)
        );
      const matchesSearch =
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.city.toLowerCase().includes(search.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [allColleges, selectedState, search, states]);

  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);
  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = filteredColleges.slice(
    indexOfFirstCollege,
    indexOfLastCollege
  );

  const totalSeats = allColleges.reduce(
    (acc, college) => acc + (college.seats || 0),
    0
  );

  if (loading) {
    return <CollegeGridSkeleton count={9} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-body">
      <PageHero
        eyebrow="Postgraduate Medical Directory"
        title={
          <>
            Top <span className="text-accent">MD/MS Colleges</span> in India
          </>
        }
        description="Discover top government & private medical colleges for MD/MS with complete details about fees, seats, rankings, and admissions process."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MD/MS" },
        ]}
        image="https://i.pinimg.com/736x/7c/cb/9f/7ccb9f3dc555f4784c8fb0d0d25eabc8.jpg"
        imageAlt="MD MS colleges in India"
        nativeImage
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent truncate">
              {states.length}+
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              States
            </p>
          </div>
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent truncate">
              {allColleges.length}+
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              Colleges
            </p>
          </div>
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent truncate">
              {formatSeats(totalSeats)}
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              PG Seats
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/contact">
            <Button size="md">
              Get Guidance
              <FaArrowRight className="text-xs" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="md"
            className="bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-white/30"
            onClick={openPopup}
          >
            <FaHeadset className="text-xs" />
            Speak to an Expert
          </Button>
        </div>
      </PageHero>

      {/* Main directory */}
      <section className="he-section">
        <div className="he-container">
          <div className="mb-6">
            <p className="font-body text-[12px] sm:text-[13px] font-bold tracking-[0.14em] uppercase text-accent-deep mb-3">
              PG College Directory
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
              Top MD/MS Colleges in India
            </h2>
          </div>

          <CollegeFilterBar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search college or city..."
            resultCount={filteredColleges.length}
            onReset={() => {
              setSearch("");
              setSelectedState("");
              setCurrentPage(1);
            }}
            selects={[
              {
                id: "mdms-state",
                label: "State",
                value: selectedState,
                onChange: (v) => {
                  setSelectedState(v);
                  setCurrentPage(1);
                },
                options: [
                  { value: "", label: "All states" },
                  ...states.map((s) => ({ value: s.name, label: s.name })),
                ],
              },
            ]}
          />

          {filteredColleges.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-[20px] border border-dashed border-border">
              <FaUniversity className="text-5xl text-border mx-auto mb-4" />
              <p className="font-body text-lg font-semibold text-muted">
                No colleges found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {currentColleges.map((college) => (
                  <CollegeMediaCard
                    key={college.id}
                    name={college.name}
                    city={college.city}
                    image={college.image}
                    type={college.type || "MD/MS"}
                    ranking={college.ranking}
                    fees={college.fees}
                    href={`/colleges/${collegeSlug(college.name)}`}
                    fallbackImage="/fallback-college.jpg"
                  />
                ))}
              </div>

              <Pagination
                className="mt-12"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                summary={`Showing page ${currentPage} of ${totalPages} (${filteredColleges.length} colleges listed)`}
              />
            </>
          )}
        </div>
      </section>

      <PageCTA
        title="Need MD/MS Admission Guidance?"
        description="Get expert counseling for NEET PG, choice-filling strategy, documentation, and personalized guidance from our PG admission experts."
        primaryLabel="Get Guidance"
        primaryHref="/contact"
        secondaryLabel="Call Expert Counselor"
        secondaryHref="tel:+919354023968"
      />
    </div>
  );
};

const formatSeats = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return num;
};

export default MdMsPage;

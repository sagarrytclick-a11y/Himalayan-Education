"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaUniversity,
  FaArrowRight,
  FaHeadset,
} from "react-icons/fa";
import { dataCache, CACHE_KEYS } from "@/lib/data-cache";
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
    .replace(/\s+/g, "-");
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
}

interface StateData {
  id: number;
  name: string;
  image: string;
  description: string;
  colleges: CollegeData[];
}

interface MbbsData {
  states: StateData[];
}

const MbbsIndiaPage: React.FC = () => {
  const { openPopup } = usePopup();
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "Government" | "Private">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const collegesPerPage = 12;

  useEffect(() => {
    const loadData = () => {
      try {
        const data = dataCache.get(CACHE_KEYS.MBBS_INDIA);
        setStates(data.states || []);
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
      const matchesType = selectedType === "all" || college.type === selectedType;
      const matchesSearch =
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.city.toLowerCase().includes(search.toLowerCase());
      return matchesState && matchesType && matchesSearch;
    });
  }, [allColleges, selectedState, selectedType, search, states]);

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
        eyebrow="MBBS India"
        title={
          <>
            Explore Top{" "}
            <span className="text-accent">MBBS Colleges</span> in India
          </>
        }
        description="Discover top government & private medical colleges with complete details about fees, seats, rankings and admissions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MBBS India" },
        ]}
        image="https://i.pinimg.com/736x/20/b9/9e/20b99e9d8c89e14bc61214c2884b0aff.jpg"
        imageAlt="MBBS colleges in India"
        nativeImage
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
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
              {totalSeats.toLocaleString()}+
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              Seats
            </p>
          </div>
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent truncate">
              {allColleges.filter((c) => c.type === "Government").length}+
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              Govt.
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
              College Directory
            </p>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold text-primary">
              Top MBBS Colleges in India
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
              setSelectedType("all");
              setCurrentPage(1);
            }}
            selects={[
              {
                id: "mbbs-type",
                label: "College type",
                value: selectedType,
                onChange: (v) => {
                  setSelectedType(v as "all" | "Government" | "Private");
                  setCurrentPage(1);
                },
                options: [
                  { value: "all", label: "All types" },
                  { value: "Government", label: "Government" },
                  { value: "Private", label: "Private" },
                ],
              },
              {
                id: "mbbs-state",
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
            <div className="text-center py-20 bg-surface rounded-[20px] border border-border">
              <FaUniversity className="text-5xl text-border mx-auto mb-4" />
              <p className="font-body text-lg text-muted">
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
                    type={college.type || "Medical"}
                    ranking={college.ranking}
                    fees={college.fees}
                    href={`/colleges/${collegeSlug(college.name)}`}
                  />
                ))}
              </div>

              <Pagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                summary={`Page ${currentPage} of ${totalPages} (${filteredColleges.length} colleges)`}
              />
            </>
          )}
        </div>
      </section>

      <PageCTA
        title="Need MBBS Admission Guidance?"
        description="Get expert counseling for NEET, admission process, documentation and direct guidance from our MBBS experts."
        primaryLabel="Get Guidance"
        primaryHref="/contact"
        secondaryLabel="Call Now"
        secondaryHref="tel:+919354023968"
      />
    </div>
  );
};

export default MbbsIndiaPage;

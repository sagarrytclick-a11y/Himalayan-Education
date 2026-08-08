"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaUniversity,
  FaArrowRight,
  FaHeadset,
  FaGlobeAsia,
  FaBookOpen,
  FaCheckCircle,
} from "react-icons/fa";
import { dataCache, CACHE_KEYS } from "@/lib/data-cache";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CollegeFilterBar } from "@/components/ui/CollegeFilterBar";
import { CollegeMediaCard } from "@/components/ui/CollegeMediaCard";
import { Pagination } from "@/components/ui/Pagination";
import { CollegeGridSkeleton } from "@/components/ui/Skeleton";

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
  seats?: number;
  recognition: string;
  ranking: string;
  type: string;
  image: string;
  duration?: string;
  medium?: string;
}

interface CountryData {
  id: number;
  name: string;
  flag: string;
  image: string;
  description?: string;
  universities?: number;
  courses?: string;
  colleges?: CollegeData[];
}

interface MbbsAbroadData {
  countries: CountryData[];
}

const MbbsAbroadPage: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const collegesPerPage = 12;

  useEffect(() => {
    const loadData = () => {
      try {
        const data = dataCache.get(CACHE_KEYS.MBBS_ABROAD);
        setCountries(data.countries || []);
      } catch (error) {
        console.error("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const allColleges = useMemo(() => {
    return countries.flatMap((country) => country.colleges || []);
  }, [countries]);

  const filteredColleges = useMemo(() => {
    return allColleges.filter((college) => {
      const matchCountry =
        !selectedCountry ||
        countries.find(
          (country) =>
            country.name === selectedCountry &&
            country.colleges?.some((c) => c.id === college.id)
        );
      const matchSearch =
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.city.toLowerCase().includes(search.toLowerCase());
      return matchCountry && matchSearch;
    });
  }, [allColleges, selectedCountry, search, countries]);

  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);
  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = filteredColleges.slice(
    indexOfFirstCollege,
    indexOfLastCollege
  );

  const totalCountries = countries.length;
  const totalColleges = allColleges.length;

  if (loading) {
    return <CollegeGridSkeleton count={9} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-body">
      <PageHero
        eyebrow="MBBS Abroad"
        title={
          <>
            Your gateway to{" "}
            <span className="text-accent">MBBS Abroad</span>
          </>
        }
        description="Explore top NMC & WHO approved medical universities across the world with affordable fees and global recognition."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MBBS Abroad" },
        ]}
        image="https://i.pinimg.com/736x/63/84/b8/6384b8077a4a56208bcd07a600b16181.jpg"
        imageAlt="MBBS universities abroad"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent truncate">
              {totalCountries}+
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              Countries
            </p>
          </div>
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent truncate">
              {totalColleges}+
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              Universities
            </p>
          </div>
          <div className="rounded-[12px] border border-white/15 bg-white/5 p-3 sm:p-4 text-center">
            <p className="font-display text-xl sm:text-3xl font-extrabold text-accent">
              Yes
            </p>
            <p className="font-body text-[10px] sm:text-xs text-white/70 mt-1 font-medium">
              Visa
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/contact">
            <Button size="md">
              Enquire Now
              <FaArrowRight className="text-xs" />
            </Button>
          </Link>
          <a href="tel:+919354023968">
            <Button
              variant="secondary"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-white/30"
            >
              <FaHeadset className="text-xs" />
              Speak to an Expert
            </Button>
          </a>
        </div>
      </PageHero>

      {/* Main directory */}
      <section className="he-section">
        <div className="he-container">
          <div className="mb-6">
            <p className="font-body text-[12px] sm:text-[13px] font-bold tracking-[0.14em] uppercase text-accent-deep mb-3">
              University Directory
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
              Your gateway to MBBS Abroad
            </h2>
          </div>

          <CollegeFilterBar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search university or city..."
            resultCount={filteredColleges.length}
            onReset={() => {
              setSearch("");
              setSelectedCountry("");
              setCurrentPage(1);
            }}
            selects={[
              {
                id: "abroad-country",
                label: "Country",
                value: selectedCountry,
                onChange: (v) => {
                  setSelectedCountry(v);
                  setCurrentPage(1);
                },
                options: [
                  { value: "", label: "All countries" },
                  ...countries.map((c) => ({ value: c.name, label: c.name })),
                ],
              },
            ]}
          />

          {filteredColleges.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-[20px] border border-border">
              <FaUniversity className="text-5xl text-border mx-auto mb-4" />
              <p className="font-body text-lg text-muted">
                No universities found matching your criteria.
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
                    type={college.type || "Abroad"}
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
                summary={`Page ${currentPage} of ${totalPages} (${filteredColleges.length} universities)`}
              />
            </>
          )}
        </div>
      </section>

      {/* Why choose */}
      <section className="he-section bg-surface border-t border-border">
        <div className="he-container">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-center text-primary mb-10">
            Why Choose Study Abroad?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FaGlobeAsia, text: "Global Recognition" },
              { icon: FaUniversity, text: "Affordable Fees" },
              { icon: FaBookOpen, text: "English Medium" },
              { icon: FaCheckCircle, text: "No Donation" },
            ].map((item, i) => (
              <div
                key={i}
                className="he-card p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-[10px] border border-border bg-surface flex items-center justify-center shrink-0 text-primary">
                  <item.icon className="text-sm" />
                </div>
                <span className="font-body font-bold text-text text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MbbsAbroadPage;

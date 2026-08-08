"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaGraduationCap,
  FaUniversity,
  FaGlobeAsia,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import { usePopup } from "@/contexts/PopupContext";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CollegeMediaCard } from "@/components/ui/CollegeMediaCard";
import { Pagination } from "@/components/ui/Pagination";
import { CountryDetailSkeleton } from "@/components/ui/Skeleton";

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

interface CountryData {
  id: number;
  name: string;
  flag: string;
  image: string;
  description: string;
  universities: number;
  courses: string;
  colleges?: CollegeData[];
}

interface MbbsAbroadData {
  countries: CountryData[];
}

const CountrySlugPage: React.FC = () => {
  const params = useParams();
  const { openPopup, updateFormData } = usePopup();

  const [country, setCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const collegesPerPage = 6;

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);

        const response = await fetch("/mbbs-abroad.json");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: MbbsAbroadData = await response.json();

        const slug = params.slug as string;

        const foundCountry = data.countries.find((item) => {
          const generatedSlug = item.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-");

          return generatedSlug === slug;
        });

        if (!foundCountry) {
          setError("Country not found");
        } else {
          setCountry(foundCountry);
        }
      } catch (err) {
        setError("Failed to load country");
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [params.slug]);

  if (loading) {
    return <CountryDetailSkeleton />;
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="he-card p-10 text-center max-w-lg w-full hover:transform-none">
          <h1 className="font-display text-3xl font-extrabold text-primary mb-4">
            Country Not Found
          </h1>
          <p className="font-body text-muted mb-8">
            {error || "Requested country does not exist"}
          </p>
          <Link href="/colleges/mbbs-abroad">
            <Button size="md">Back to Countries</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((country.colleges?.length || 0) / collegesPerPage);
  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = (country.colleges || []).slice(indexOfFirstCollege, indexOfLastCollege);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-surface font-body">
      <PageHero
        eyebrow="Study MBBS Abroad"
        title={
          <>
            MBBS in <span className="text-accent">{country.name}</span>
          </>
        }
        description={country.description}
        image={country.flag}
        imageAlt={`${country.name} flag`}
        imageSide="right"
        imageSize="sm"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MBBS Abroad", href: "/colleges/mbbs-abroad" },
          { label: country.name },
        ]}
      >
        <span className="inline-flex bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-[10px] text-sm font-semibold">
          NMC & WHO Aligned
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              icon: FaUniversity,
              value: String(country.colleges?.length || 0),
              label: "Medical Colleges",
            },
            {
              icon: FaGraduationCap,
              value: String(country.universities),
              label: "Universities",
            },
            {
              icon: FaGlobeAsia,
              value: "WHO & NMC",
              label: "Recognition",
            },
            {
              icon: FaMoneyBillWave,
              value: "Affordable",
              label: "Fee Structure",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[12px] border border-white/15 bg-white/5 p-4"
            >
              <stat.icon className="text-accent text-lg mb-2" />
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white truncate">
                {stat.value}
              </h3>
              <p className="font-body text-xs text-white/65 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Colleges */}
      <section className="he-section he-container">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-body text-accent-deep font-bold uppercase tracking-wider text-xs sm:text-sm mb-2">
              Top Medical Universities
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              Colleges in {country.name}
            </h2>
          </div>

          <Button
            size="md"
            onClick={() => {
              updateFormData({
                courseInterest: `MBBS in ${country.name}`,
              });
              openPopup();
            }}
          >
            Free Counseling
          </Button>
        </div>

        {country.colleges && country.colleges.length > 0 ? (
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
                paginate(page);
              }}
            />
          </>
        ) : (
          <div className="he-card p-12 text-center hover:transform-none">
            <h3 className="font-display text-3xl font-extrabold text-primary mb-4">
              No Colleges Available
            </h3>
            <p className="font-body text-muted mb-8 max-w-2xl mx-auto">
              Colleges for this country will be added soon. Please explore
              other MBBS abroad destinations.
            </p>
            <Link href="/colleges/mbbs-abroad">
              <Button size="md">Explore Other Countries</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Why study */}
      <section className="he-section bg-white border-t border-border">
        <div className="he-container">
          <div className="text-center mb-10">
            <p className="font-body text-accent-deep font-bold uppercase tracking-wider text-xs sm:text-sm mb-3">
              Benefits
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              Why Choose {country.name}?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="he-card p-8 hover:transform-none hover:shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-2xl font-extrabold text-primary mb-4">
                World-Class Education
              </h3>
              <p className="font-body text-muted leading-relaxed mb-6">
                Medical universities in {country.name} provide globally
                recognized MBBS degrees with advanced practical training,
                modern labs, and international exposure.
              </p>
              <div className="space-y-3">
                {[
                  "Internationally recognized degree",
                  "Experienced faculty members",
                  "Modern medical infrastructure",
                  "English medium education",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-text font-body"
                  >
                    <FaCheckCircle className="text-accent-deep mt-1 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-primary bg-primary p-8 text-white shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-2xl font-extrabold text-white mb-4">
                Affordable MBBS Abroad
              </h3>
              <p className="font-body text-white/75 leading-relaxed mb-6">
                Compared to private colleges in India and Western countries,
                studying MBBS in {country.name} is highly affordable with
                quality education and global opportunities.
              </p>
              <div className="space-y-3">
                {[
                  "Affordable tuition fees",
                  "Lower living expenses",
                  "Scholarship opportunities",
                  "High FMGE passing support",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 font-body text-white"
                  >
                    <FaCheckCircle className="text-accent mt-1 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Button
                className="mt-8"
                size="lg"
                onClick={() => openPopup()}
              >
                Get Free Admission Guidance
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountrySlugPage;

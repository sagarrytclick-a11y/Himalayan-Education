"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Tag,
  Filter,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageCTA from "@/components/ui/PageCTA";
import { Pagination } from "@/components/ui/Pagination";

interface BlogItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/blogs.json");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = useMemo(
    () => ["all", ...new Set(blogs.map((b) => b.category))],
    [blogs]
  );

  const tags = useMemo(
    () => ["all", ...new Set(blogs.flatMap((b) => b.tags))],
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        blog.title.toLowerCase().includes(q) ||
        blog.description.toLowerCase().includes(q) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;
      const matchesTag =
        selectedTag === "all" || blog.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogs, searchTerm, selectedCategory, selectedTag]);

  const pages = Math.ceil(filteredBlogs.length / blogsPerPage) || 1;
  const pageItems = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTag]);

  return (
    <div className="min-h-screen bg-background">
      <section className="he-section bg-surface border-b border-border">
        <div className="he-container">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-accent-deep mb-2">
              Blog
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-primary leading-tight">
              Guides & insights
            </h1>
            <p className="mt-3 font-body text-base text-muted">
              NEET, admissions, and college guidance — written for students and
              parents.
            </p>
          </div>

          {loading ? (
            <div className="he-card p-4 sm:p-5 hover:transform-none animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-5 h-11 rounded-[12px] bg-border/70" />
                <div className="lg:col-span-3 h-11 rounded-[12px] bg-border/70" />
                <div className="lg:col-span-3 h-11 rounded-[12px] bg-border/70" />
                <div className="lg:col-span-1 h-11 rounded-[12px] bg-border/40" />
              </div>
            </div>
          ) : (
            <div className="he-card p-4 sm:p-5 hover:transform-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-5 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 rounded-[12px] border border-border bg-white pl-10 pr-4 font-body text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="lg:col-span-3 relative">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-11 rounded-[12px] border border-border bg-white pl-10 pr-4 appearance-none font-body text-sm outline-none focus:border-accent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-3 relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full h-11 rounded-[12px] border border-border bg-white pl-10 pr-4 appearance-none font-body text-sm outline-none focus:border-accent"
                  >
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "all" ? "All tags" : tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-1 flex items-center justify-start lg:justify-end">
                  {(searchTerm ||
                    selectedCategory !== "all" ||
                    selectedTag !== "all") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="font-body text-sm font-semibold text-secondary hover:text-accent-deep"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="he-section">
        <div className="he-container">
          <div className="mb-8 flex items-center justify-between gap-4">
            {loading ? (
              <div className="h-4 w-28 animate-pulse rounded bg-border/70" />
            ) : (
              <>
                <p className="font-body text-sm font-semibold text-muted">
                  {filteredBlogs.length}{" "}
                  {filteredBlogs.length === 1 ? "guide" : "guides"} found
                </p>
                {pages > 1 && (
                  <p className="font-body text-sm text-muted">
                    Page {currentPage} of {pages}
                  </p>
                )}
              </>
            )}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="he-card he-card-media flex h-full flex-col overflow-hidden hover:transform-none animate-pulse"
                >
                  <div className="relative aspect-[16/10] bg-border/60" />
                  <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-3">
                    <div className="h-3 w-24 rounded bg-border/70" />
                    <div className="h-5 w-full rounded bg-border/80" />
                    <div className="h-5 w-4/5 rounded bg-border/70" />
                    <div className="h-3.5 w-full rounded bg-border/50" />
                    <div className="h-3.5 w-5/6 rounded bg-border/50" />
                    <div className="mt-auto pt-5 h-4 w-28 rounded bg-border/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : pageItems.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="he-card he-card-media group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.image || "/medical.png"}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/medical.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042]/40 via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {blog.date}
                      {blog.readTime ? ` · ${blog.readTime}` : ""}
                    </p>
                    <h3 className="he-media-title mt-2 font-display text-xl font-bold text-text leading-snug line-clamp-3">
                      {blog.title}
                    </h3>
                    <p className="mt-3 font-body text-sm text-muted leading-relaxed line-clamp-3">
                      {blog.description}
                    </p>
                    <span className="mt-auto pt-5 inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary opacity-80 transition-opacity group-hover:opacity-100">
                      Read article
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="he-card py-16 text-center px-6 hover:transform-none">
              <BookOpen className="mx-auto h-10 w-10 text-border mb-4" />
              <h3 className="font-display text-2xl font-extrabold text-primary mb-2">
                No articles found
              </h3>
              <p className="font-body text-muted mb-6">
                Try a different search or clear filters.
              </p>
              <Button onClick={clearFilters}>Reset filters</Button>
            </div>
          )}

          {!loading && (
            <Pagination
              className="mt-12"
              currentPage={currentPage}
              totalPages={pages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 280, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </section>

      {!loading && (
        <PageCTA
          title="Need help choosing a college?"
          description="Get guidance — we’ll map options around your NEET score and budget."
          primaryLabel="Get Guidance"
          primaryHref="/contact"
          secondaryLabel="Browse colleges"
          secondaryHref="/colleges/mbbs-india"
        />
      )}
    </div>
  );
};

export default BlogPage;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { FadeIn } from "../ui/FadeIn";
import { Skeleton } from "../ui/Skeleton";

interface BlogItem {
  id: number;
  title: string;
  excerpt?: string;
  description?: string;
  category?: string;
  date?: string;
  image?: string;
}

export default function BlogTeaser() {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/blogs.json")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.blogs || data.posts || [];
        setPosts(
          list.slice(0, 3).map((p: BlogItem & { description?: string }) => ({
            ...p,
            excerpt: p.excerpt || p.description,
          }))
        );
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="he-section bg-surface border-y border-border">
      <div className="he-container">
        <FadeIn>
          <div className="mb-8">
            <SectionHeader
              eyebrow="Guides & insights"
              title={
                <>
                  Read before you{" "}
                  <span className="text-secondary">decide</span>
                </>
              }
              description="Short, practical articles on NEET, counselling, and studying medicine in India or abroad."
            />
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="he-card overflow-hidden pointer-events-none hover:transform-none"
                >
                  <Skeleton className="aspect-[16/10] rounded-none" />
                  <div className="space-y-3 p-5 sm:p-6">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                </div>
              ))
            : posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.08}>
                  <Link
                    href={`/blog/${post.id}`}
                    className="he-card he-card-media group flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image || "/medical.png"}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/medical.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042]/40 via-transparent to-transparent" />
                      {post.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      {post.date && (
                        <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-muted">
                          {post.date}
                        </p>
                      )}
                      <h3 className="he-media-title mt-2 font-display text-xl font-bold text-text leading-snug line-clamp-3">
                        {post.title}
                      </h3>
                      <p className="mt-3 font-body text-sm text-muted leading-relaxed line-clamp-3">
                        {post.excerpt ||
                          post.description ||
                          "Read the full guide on Himalayan Education."}
                      </p>
                      <span className="mt-auto pt-5 inline-flex items-center gap-1.5 font-body text-sm font-bold text-primary opacity-80 transition-opacity group-hover:opacity-100">
                        Read article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-8 flex justify-center">
            <Link href="/blog">
              <Button variant="secondary" className="group">
                View all articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaArrowLeft,
  FaArrowRight,
  FaBookmark,
  FaLink,
} from "react-icons/fa";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { BlogDetailSkeleton } from "@/components/ui/Skeleton";

interface BlogItem {
  id: number;
  title: string;
  description: string;
  image: string;
  overlayText: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content?: string;
}

const BlogPostPage: React.FC = () => {
  const params = useParams();

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0 && params.id) {
      const blogId = parseInt(params.id as string);
      const foundBlog = blogs.find((b) => b.id === blogId);

      if (foundBlog) {
        setBlog(foundBlog);
      }

      setLoading(false);
    }
  }, [blogs, params.id]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/blogs.json");
      const data = await response.json();

      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getRelatedBlogs = () => {
    if (!blog) return [];

    return blogs
      .filter(
        (b) =>
          b.id !== blog.id &&
          (b.category === blog.category ||
            b.tags.some((tag) => blog.tags.includes(tag)))
      )
      .slice(0, 3);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="he-card p-10 text-center max-w-lg w-full hover:transform-none hover:shadow-[var(--shadow-soft)]">
          <h1 className="font-display text-3xl font-extrabold text-primary mb-4">
            Blog Not Found
          </h1>
          <p className="font-body text-muted mb-8">
            The article you are looking for does not exist.
          </p>
          <Link href="/blog">
            <Button>
              <FaArrowLeft />
              Back To Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedBlogs = getRelatedBlogs();

  return (
    <div className="bg-surface min-h-screen">
      <PageHero
        eyebrow={blog.category}
        title={blog.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: blog.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-body text-sm text-white/75">
          <span className="flex items-center gap-2">
            <FaRegCalendarAlt className="text-accent" />
            {blog.date}
          </span>
          <span className="flex items-center gap-2">
            <FaRegClock className="text-accent" />
            {blog.readTime}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center text-[10px] font-bold">
              {blog.author.charAt(0)}
            </span>
            By {blog.author}
          </span>
        </div>
      </PageHero>

      <section className="he-section">
        <div className="he-container max-w-4xl">
          <div className="mb-8 overflow-hidden rounded-[20px] border border-border">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 sm:h-72 object-cover"
            />
          </div>

          <div className="he-card overflow-hidden hover:transform-none hover:shadow-[var(--shadow-soft)]">
            <div className="p-6 md:p-10 border-b border-border bg-surface/50">
              <p className="font-body text-lg md:text-xl leading-relaxed text-muted italic">
                {blog.description}
              </p>
            </div>

            {blog.content && (
              <div className="p-6 md:p-10">
                <div
                  className="
                    font-body text-muted text-base md:text-lg leading-relaxed
                    whitespace-pre-line
                  "
                >
                  {blog.content}
                </div>
              </div>
            )}

            <div className="px-6 md:px-10 pb-10">
              <h3 className="font-display text-xl font-extrabold text-primary mb-5 flex items-center gap-3">
                <span className="w-8 h-1 bg-accent rounded-full" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-[12px] bg-surface border border-border text-muted text-xs md:text-sm font-semibold font-body hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="he-card mt-8 p-6 md:p-8 hover:transform-none hover:shadow-[var(--shadow-soft)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-extrabold text-primary mb-2">
                  Share This Article
                </h3>
                <p className="font-body text-sm md:text-base text-muted">
                  Help others discover this valuable medical education insight.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleCopy} variant="accent">
                  <FaLink />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <button
                  className="w-11 h-11 rounded-[12px] border border-border text-primary flex items-center justify-center hover:bg-accent hover:border-accent transition-all"
                  aria-label="Bookmark"
                >
                  <FaBookmark />
                </button>
              </div>
            </div>
          </div>

          {relatedBlogs.length > 0 && (
            <div className="mt-16 pb-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <SectionHeader
                  align="left"
                  title="Related Articles"
                  description="Continue reading more medical education insights"
                />
                <Link
                  href="/blog"
                  className="font-body text-secondary font-bold hover:text-accent-deep transition-colors flex items-center gap-2 shrink-0"
                >
                  View All Posts →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link href={`/blog/${relatedBlog.id}`} key={relatedBlog.id}>
                    <div className="group he-card overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                        <span className="absolute top-4 left-4 bg-accent text-primary text-[10px] font-bold px-3 py-1 rounded-[10px] uppercase tracking-wider font-body">
                          {relatedBlog.category}
                        </span>
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-4 text-[10px] md:text-xs font-semibold text-muted mb-4 uppercase tracking-wider font-body">
                          <span className="flex items-center gap-1.5">
                            <FaRegCalendarAlt className="text-accent-deep" />
                            {relatedBlog.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaRegClock className="text-accent-deep" />
                            {relatedBlog.readTime}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-extrabold text-primary mb-3 line-clamp-2 group-hover:text-secondary transition-colors leading-tight">
                          {relatedBlog.title}
                        </h3>

                        <p className="font-body text-sm text-muted leading-relaxed line-clamp-3 mb-6">
                          {relatedBlog.description}
                        </p>

                        <div className="mt-auto pt-5 border-t border-border text-accent-deep font-bold flex items-center justify-between font-body">
                          <span className="text-sm">Read Article</span>
                          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-primary transition-all">
                            <FaArrowRight className="text-[10px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;

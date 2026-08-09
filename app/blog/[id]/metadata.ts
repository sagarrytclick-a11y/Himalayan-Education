import { Metadata } from "next";
import { SITE_IDENTITY } from "@/app/config/site_identity";

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

export function generateBlogMetadata(blog: BlogItem): Metadata {
  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.tags,
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.image],
    },
    alternates: {
      canonical: `${SITE_IDENTITY.website}/blog/${blog.id}`,
    },
  };
}

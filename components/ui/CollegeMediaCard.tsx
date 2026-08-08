import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export interface CollegeMediaCardProps {
  name: string;
  city: string;
  href: string;
  image?: string;
  type?: string;
  ranking?: string;
  fees?: string;
  fallbackImage?: string;
}

export function CollegeMediaCard({
  name,
  city,
  href,
  image,
  type,
  ranking,
  fees,
  fallbackImage = "/medical.png",
}: CollegeMediaCardProps) {
  return (
    <Link
      href={href}
      className="he-card he-card-media group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || fallbackImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-primary">
            {type || "College"}
          </span>
          {ranking && (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-accent-deep">
              {ranking}
            </span>
          )}
        </div>
        <h3 className="he-media-title font-display text-lg font-bold leading-snug text-text line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 inline-flex items-center gap-1.5 font-body text-sm text-muted">
          <MapPin className="h-3.5 w-3.5 text-accent-deep" />
          {city}
        </p>
        {fees && (
          <p className="mt-auto border-t border-border pt-4 font-body text-sm font-bold text-text transition-colors group-hover:border-accent/40">
            {fees}
          </p>
        )}
      </div>
    </Link>
  );
}

export default CollegeMediaCard;

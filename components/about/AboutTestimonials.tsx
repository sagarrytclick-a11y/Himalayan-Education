import { Quote, Star } from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import SectionHeader from "@/components/ui/SectionHeader";

export type AboutTestimonial = {
  name: string;
  course: string;
  quote: string;
  rating: number;
  image: string;
};

export const aboutTestimonials: AboutTestimonial[] = [
  {
    name: "Meera Joshi",
    course: "MBBS · Government College, Rajasthan",
    quote: `I was confused between India and abroad. ${SITE_IDENTITY.name} explained fees, cut-offs, and timelines clearly — no pressure, just honest options.`,
    rating: 5,
    image:
      "https://i.pinimg.com/736x/92/f0/7a/92f07a26ddbf9325016a46e7bed4865a.jpg",
  },
  {
    name: "Arjun Desai",
    course: "MBBS · Georgia",
    quote:
      "From shortlisting universities to visa paperwork, the team stayed reachable. My parents finally felt confident about studying abroad.",
    rating: 5,
    image:
      "https://i.pinimg.com/1200x/00/3c/14/003c1498ac8ce504221aca9a143895df.jpg",
  },
  {
    name: "Sana Fatima",
    course: "MBBS · Private Medical College, Karnataka",
    quote:
      "Document checklists and counselling rounds were handled step by step. I got a realistic shortlist matching my NEET score and budget.",
    rating: 5,
    image:
      "https://i.pinimg.com/736x/47/84/e9/4784e97d99d60fbbc4723864e3f57281.jpg",
  },
];

export function AboutTestimonials({
  items = aboutTestimonials,
}: {
  items?: AboutTestimonial[];
}) {
  return (
    <section className="he-section bg-background">
      <div className="he-container">
        <SectionHeader
          eyebrow="Student voices"
          title={
            <>
              What families say after{" "}
              <span className="text-secondary">choosing clarity</span>
            </>
          }
          description={`Real journeys with ${SITE_IDENTITY.name} — India and abroad.`}
          className="mb-10"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <article
              key={t.name}
              className="he-card he-card-line group flex h-full flex-col p-6"
            >
              <Quote className="mb-4 h-7 w-7 text-accent-deep" />
              <div className="mb-4 flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, ri) => (
                  <Star
                    key={ri}
                    className="h-3.5 w-3.5 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="flex-1 font-body text-sm leading-relaxed text-muted">
                “{t.quote}”
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover border border-border"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-body text-sm font-extrabold text-text">
                    {t.name}
                  </h3>
                  <p className="mt-0.5 font-body text-xs text-muted">{t.course}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

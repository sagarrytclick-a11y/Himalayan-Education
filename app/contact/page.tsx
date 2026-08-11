"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CourseInterestSelect } from "@/components/ui/CourseInterestSelect";

const phonePrimary = SITE_IDENTITY.contact.phone.split(",")[0].trim();
const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "mbbs-abroad",
    neetScore: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState(""); // honeypot — leave empty

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const setService = (value: string, label: string) => {
    setFormData((prev) => ({
      ...prev,
      service: value.startsWith("college:") ? label : value,
    }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email address";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (
      formData.neetScore &&
      (Number(formData.neetScore) < 0 || Number(formData.neetScore) > 720)
    )
      errs.neetScore = "NEET score must be between 0 and 720";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        courseInterest: formData.service,
        neetScore: formData.neetScore,
        website,
      };
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "mbbs-abroad",
          neetScore: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (hasError?: boolean) =>
    `w-full h-12 px-4 rounded-[12px] border font-body text-sm text-text outline-none transition-colors bg-surface ${
      hasError
        ? "border-error focus:border-error"
        : "border-border focus:border-accent focus:bg-white"
    }`;

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        surface="surface"
        align="center"
        eyebrow="Contact"
        title={
          <>
            Get in touch with{" "}
            <span className="text-secondary">{SITE_IDENTITY.name}</span>
          </>
        }
        description="Get guidance for MBBS in India & abroad. Share your details — we’ll call you within 24 hours."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      >
        <div className="flex flex-wrap justify-center gap-3">
          <a href={`tel:${phoneTel}`}>
            <Button size="lg">
              <Phone className="h-4 w-4" />
              Call {phonePrimary}
            </Button>
          </a>
          <a href="#contact-form">
            <Button variant="accent" size="lg">
              Fill enquiry form
            </Button>
          </a>
        </div>
      </PageHero>

      {/* Quick contact strip */}
      <section className="border-b border-border bg-white">
        <div className="he-container py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Phone,
                label: "Call us",
                value: SITE_IDENTITY.contact.phone,
                href: `tel:${phoneTel}`,
              },
              {
                icon: Mail,
                label: "Email us",
                value: SITE_IDENTITY.contact.email,
                href: `mailto:${SITE_IDENTITY.contact.email}`,
              },
              {
                icon: MapPin,
                label: "Visit office",
                value: `${SITE_IDENTITY.address.city}, ${SITE_IDENTITY.address.pincode}`,
                href: "#office-map",
              },
              {
                icon: Clock,
                label: "Working hours",
                value: `Mon–Sat · ${SITE_IDENTITY.officeHours.mondayToSaturday}`,
                href: undefined,
              },
            ].map((item) => {
              const Icon = item.icon;
              const inner = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-primary/8 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-body text-xs font-bold uppercase tracking-wide text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 font-body text-sm font-semibold text-primary break-words">
                      {item.value}
                    </p>
                  </div>
                </>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-3 rounded-[16px] border border-border bg-surface/60 p-4 transition-colors hover:border-accent/40 hover:bg-white"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-[16px] border border-border bg-surface/60 p-4"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="he-section">
        <div className="he-container">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Form */}
            <div id="contact-form" className="lg:col-span-7">
              <div className="he-card p-6 sm:p-8 hover:transform-none">
                <p className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-accent-deep mb-2">
                  Enquiry form
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                  Get Guidance
                </h2>
                <p className="mt-2 font-body text-sm text-muted leading-relaxed">
                  Tell us your interest and NEET score — a counsellor will reach out soon.
                </p>

                {submitStatus === "success" && (
                  <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-success/25 bg-success/10 px-4 py-3 font-body text-sm text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Submitted successfully. We’ll contact you shortly.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="mt-6 rounded-[12px] border border-error/25 bg-error/10 px-4 py-3 font-body text-sm text-error">
                    Something went wrong. Please try again or call us.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        Full name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={fieldClass(!!errors.name)}
                      />
                      {errors.name && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                          <CircleAlert className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile"
                        className={fieldClass(!!errors.phone)}
                      />
                      {errors.phone && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                          <CircleAlert className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className={fieldClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                        <CircleAlert className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative z-10">
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        Interested in
                      </label>
                      <CourseInterestSelect
                        value={formData.service}
                        onChange={setService}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-body text-sm font-semibold text-text">
                        NEET score{" "}
                        <span className="font-normal text-muted">(optional)</span>
                      </label>
                      <input
                        type="number"
                        name="neetScore"
                        min="0"
                        max="720"
                        value={formData.neetScore}
                        onChange={handleChange}
                        placeholder="e.g. 620"
                        className={fieldClass(!!errors.neetScore)}
                      />
                      {errors.neetScore && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-error">
                          <CircleAlert className="h-3 w-3" />
                          {errors.neetScore}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="mt-2 w-full sm:w-auto min-w-[200px]"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit enquiry
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              <div className="mt-5 he-card he-card-line bg-surface p-5 sm:p-6 hover:transform-none">
                <h3 className="font-display text-base sm:text-lg font-bold text-primary mb-3">
                  Why students contact us
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Clear India vs abroad shortlists",
                    "Honest fee & recognition guidance",
                    "Document & counselling support",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" />
                      <span className="font-body text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-[var(--radius-xl)] border border-primary bg-primary p-6 text-white shadow-[var(--shadow-soft)]">
                <h3 className="font-display text-xl font-bold text-white">
                  Prefer a call?
                </h3>
                <p className="mt-2 font-body text-sm text-white/75 leading-relaxed">
                  Speak with our counselling team for quick guidance on colleges, fees, and timelines.
                </p>
                <div className="mt-5 space-y-3">
                  <a
                    href={`tel:${phoneTel}`}
                    className="flex items-center gap-3 rounded-[12px] bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent text-primary">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-body text-xs text-white/60">Phone</p>
                      <p className="font-body text-sm font-semibold text-white">
                        {SITE_IDENTITY.contact.phone}
                      </p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${SITE_IDENTITY.contact.email}`}
                    className="flex items-center gap-3 rounded-[12px] bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/15 text-accent">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-body text-xs text-white/60">Email</p>
                      <p className="font-body text-sm font-semibold text-white break-all">
                        {SITE_IDENTITY.contact.email}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              <div
                id="office-map"
                className="he-card overflow-hidden hover:transform-none"
              >
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-primary">
                    Office location
                  </h3>
                  <p className="mt-1.5 font-body text-sm text-muted leading-relaxed">
                    {SITE_IDENTITY.address.full}
                  </p>
                </div>
                <div className="h-[240px] border-t border-border">
                  <iframe
                    src="https://maps.google.com/maps?q=Silver%20Tower%20Wave%20One%20Sector%2018%20Noida&t=&z=15&ie=UTF-8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    style={{ border: 0 }}
                    className="h-full w-full"
                    title="Office location map"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

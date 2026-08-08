"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { usePopup } from "../contexts/PopupContext";
import { Button } from "./ui/Button";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const getDigits = (value: string) => value.replace(/\D/g, "");

const isValidIndianMobile = (value: string) => {
  const digits = getDigits(value);
  if (/^[6-9]\d{9}$/.test(digits)) return true;
  if (/^0[6-9]\d{9}$/.test(digits)) return true;
  if (/^91[6-9]\d{9}$/.test(digits)) return true;
  return false;
};

const ContactPopup: React.FC = () => {
  const { isOpen, closePopup, formData, updateFormData, resetForm } = usePopup();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const mobile = formData.mobile.trim();

    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) errs.email = "Enter a valid email";
    if (!mobile) errs.mobile = "Mobile is required";
    else if (!isValidIndianMobile(mobile)) errs.mobile = "Enter a valid 10-digit mobile";
    if (!formData.courseInterest) errs.courseInterest = "Select a course";

    if (formData.neetScore.trim()) {
      const score = Number(formData.neetScore);
      if (!/^\d+$/.test(formData.neetScore.trim()) || score < 0 || score > 720) {
        errs.neetScore = "Score must be 0–720";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const digits = getDigits(formData.mobile);
      const mobile =
        digits.length === 12 && digits.startsWith("91")
          ? digits.slice(2)
          : digits.length === 11 && digits.startsWith("0")
            ? digits.slice(1)
            : digits;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile,
          neetScore: formData.neetScore.trim()
            ? String(Number(formData.neetScore))
            : "",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setErrors({});
        setTimeout(() => {
          closePopup();
          resetForm();
          setSubmitStatus("idle");
        }, 1800);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setField = (field: keyof typeof formData, value: string) => {
    let next = value;
    if (field === "mobile") next = value.replace(/[^\d+\s\-]/g, "").slice(0, 16);
    if (field === "neetScore") {
      next = value.replace(/\D/g, "").slice(0, 3);
      if (next && Number(next) > 720) next = "720";
    }
    if (field === "email") next = value.replace(/\s/g, "");
    updateFormData({ [field]: next });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (!isOpen) return null;

  const inputClass = (hasError?: boolean) =>
    `h-11 w-full rounded-[12px] border bg-surface px-3.5 font-body text-sm text-text outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:bg-white ${
      hasError ? "border-error" : "border-border"
    }`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 font-body">
      <div
        className="absolute inset-0 bg-primary/50 backdrop-blur-[2px]"
        onClick={closePopup}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-popup-title"
        className="relative w-full max-w-md rounded-[20px] border border-border bg-white shadow-[0_12px_40px_rgba(15,32,66,0.16)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2
              id="contact-popup-title"
              className="font-display text-xl font-extrabold text-primary"
            >
              Get Guidance
            </h2>
            <p className="mt-0.5 font-body text-sm text-muted">
              We’ll call you within 24 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={closePopup}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border text-muted transition-colors hover:border-primary hover:text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5 p-5">
          {submitStatus === "success" && (
            <div className="rounded-[12px] border border-success/25 bg-success/10 px-3.5 py-2.5 font-body text-sm text-success">
              Submitted successfully.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="rounded-[12px] border border-error/25 bg-error/10 px-3.5 py-2.5 font-body text-sm text-error">
              Something went wrong. Please try again.
            </div>
          )}

          <div>
            <label className="mb-1 block font-body text-sm font-semibold text-text">
              Full name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="mt-1 font-body text-xs text-error">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1 block font-body text-sm font-semibold text-text">
                Mobile
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={formData.mobile}
                onChange={(e) => setField("mobile", e.target.value)}
                placeholder="10-digit mobile"
                autoComplete="tel"
                className={inputClass(!!errors.mobile)}
              />
              {errors.mobile && (
                <p className="mt-1 font-body text-xs text-error">{errors.mobile}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-semibold text-text">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="mt-1 font-body text-xs text-error">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="mb-1 block font-body text-sm font-semibold text-text">
                Course
              </label>
              <select
                value={formData.courseInterest}
                onChange={(e) => setField("courseInterest", e.target.value)}
                className={inputClass(!!errors.courseInterest)}
              >
                <option value="">Select course</option>
                <option value="mbbs-india">MBBS India</option>
                <option value="mbbs-abroad">MBBS Abroad</option>
                <option value="md-ms-bds">MD / MS / BDS</option>
              </select>
              {errors.courseInterest && (
                <p className="mt-1 font-body text-xs text-error">
                  {errors.courseInterest}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-semibold text-text">
                NEET score{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.neetScore}
                onChange={(e) => setField("neetScore", e.target.value)}
                placeholder="0–720"
                className={inputClass(!!errors.neetScore)}
              />
              {errors.neetScore && (
                <p className="mt-1 font-body text-xs text-error">
                  {errors.neetScore}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || submitStatus === "success"}
            className="mt-1 w-full"
          >
            {isSubmitting
              ? "Submitting..."
              : submitStatus === "success"
                ? "Submitted ✓"
                : "Get Guidance"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPopup;

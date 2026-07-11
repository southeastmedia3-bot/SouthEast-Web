"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactSchema, projectTypes, type ContactValues } from "@/data/contact";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[0.7rem] border border-border bg-surface px-4 py-3 type-body text-foreground placeholder:text-muted/70 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { projectType: projectTypes[0] },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-start gap-4 rounded-[1rem] border border-border bg-surface p-8"
        role="status"
      >
        <CheckCircle2 className="size-8 text-[color:var(--success)]" aria-hidden="true" />
        <h3 className="type-h4 text-foreground">Your enquiry is secured.</h3>
        <p className="type-body text-muted">
          Thank you — we&apos;ve received your brief and will respond within two business days,
          under NDA. For anything time-critical, email studio@southeastmedia.com.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot — visually hidden, off the tab order. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} htmlFor="name">
          <input id="name" className={fieldBase} placeholder="Your name" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message} htmlFor="email">
          <input
            id="email"
            type="email"
            className={fieldBase}
            placeholder="you@organization.com"
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Organization" error={errors.organization?.message} htmlFor="organization">
          <input
            id="organization"
            className={fieldBase}
            placeholder="Company / institution"
            {...register("organization")}
          />
        </Field>
        <Field label="Project type" error={errors.projectType?.message} htmlFor="projectType">
          <select id="projectType" className={cn(fieldBase, "appearance-none")} {...register("projectType")}>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Budget (optional)" error={errors.budget?.message} htmlFor="budget">
        <input
          id="budget"
          className={fieldBase}
          placeholder="e.g. $25k–50k, or to be scoped"
          {...register("budget")}
        />
      </Field>

      <Field label="Brief" error={errors.message?.message} htmlFor="message">
        <textarea
          id="message"
          rows={5}
          className={cn(fieldBase, "resize-y")}
          placeholder="What has to be true about the frame? Timeline, audience, and what success looks like."
          {...register("message")}
        />
      </Field>

      {status === "error" ? (
        <p className="type-small text-[color:var(--danger)]" role="alert">
          Something went wrong sending your enquiry. Please try again or email
          studio@southeastmedia.com.
        </p>
      ) : null}

      <Button type="submit" size="lg" loading={isSubmitting}>
        Initiate Vendor Protocol
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="type-label mb-2 block text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p className="type-caption mt-2 text-[color:var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

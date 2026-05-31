"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validators";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";

type Values = z.input<typeof profileSchema>;

export function ProfileForm({ initial }: { initial: Values }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(profileSchema), defaultValues: initial });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: Values) {
    setError(null);
    setSaved(false);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Save failed");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="Identity">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Title / role" error={errors.title?.message}>
          <Input {...register("title")} />
        </Field>
        <Field label="Tagline" error={errors.tagline?.message}>
          <Input {...register("tagline")} placeholder="One-line value prop" />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input {...register("location")} />
        </Field>
      </Section>

      <Section title="Bio">
        <Field label="Bio (markdown supported)" error={errors.bio?.message}>
          <Textarea rows={8} {...register("bio")} />
        </Field>
      </Section>

      <Section title="Media">
        <Field label="Photo URL" error={errors.photoUrl?.message}>
          <Input {...register("photoUrl")} placeholder="https://…" />
        </Field>
        <Field label="Résumé PDF URL" error={errors.resumeUrl?.message}>
          <Input {...register("resumeUrl")} placeholder="https://…" />
        </Field>
        <Field label="Accent color (hex)" error={errors.accentColor?.message}>
          <Input {...register("accentColor")} placeholder="#0ea5e9" />
        </Field>
      </Section>

      <Section title="Contact & socials">
        <Field label="Email" error={errors.email?.message}><Input type="email" {...register("email")} /></Field>
        <Field label="GitHub URL" error={errors.githubUrl?.message}><Input {...register("githubUrl")} /></Field>
        <Field label="LinkedIn URL" error={errors.linkedinUrl?.message}><Input {...register("linkedinUrl")} /></Field>
        <Field label="Twitter URL" error={errors.twitterUrl?.message}><Input {...register("twitterUrl")} /></Field>
        <Field label="Website URL" error={errors.websiteUrl?.message}><Input {...register("websiteUrl")} /></Field>
      </Section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save changes"}
        </Button>
        {saved && <p className="inline-flex items-center gap-1 text-sm text-green-500"><Check size={14} /> Saved</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="sm:col-span-2">
      <Label>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

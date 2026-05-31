"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";

type SettingsValues = {
  siteTitle: string;
  siteDescription: string;
  ogImageUrl: string;
  analyticsId: string;
  contactToEmail: string;
};

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SettingsValues>({ defaultValues: initial });
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(v: SettingsValues) {
    setErr(null);
    setOk(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteTitle: v.siteTitle,
        siteDescription: v.siteDescription,
        ogImageUrl: v.ogImageUrl || null,
        analyticsId: v.analyticsId || null,
        contactToEmail: v.contactToEmail || null,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error ?? "Save failed");
      return;
    }
    setOk(true);
    router.refresh();
    setTimeout(() => setOk(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card/60 p-6 space-y-4">
      <div><Label>Site title</Label><Input {...register("siteTitle", { required: true })} /><FieldError message={errors.siteTitle && "Required"} /></div>
      <div><Label>Site description</Label><Textarea rows={3} {...register("siteDescription", { required: true })} /><FieldError message={errors.siteDescription && "Required"} /></div>
      <div><Label>OG image URL</Label><Input {...register("ogImageUrl")} placeholder="https://…" /></div>
      <div><Label>Contact recipient email</Label><Input type="email" {...register("contactToEmail")} /></div>
      <div><Label>Analytics ID</Label><Input {...register("analyticsId")} placeholder="G-XXXX or Plausible domain" /></div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving</> : "Save"}
        </Button>
        {ok && <span className="inline-flex items-center gap-1 text-sm text-green-500"><Check size={14} /> Saved</span>}
      </div>
    </form>
  );
}

export function PasswordForm() {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<{ currentPassword: string; newPassword: string }>();
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(v: { currentPassword: string; newPassword: string }) {
    setErr(null); setOk(false);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error ?? "Failed");
      return;
    }
    setOk(true);
    reset();
    setTimeout(() => setOk(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card/60 p-6 space-y-4">
      <div><Label>Current password</Label><Input type="password" {...register("currentPassword", { required: true, minLength: 8 })} /><FieldError message={errors.currentPassword && "Min 8 chars"} /></div>
      <div><Label>New password</Label><Input type="password" {...register("newPassword", { required: true, minLength: 8 })} /><FieldError message={errors.newPassword && "Min 8 chars"} /></div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null} Change password
        </Button>
        {ok && <span className="inline-flex items-center gap-1 text-sm text-green-500"><Check size={14} /> Updated</span>}
      </div>
    </form>
  );
}

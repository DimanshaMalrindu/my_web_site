"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(data: ContactInput) {
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `Request failed (${res.status})`);
      }
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* honeypot — must stay empty */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject (optional)</Label>
        <Input id="subject" placeholder="What's this about?" {...register("subject")} />
        <FieldError message={errors.subject?.message} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} placeholder="Tell me about your project, role, or idea…" {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send message"}
        </Button>
        {status === "success" && (
          <p className="inline-flex items-center gap-1 text-sm text-green-500">
            <CheckCircle2 size={14} /> Thanks! I&apos;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="inline-flex items-center gap-1 text-sm text-red-500">
            <AlertCircle size={14} /> {errorMsg}
          </p>
        )}
      </div>
    </form>
  );
}

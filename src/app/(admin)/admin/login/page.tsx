"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Loader2, Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setError(null);
    const res = await signIn("credentials", { ...data, redirect: false });
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    router.replace(from);
    router.refresh();
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-[var(--accent-foreground)]">
            <Lock size={20} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Admin sign-in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Restricted area.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card/60 p-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
            <FieldError message={errors.password?.message} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", ...opts }).format(d);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

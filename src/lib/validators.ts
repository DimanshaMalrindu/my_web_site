import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email").max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  // honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.input<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  tagline: z.string().max(240).optional().nullable(),
  bio: z.string().max(8000).default(""),
  location: z.string().max(120).optional().nullable(),
  photoUrl: z.string().url().optional().nullable().or(z.literal("")),
  resumeUrl: z.string().url().optional().nullable().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0ea5e9"),
  email: z.string().email().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const projectSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(400),
  description: z.string().max(20000).default(""),
  techStack: z.array(z.string().max(40)).max(40).default([]),
  images: z.array(z.string().url()).max(20).default([]),
  demoUrl: z.string().url().optional().nullable().or(z.literal("")),
  repoUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const achievementSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().max(160).optional().nullable(),
  date: z.string().datetime().optional().nullable().or(z.literal("")),
  link: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().max(60).optional().nullable(),
  icon: z.string().max(60).optional().nullable(),
  order: z.number().int().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1).max(160),
  role: z.string().min(1).max(160),
  location: z.string().max(120).optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable().or(z.literal("")),
  current: z.boolean().default(false),
  bullets: z.array(z.string().max(500)).max(20).default([]),
  order: z.number().int().default(0),
});

export const repoOverrideSchema = z.object({
  githubId: z.number().or(z.string().transform((s) => Number(s))),
  name: z.string(),
  pinned: z.boolean().optional(),
  hidden: z.boolean().optional(),
  customDescription: z.string().max(500).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const settingsSchema = z.object({
  siteTitle: z.string().min(1).max(200),
  siteDescription: z.string().min(1).max(400),
  ogImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  analyticsId: z.string().max(60).optional().nullable(),
  contactToEmail: z.string().email().optional().nullable().or(z.literal("")),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(200),
});

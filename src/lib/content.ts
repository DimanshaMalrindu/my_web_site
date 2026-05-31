import "server-only";
import { prisma } from "@/lib/db";

const fallbackProfile = {
  id: 1,
  name: "Dimansha Wijebandara",
  title: "Senior Software Developer (R&D)",
  tagline: "Building reliable, elegant software at ABB.",
  bio: "I'm a senior software developer focused on R&D at ABB in Helsinki. I love crafting clean architectures, scalable systems, and developer-friendly tools.",
  location: "Helsinki, Finland",
  photoUrl: null as string | null,
  resumeUrl: null as string | null,
  accentColor: "#0ea5e9",
  email: null as string | null,
  githubUrl: "https://github.com/DimanshaMalrindu",
  linkedinUrl: null as string | null,
  twitterUrl: null as string | null,
  websiteUrl: null as string | null,
  updatedAt: new Date(),
};

const fallbackSettings = {
  id: 1,
  siteTitle: "Dimansha Wijebandara — Senior Software Developer",
  siteDescription: "Portfolio of Dimansha Wijebandara, Senior Software Developer (R&D) at ABB, Helsinki.",
  ogImageUrl: null as string | null,
  analyticsId: null as string | null,
  contactToEmail: null as string | null,
  updatedAt: new Date(),
};

export async function getProfile() {
  try {
    const p = await prisma.profile.findUnique({ where: { id: 1 } });
    return p ?? fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function getSettings() {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return s ?? fallbackSettings;
  } catch {
    return fallbackSettings;
  }
}

export async function getFeaturedProjects(limit?: number) {
  try {
    return await prisma.project.findMany({
      where: { featured: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getAchievements() {
  try {
    return await prisma.achievement.findMany({
      orderBy: [{ order: "asc" }, { date: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getExperiences() {
  try {
    return await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
  } catch {
    return [];
  }
}

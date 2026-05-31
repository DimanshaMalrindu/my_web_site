import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `https://${process.env.PUBLIC_HOST ?? "example.com"}`;
  const staticRoutes = ["", "/about", "/projects", "/achievements", "/experience", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await prisma.project.findMany({ select: { slug: true, updatedAt: true } });
    projectRoutes = projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* ignore */
  }
  return [...staticRoutes, ...projectRoutes];
}

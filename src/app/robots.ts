import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `https://${process.env.PUBLIC_HOST ?? "example.com"}`;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${base}/sitemap.xml`,
  };
}

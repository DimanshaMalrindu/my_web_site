import type { Metadata } from "next";
import Link from "next/link";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/public/reveal";
import { getFeaturedProjects } from "@/lib/content";
import { getDisplayRepos } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };
export const revalidate = 1800;

export default async function ProjectsPage() {
  const [featured, repos] = await Promise.all([getFeaturedProjects(), getDisplayRepos().catch(() => [])]);

  return (
    <section className="container py-16">
      <p className="font-mono text-sm text-accent">Work</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Projects & repositories</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A mix of curated projects and live GitHub activity. Featured projects below, full open-source catalog further down.
      </p>

      {featured.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">Featured</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <Link href={`/projects/${p.slug}`} className="block h-full">
                  <Card className="h-full">
                    <CardBody>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">{p.summary}</p>
                      {p.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.techStack.slice(0, 6).map((t) => (
                            <span key={t} className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16">
        <h2 className="text-2xl font-semibold">All repositories</h2>
        {repos.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Repositories will appear here once GitHub is reachable.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i * 0.02, 0.3)}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                  <Card className="h-full">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold group-hover:text-accent inline-flex items-center gap-1">
                          {r.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition" />
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Star size={12} />{r.stars}</span>
                          <span className="inline-flex items-center gap-1"><GitFork size={12} />{r.forks}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
                        {r.description ?? "No description."}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs">
                        {r.language && <span className="font-mono text-accent">{r.language}</span>}
                        <span className="text-muted-foreground">Updated {formatDate(r.pushedAt)}</span>
                      </div>
                    </CardBody>
                  </Card>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

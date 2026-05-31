import Link from "next/link";
import { ArrowRight, Github, MapPin, Star, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/public/reveal";
import { getProfile, getFeaturedProjects, getExperiences } from "@/lib/content";
import { getDisplayRepos } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export const revalidate = 1800;

export default async function HomePage() {
  const [profile, featured, repos, experiences] = await Promise.all([
    getProfile(),
    getFeaturedProjects(6),
    getDisplayRepos({ limit: 6 }).catch(() => []),
    getExperiences(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="container py-20 sm:py-28">
        <Reveal>
          <p className="font-mono text-sm text-accent">{profile.location ?? "Helsinki, Finland"}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            Hi, I&apos;m {profile.name.split(" ")[0]}.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {profile.tagline ?? profile.title}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/projects">
              <Button>
                View my work <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Get in touch</Button>
            </Link>
            {profile.githubUrl && (
              <Link href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">
                  <Github size={16} /> GitHub
                </Button>
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      {/* Featured / Manual projects */}
      {featured.length > 0 && (
        <section className="container py-12">
          <SectionHeader title="Featured projects" subtitle="Hand-picked work I'm proud of." href="/projects" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <Link href={`/projects/${p.slug}`} className="block h-full">
                  <Card className="h-full">
                    <CardBody>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.summary}</p>
                      {p.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.techStack.slice(0, 5).map((t) => (
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
        </section>
      )}

      {/* GitHub repos */}
      {repos.length > 0 && (
        <section className="container py-12">
          <SectionHeader title="From GitHub" subtitle="Latest public repos, fetched live." href="/projects" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.05}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{r.name}</h3>
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
        </section>
      )}

      {/* About teaser */}
      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1">
              <MapPin size={12} /> {profile.location ?? "Helsinki, Finland"}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-foreground/90">{profile.bio}</p>
            <div className="mt-6">
              <Link href="/about">
                <Button variant="outline">Read more <ArrowRight size={14} /></Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experience teaser */}
      {experiences.length > 0 && (
        <section className="container py-16">
          <SectionHeader title="Experience" subtitle="Where I've shipped." href="/experience" />
          <div className="mt-8 space-y-3">
            {experiences.slice(0, 3).map((e, i) => (
              <Reveal key={e.id} delay={i * 0.05}>
                <Card>
                  <CardBody>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{e.role} <span className="text-muted-foreground font-normal">@ {e.company}</span></h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatDate(e.startDate)} — {e.current ? "Present" : formatDate(e.endDate)}
                      </p>
                    </div>
                    {e.location && <p className="mt-1 text-xs text-muted-foreground">{e.location}</p>}
                  </CardBody>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container py-20">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card/60 p-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Let&apos;s build something great.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Open to interesting R&D problems, collaboration, and meaningful product work.
            </p>
            <div className="mt-6">
              <Link href="/contact">
                <Button>Contact me <ArrowRight size={16} /></Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="font-mono text-sm text-accent hover:underline">
          View all →
        </Link>
      )}
    </div>
  );
}

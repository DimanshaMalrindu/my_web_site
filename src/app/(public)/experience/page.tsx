import type { Metadata } from "next";
import { Reveal } from "@/components/public/reveal";
import { getExperiences, getProfile } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const [experiences, profile] = await Promise.all([getExperiences(), getProfile()]);

  return (
    <section className="container max-w-3xl py-16">
      <p className="font-mono text-sm text-accent">Career</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Experience</h1>
      <p className="mt-3 text-muted-foreground">A timeline of where I&apos;ve worked and what I&apos;ve shipped.</p>

      {profile.resumeUrl && (
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
        >
          Download résumé (PDF)
        </a>
      )}

      <div className="mt-12 relative space-y-10 border-l border-border pl-6">
        {experiences.length === 0 && (
          <p className="text-sm text-muted-foreground">No experience yet — add via the admin panel.</p>
        )}
        {experiences.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.05}>
            <div className="relative">
              <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  {e.role} <span className="font-normal text-muted-foreground">@ {e.company}</span>
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDate(e.startDate)} — {e.current ? "Present" : formatDate(e.endDate)}
                </p>
              </div>
              {e.location && <p className="mt-1 text-xs text-muted-foreground">{e.location}</p>}
              {e.bullets.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
                  {e.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

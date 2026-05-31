import type { Metadata } from "next";
import { Award, ExternalLink } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/public/reveal";
import { getAchievements } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const items = await getAchievements();
  return (
    <section className="container py-16">
      <p className="font-mono text-sm text-accent">Recognition</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Achievements & certifications</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Awards, certifications, talks, publications, and notable contributions.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No achievements yet — add them in the admin panel.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {items.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.04}>
              <Card>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-accent">
                      <Award size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{a.title}</h3>
                      {(a.issuer || a.date) && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {a.issuer}
                          {a.issuer && a.date && " · "}
                          {a.date && formatDate(a.date)}
                        </p>
                      )}
                      {a.category && (
                        <span className="mt-2 inline-block rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                          {a.category}
                        </span>
                      )}
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          View <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

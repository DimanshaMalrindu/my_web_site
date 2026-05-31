import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

async function getStats() {
  try {
    const [projects, achievements, experiences, messages, unread] = await Promise.all([
      prisma.project.count(),
      prisma.achievement.count(),
      prisma.experience.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);
    return { projects, achievements, experiences, messages, unread };
  } catch {
    return { projects: 0, achievements: 0, experiences: 0, messages: 0, unread: 0 };
  }
}

async function recentMessages() {
  try {
    return await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  await requireSession();
  const [stats, messages] = await Promise.all([getStats(), recentMessages()]);
  const tiles = [
    { label: "Projects", value: stats.projects, href: "/admin/projects" },
    { label: "Achievements", value: stats.achievements, href: "/admin/achievements" },
    { label: "Experience", value: stats.experiences, href: "/admin/experience" },
    { label: `Messages${stats.unread ? ` (${stats.unread} new)` : ""}`, value: stats.messages, href: "/admin/messages" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card>
              <CardBody>
                <p className="text-sm text-muted-foreground">{t.label}</p>
                <p className="mt-2 text-3xl font-semibold">{t.value}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent messages</h2>
          <Link href="/admin/messages" className="text-sm text-accent hover:underline">View all →</Link>
        </div>
        {messages.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {messages.map((m) => (
              <Card key={m.id}>
                <CardBody>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{m.name} <span className="font-normal text-muted-foreground">· {m.email}</span></p>
                    <p className="font-mono text-xs text-muted-foreground">{formatDate(m.createdAt, { day: "numeric" })}</p>
                  </div>
                  {m.subject && <p className="mt-1 text-sm">{m.subject}</p>}
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { requireSession } from "@/lib/session";
import { getAchievements } from "@/lib/content";
import { AchievementsManager } from "@/components/admin/achievements-manager";

export default async function AdminAchievementsPage() {
  await requireSession();
  const items = await getAchievements();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Certifications, awards, talks, publications.</p>
      </div>
      <AchievementsManager
        initial={items.map((a) => ({
          id: a.id,
          title: a.title,
          issuer: a.issuer ?? "",
          date: a.date ? a.date.toISOString() : "",
          link: a.link ?? "",
          category: a.category ?? "",
          order: a.order,
        }))}
      />
    </div>
  );
}

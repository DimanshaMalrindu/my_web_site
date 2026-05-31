import { requireSession } from "@/lib/session";
import { getExperiences } from "@/lib/content";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function AdminExperiencePage() {
  await requireSession();
  const items = await getExperiences();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Experience</h1>
        <p className="mt-1 text-sm text-muted-foreground">Roles and responsibilities.</p>
      </div>
      <ExperienceManager
        initial={items.map((e) => ({
          id: e.id,
          company: e.company,
          role: e.role,
          location: e.location ?? "",
          startDate: e.startDate.toISOString(),
          endDate: e.endDate ? e.endDate.toISOString() : "",
          current: e.current,
          bulletsStr: (e.bullets ?? []).join("\n"),
          order: e.order,
        }))}
      />
    </div>
  );
}

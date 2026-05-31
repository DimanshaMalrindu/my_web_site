import { requireSession } from "@/lib/session";
import { getDisplayRepos } from "@/lib/github";
import { prisma } from "@/lib/db";
import { ReposManager } from "@/components/admin/repos-manager";

export const revalidate = 0;

export default async function AdminReposPage() {
  await requireSession();
  const repos = await getDisplayRepos({ includeForks: false }).catch(() => []);
  const overrides = await prisma.repoOverride.findMany().catch(() => []);
  const map: Record<number, { pinned: boolean; hidden: boolean; customDescription: string | null; thumbnailUrl: string | null }> = {};
  for (const o of overrides) {
    map[Number(o.githubId)] = {
      pinned: o.pinned, hidden: o.hidden,
      customDescription: o.customDescription, thumbnailUrl: o.thumbnailUrl,
    };
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">GitHub repositories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live data from GitHub. Pin to feature on the homepage; hide to exclude.
        </p>
      </div>
      <ReposManager initial={repos.map((r) => ({
        id: r.id, name: r.name, url: r.url, description: r.description, language: r.language,
        stars: r.stars, pinned: r.pinned, thumbnailUrl: r.thumbnailUrl,
      }))} overrides={map} />
    </div>
  );
}

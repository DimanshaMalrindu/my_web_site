import { requireSession } from "@/lib/session";
import { getProjects } from "@/lib/content";
import { ProjectsManager } from "@/components/admin/projects-manager";

export default async function AdminProjectsPage() {
  await requireSession();
  const projects = await getProjects();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">Featured manual portfolio entries.</p>
      </div>
      <ProjectsManager
        initial={projects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          description: p.description ?? "",
          techStack: p.techStack ?? [],
          images: p.images ?? [],
          demoUrl: p.demoUrl ?? "",
          repoUrl: p.repoUrl ?? "",
          featured: p.featured,
          order: p.order,
        }))}
      />
    </div>
  );
}

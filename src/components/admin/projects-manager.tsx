"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { projectSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { slugify } from "@/lib/utils";

type Values = z.input<typeof projectSchema>;
type Project = Values & { id: string };

const empty: Values = {
  slug: "",
  title: "",
  summary: "",
  description: "",
  techStack: [],
  images: [],
  demoUrl: "",
  repoUrl: "",
  featured: true,
  order: 0,
};

export function ProjectsManager({ initial }: { initial: Project[] }) {
  const [editing, setEditing] = useState<Project | "new" | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{initial.length} project(s)</p>
        <Button onClick={() => setEditing("new")}><Plus size={16} /> New project</Button>
      </div>

      {editing && (
        <ProjectForm
          initial={editing === "new" ? empty : editing}
          id={editing === "new" ? null : editing.id}
          onClose={() => setEditing(null)}
        />
      )}

      <div className="grid gap-4">
        {initial.map((p) => (
          <Card key={p.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">{p.title} {!p.featured && <span className="text-xs text-muted-foreground">(hidden)</span>}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">/projects/{p.slug}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(p)}><Pencil size={14} /> Edit</Button>
                  <DeleteButton id={p.id} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ initial, id, onClose }: { initial: Values; id: string | null; onClose: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Values & { techStackStr: string; imagesStr: string }>({
    defaultValues: {
      ...initial,
      techStackStr: (initial.techStack ?? []).join(", "),
      imagesStr: (initial.images ?? []).join("\n"),
    },
  });
  const [error, setError] = useState<string | null>(null);
  const titleVal = watch("title");

  async function onSubmit(v: Values & { techStackStr: string; imagesStr: string }) {
    setError(null);
    const payload: Values = {
      slug: v.slug || slugify(v.title),
      title: v.title,
      summary: v.summary,
      description: v.description ?? "",
      techStack: v.techStackStr.split(",").map((s) => s.trim()).filter(Boolean),
      images: v.imagesStr.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      demoUrl: v.demoUrl || "",
      repoUrl: v.repoUrl || "",
      featured: Boolean(v.featured),
      order: Number(v.order) || 0,
    };
    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid");
      return;
    }
    const res = await fetch(id ? `/api/admin/projects/${id}` : "/api/admin/projects", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Save failed");
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card/60 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{id ? "Edit project" : "New project"}</h3>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}><X size={14} /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input {...register("title")} onBlur={() => { if (!watch("slug") && titleVal) setValue("slug", slugify(titleVal)); }} />
          <FieldError message={errors.title?.message} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} placeholder="my-cool-project" />
          <FieldError message={errors.slug?.message} />
        </div>
        <div className="sm:col-span-2">
          <Label>Summary</Label>
          <Input {...register("summary")} placeholder="One-sentence elevator pitch" />
          <FieldError message={errors.summary?.message} />
        </div>
        <div className="sm:col-span-2">
          <Label>Description (markdown)</Label>
          <Textarea rows={8} {...register("description")} />
        </div>
        <div className="sm:col-span-2">
          <Label>Tech stack (comma separated)</Label>
          <Input {...register("techStackStr")} placeholder="TypeScript, Next.js, Postgres" />
        </div>
        <div className="sm:col-span-2">
          <Label>Image URLs (one per line)</Label>
          <Textarea rows={3} {...register("imagesStr")} placeholder={"https://…\nhttps://…"} />
        </div>
        <div>
          <Label>Demo URL</Label>
          <Input {...register("demoUrl")} />
        </div>
        <div>
          <Label>Repo URL</Label>
          <Input {...register("repoUrl")} />
        </div>
        <div>
          <Label>Display order</Label>
          <Input type="number" {...register("order", { valueAsNumber: true })} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input id="featured" type="checkbox" {...register("featured")} className="h-4 w-4" />
          <Label htmlFor="featured" className="cursor-pointer">Featured (show on site)</Label>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <><Check size={16} /> Save</>}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        if (!confirm("Delete this project?")) return;
        setBusy(true);
        await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
        setBusy(false);
        router.refresh();
      }}
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
    </Button>
  );
}

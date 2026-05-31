"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Pencil, X, Check } from "lucide-react";

type Item = {
  id: string;
  title: string;
  issuer: string;
  date: string; // ISO or ""
  link: string;
  category: string;
  order: number;
};

const empty: Item = { id: "", title: "", issuer: "", date: "", link: "", category: "", order: 0 };

export function AchievementsManager({ initial }: { initial: Item[] }) {
  const [editing, setEditing] = useState<Item | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{initial.length} item(s)</p>
        <Button onClick={() => setEditing(empty)}><Plus size={16} /> New</Button>
      </div>

      {editing && <ItemForm initial={editing} onClose={() => { setEditing(null); router.refresh(); }} />}

      <div className="grid gap-3">
        {initial.map((a) => (
          <Card key={a.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{[a.issuer, a.date && new Date(a.date).getFullYear(), a.category].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(a)}><Pencil size={14} /></Button>
                  <DeleteBtn id={a.id} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ItemForm({ initial, onClose }: { initial: Item; onClose: () => void }) {
  const isNew = !initial.id;
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<Item>({
    defaultValues: { ...initial, date: initial.date ? initial.date.slice(0, 10) : "" },
  });
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(v: Item) {
    setErr(null);
    const payload = {
      title: v.title,
      issuer: v.issuer || null,
      date: v.date ? new Date(v.date).toISOString() : null,
      link: v.link || null,
      category: v.category || null,
      order: Number(v.order) || 0,
    };
    const res = await fetch(isNew ? "/api/admin/achievements" : `/api/admin/achievements/${initial.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error ?? "Save failed");
      return;
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border bg-card/60 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{isNew ? "New achievement" : "Edit achievement"}</h3>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}><X size={14} /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>Title</Label><Input {...register("title", { required: true })} /><FieldError message={errors.title && "Required"} /></div>
        <div><Label>Issuer</Label><Input {...register("issuer")} /></div>
        <div><Label>Date</Label><Input type="date" {...register("date")} /></div>
        <div><Label>Category</Label><Input {...register("category")} placeholder="Certification / Award / Talk" /></div>
        <div><Label>Order</Label><Input type="number" {...register("order", { valueAsNumber: true })} /></div>
        <div className="sm:col-span-2"><Label>Link</Label><Input {...register("link")} placeholder="https://…" /></div>
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function DeleteBtn({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button size="sm" variant="outline" onClick={async () => {
      if (!confirm("Delete?")) return;
      setBusy(true);
      await fetch(`/api/admin/achievements/${id}`, { method: "DELETE" });
      setBusy(false);
      router.refresh();
    }}>
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </Button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Pencil, X, Check } from "lucide-react";

type Item = {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletsStr: string;
  order: number;
};

const empty: Item = {
  id: "", company: "", role: "", location: "",
  startDate: "", endDate: "", current: false, bulletsStr: "", order: 0,
};

export function ExperienceManager({ initial }: { initial: Item[] }) {
  const [editing, setEditing] = useState<Item | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{initial.length} role(s)</p>
        <Button onClick={() => setEditing(empty)}><Plus size={16} /> New role</Button>
      </div>

      {editing && <ItemForm initial={editing} onClose={() => { setEditing(null); router.refresh(); }} />}

      <div className="grid gap-3">
        {initial.map((e) => (
          <Card key={e.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{e.role} <span className="font-normal text-muted-foreground">@ {e.company}</span></h3>
                  <p className="mt-1 text-xs text-muted-foreground">{e.startDate.slice(0,10)} → {e.current ? "Present" : e.endDate.slice(0,10)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(e)}><Pencil size={14} /></Button>
                  <DeleteBtn id={e.id} />
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
  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<Item>({
    defaultValues: {
      ...initial,
      startDate: initial.startDate ? initial.startDate.slice(0, 10) : "",
      endDate: initial.endDate ? initial.endDate.slice(0, 10) : "",
    },
  });
  const [err, setErr] = useState<string | null>(null);
  const current = watch("current");

  async function onSubmit(v: Item) {
    setErr(null);
    if (!v.startDate) { setErr("Start date required"); return; }
    const payload = {
      company: v.company,
      role: v.role,
      location: v.location || null,
      startDate: new Date(v.startDate).toISOString(),
      endDate: v.current || !v.endDate ? null : new Date(v.endDate).toISOString(),
      current: Boolean(v.current),
      bullets: v.bulletsStr.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      order: Number(v.order) || 0,
    };
    const res = await fetch(isNew ? "/api/admin/experience" : `/api/admin/experience/${initial.id}`, {
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
        <h3 className="font-semibold">{isNew ? "New experience" : "Edit experience"}</h3>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}><X size={14} /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Company</Label><Input {...register("company", { required: true })} /><FieldError message={errors.company && "Required"} /></div>
        <div><Label>Role</Label><Input {...register("role", { required: true })} /><FieldError message={errors.role && "Required"} /></div>
        <div><Label>Location</Label><Input {...register("location")} /></div>
        <div><Label>Order</Label><Input type="number" {...register("order", { valueAsNumber: true })} /></div>
        <div><Label>Start date</Label><Input type="date" {...register("startDate", { required: true })} /></div>
        <div><Label>End date</Label><Input type="date" {...register("endDate")} disabled={current} /></div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input id="current" type="checkbox" {...register("current")} className="h-4 w-4" />
          <Label htmlFor="current" className="cursor-pointer">Currently working here</Label>
        </div>
        <div className="sm:col-span-2">
          <Label>Bullets (one per line)</Label>
          <Textarea rows={5} {...register("bulletsStr")} />
        </div>
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
      await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      setBusy(false);
      router.refresh();
    }}>
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </Button>
  );
}

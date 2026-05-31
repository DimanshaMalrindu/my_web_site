"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, EyeOff, Eye, Loader2, Save, RefreshCw } from "lucide-react";

type Repo = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  pinned: boolean;
  thumbnailUrl: string | null;
};

type Override = { pinned: boolean; hidden: boolean; customDescription: string | null; thumbnailUrl: string | null };

export function ReposManager({ initial, overrides }: { initial: Repo[]; overrides: Record<number, Override> }) {
  const [busy, setBusy] = useState<number | null>(null);
  const router = useRouter();

  async function patch(repo: Repo, patchData: Partial<Override>) {
    setBusy(repo.id);
    await fetch("/api/admin/repos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        githubId: repo.id,
        name: repo.name,
        ...patchData,
      }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{initial.length} public repo(s)</p>
        <Button variant="outline" onClick={() => router.refresh()}><RefreshCw size={14} /> Refresh</Button>
      </div>
      <div className="grid gap-3">
        {initial.map((r) => {
          const ov = overrides[r.id] ?? { pinned: false, hidden: false, customDescription: null, thumbnailUrl: null };
          return (
            <Card key={r.id}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">{r.name}</a>
                    {r.language && <span className="ml-2 font-mono text-xs text-accent">{r.language}</span>}
                    <span className="ml-2 text-xs text-muted-foreground">★ {r.stars}</span>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ov.customDescription ?? r.description ?? "No description."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant={ov.pinned ? "default" : "outline"} onClick={() => patch(r, { pinned: !ov.pinned, hidden: ov.hidden, customDescription: ov.customDescription, thumbnailUrl: ov.thumbnailUrl })}>
                      <Pin size={14} /> {ov.pinned ? "Pinned" : "Pin"}
                    </Button>
                    <Button size="sm" variant={ov.hidden ? "destructive" : "outline"} onClick={() => patch(r, { pinned: ov.pinned, hidden: !ov.hidden, customDescription: ov.customDescription, thumbnailUrl: ov.thumbnailUrl })}>
                      {ov.hidden ? <><Eye size={14} /> Show</> : <><EyeOff size={14} /> Hide</>}
                    </Button>
                  </div>
                </div>
                <OverrideRow repo={r} ov={ov} busy={busy === r.id} onSave={(p) => patch(r, p)} />
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OverrideRow({ repo, ov, busy, onSave }: { repo: Repo; ov: Override; busy: boolean; onSave: (p: Partial<Override>) => void }) {
  const [desc, setDesc] = useState(ov.customDescription ?? "");
  const [thumb, setThumb] = useState(ov.thumbnailUrl ?? "");
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_280px_auto] items-end">
      <div>
        <label className="text-xs text-muted-foreground">Custom description</label>
        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={repo.description ?? "Override description…"} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Thumbnail URL</label>
        <Input value={thumb} onChange={(e) => setThumb(e.target.value)} placeholder="https://…" />
      </div>
      <Button size="sm" disabled={busy} onClick={() => onSave({ pinned: ov.pinned, hidden: ov.hidden, customDescription: desc || null, thumbnailUrl: thumb || null })}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
      </Button>
    </div>
  );
}

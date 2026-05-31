"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Check, Loader2, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Msg = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesManager({ initial }: { initial: Msg[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleRead(m: Msg) {
    setBusy(m.id);
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    setBusy(null);
    router.refresh();
  }

  async function del(id: string) {
    if (!confirm("Delete this message?")) return;
    setBusy(id);
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  function exportCsv() {
    const header = "Date,Name,Email,Subject,Message\n";
    const rows = initial
      .map((m) => [m.createdAt, m.name, m.email, m.subject ?? "", m.message]
        .map((v) => `"${String(v).replace(/"/g, '""').replace(/\n/g, " ")}"`).join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {initial.length} message(s) · {initial.filter((m) => !m.read).length} unread
        </p>
        <Button variant="outline" onClick={exportCsv}><Download size={14} /> Export CSV</Button>
      </div>
      {initial.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
      <div className="grid gap-3">
        {initial.map((m) => (
          <Card key={m.id} className={!m.read ? "border-accent/60" : ""}>
            <CardBody>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />}
                    {m.name} <span className="font-normal text-muted-foreground">· {m.email}</span>
                  </p>
                  {m.subject && <p className="text-sm">{m.subject}</p>}
                </div>
                <p className="font-mono text-xs text-muted-foreground">{formatDate(m.createdAt, { day: "numeric" })}</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{m.message}</p>
              <div className="mt-4 flex gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject ?? "your message"))}`}>
                  <Button size="sm" variant="outline"><Mail size={14} /> Reply</Button>
                </a>
                <Button size="sm" variant="outline" onClick={() => toggleRead(m)} disabled={busy === m.id}>
                  {busy === m.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {m.read ? "Mark unread" : "Mark read"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => del(m.id)} disabled={busy === m.id}>
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

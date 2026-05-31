import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { MessagesManager } from "@/components/admin/messages-manager";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  await requireSession();
  const items = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Contact form submissions.</p>
      </div>
      <MessagesManager
        initial={items.map((m) => ({
          id: m.id, name: m.name, email: m.email,
          subject: m.subject, message: m.message, read: m.read,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

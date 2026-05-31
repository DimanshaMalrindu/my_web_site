import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { achievementSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.achievement.update({
    where: { id: params.id },
    data: {
      title: d.title,
      issuer: d.issuer || null,
      date: d.date ? new Date(d.date) : null,
      link: d.link || null,
      category: d.category || null,
      icon: d.icon || null,
      order: d.order ?? 0,
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  await prisma.achievement.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

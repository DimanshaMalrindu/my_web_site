import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { experienceSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.experience.update({
    where: { id: params.id },
    data: {
      company: d.company, role: d.role, location: d.location || null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      current: d.current, bullets: d.bullets, order: d.order,
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  await prisma.experience.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

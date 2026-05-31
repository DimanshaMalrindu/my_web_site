import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { experienceSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const d = parsed.data;
  const item = await prisma.experience.create({
    data: {
      company: d.company, role: d.role, location: d.location || null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      current: d.current, bullets: d.bullets, order: d.order,
    },
  });
  return NextResponse.json({ item });
}

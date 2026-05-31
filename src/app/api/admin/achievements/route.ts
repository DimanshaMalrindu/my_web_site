import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { achievementSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

function clean(d: ReturnType<typeof achievementSchema.parse>) {
  return {
    title: d.title,
    issuer: d.issuer || null,
    date: d.date ? new Date(d.date) : null,
    link: d.link || null,
    category: d.category || null,
    icon: d.icon || null,
    order: d.order ?? 0,
  };
}

export async function POST(req: NextRequest) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const item = await prisma.achievement.create({ data: clean(parsed.data) });
  return NextResponse.json({ item });
}

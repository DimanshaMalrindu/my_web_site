import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { repoOverrideSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function PUT(req: NextRequest) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = repoOverrideSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const d = parsed.data;
  const data = {
    name: d.name,
    pinned: d.pinned ?? false,
    hidden: d.hidden ?? false,
    customDescription: d.customDescription || null,
    thumbnailUrl: d.thumbnailUrl || null,
  };
  const item = await prisma.repoOverride.upsert({
    where: { githubId: BigInt(d.githubId) },
    update: data,
    create: { githubId: BigInt(d.githubId), ...data },
  });
  return NextResponse.json({ ok: true, id: Number(item.githubId) });
}

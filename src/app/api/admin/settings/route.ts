import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function PUT(req: NextRequest) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const d = parsed.data;
  const data = {
    siteTitle: d.siteTitle,
    siteDescription: d.siteDescription,
    ogImageUrl: d.ogImageUrl || null,
    analyticsId: d.analyticsId || null,
    contactToEmail: d.contactToEmail || null,
  };
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return NextResponse.json({ settings });
}

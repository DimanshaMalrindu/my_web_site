import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function PUT(req: NextRequest) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  const d = parsed.data;
  const data = {
    name: d.name,
    title: d.title,
    tagline: d.tagline || null,
    bio: d.bio,
    location: d.location || null,
    photoUrl: d.photoUrl || null,
    resumeUrl: d.resumeUrl || null,
    accentColor: d.accentColor,
    email: d.email || null,
    githubUrl: d.githubUrl || null,
    linkedinUrl: d.linkedinUrl || null,
    twitterUrl: d.twitterUrl || null,
    websiteUrl: d.websiteUrl || null,
  };
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return NextResponse.json({ profile });
}

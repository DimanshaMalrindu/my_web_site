import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { projectSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function GET() {
  const { response } = await requireApiSession();
  if (response) return response;
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  try {
    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        demoUrl: parsed.data.demoUrl || null,
        repoUrl: parsed.data.repoUrl || null,
      },
    });
    return NextResponse.json({ project });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: msg.includes("Unique") ? "Slug already exists" : msg }, { status: 400 });
  }
}

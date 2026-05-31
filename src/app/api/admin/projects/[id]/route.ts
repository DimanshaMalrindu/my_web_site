import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { projectSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });
  try {
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        demoUrl: parsed.data.demoUrl || null,
        repoUrl: parsed.data.repoUrl || null,
      },
    });
    return NextResponse.json({ project });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  await prisma.project.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => ({} as { read?: boolean }));
  const item = await prisma.contactMessage.update({
    where: { id: params.id },
    data: { read: Boolean(body.read) },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireApiSession();
  if (response) return response;
  await prisma.contactMessage.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { passwordSchema } from "@/lib/validators";
import { requireApiSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { session, response } = await requireApiSession();
  if (response) return response;
  const body = await req.json().catch(() => null);
  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });

  const email = session!.user!.email!.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return NextResponse.json({ ok: true });
}

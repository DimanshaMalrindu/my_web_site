import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, hashIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "anon";
  const rl = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  // Honeypot triggered — silently accept.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const { name, email, subject, message } = parsed.data;

  try {
    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message, ipHash: hashIp(ip) },
    });
  } catch (e) {
    console.error("[contact] db error", e);
  }

  try {
    await sendContactEmail({ name, email, subject, message });
  } catch (e) {
    console.error("[contact] email error", e);
    return NextResponse.json({ error: "Could not send email. Please email me directly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");
  return session;
}

export async function requireApiSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

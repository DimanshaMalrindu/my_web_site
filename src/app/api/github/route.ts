import { NextResponse } from "next/server";
import { getDisplayRepos } from "@/lib/github";

export const revalidate = 1800;

export async function GET() {
  try {
    const repos = await getDisplayRepos();
    return NextResponse.json({ repos });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}

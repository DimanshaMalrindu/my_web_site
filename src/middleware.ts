import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_HOST = process.env.ADMIN_HOST?.toLowerCase();
const PUBLIC_HOST = process.env.PUBLIC_HOST?.toLowerCase();

function isAdminHost(host: string) {
  const h = host.toLowerCase().split(":")[0];
  if (ADMIN_HOST && h === ADMIN_HOST) return true;
  if (h.startsWith("admin.")) return true;
  return false;
}

function isPublicHost(host: string) {
  const h = host.toLowerCase().split(":")[0];
  if (h === "localhost" || h.endsWith(".localhost") || h.startsWith("127.")) return true;
  if (PUBLIC_HOST && h === PUBLIC_HOST) return true;
  if (PUBLIC_HOST && h === `www.${PUBLIC_HOST}`) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";
  const adminHost = isAdminHost(host);
  const publicHost = isPublicHost(host) && !adminHost;

  // On the public host, hide /admin entirely (return 404 by rewriting to a non-existent path).
  if (publicHost && pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // On the admin host, route the root to /admin.
  if (adminHost) {
    if (pathname === "/" || pathname === "") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Public site routes should not be reachable on admin host.
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
      return NextResponse.redirect(new URL(`/admin${pathname === "/" ? "" : ""}`, req.url));
    }
  }

  // Auth gate for /admin pages (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/admin/login/")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)"],
};

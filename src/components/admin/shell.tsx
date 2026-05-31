"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Github,
  Award,
  Briefcase,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/repos", label: "GitHub Repos", icon: Github },
  { href: "/admin/achievements", label: "Achievements", icon: Award },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="px-6 py-5 border-b border-border">
          <p className="font-mono text-xs text-accent">Admin</p>
          <p className="mt-1 truncate text-sm font-semibold">{email}</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active ? "bg-accent text-[var(--accent-foreground)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={16} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 space-y-2">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <ExternalLink size={16} /> View site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut size={16} /> Sign out
          </button>
          <div className="px-3"><ThemeToggle /></div>
        </div>
      </aside>
      <div className="flex-1">
        <header className="md:hidden flex items-center justify-between border-b border-border bg-card/60 px-4 py-3">
          <p className="font-mono text-xs text-accent">Admin</p>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="text-sm text-muted-foreground">
            Sign out
          </button>
        </header>
        <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-border bg-card/40 px-3 py-2">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-xs",
                  active ? "bg-accent text-[var(--accent-foreground)]" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

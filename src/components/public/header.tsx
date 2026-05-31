"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

export function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-[var(--accent-foreground)] text-sm font-bold">
            {initials}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition",
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border">
          <div className="container flex flex-col py-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

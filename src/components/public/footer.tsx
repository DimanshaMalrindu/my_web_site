import Link from "next/link";
import { Github, Linkedin, Mail, Twitter, Globe } from "lucide-react";

export function Footer({
  name,
  socials,
}: {
  name: string;
  socials: {
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    websiteUrl?: string | null;
    email?: string | null;
  };
}) {
  const links: { href: string; icon: React.ReactNode; label: string }[] = [];
  if (socials.githubUrl) links.push({ href: socials.githubUrl, icon: <Github size={16} />, label: "GitHub" });
  if (socials.linkedinUrl) links.push({ href: socials.linkedinUrl, icon: <Linkedin size={16} />, label: "LinkedIn" });
  if (socials.twitterUrl) links.push({ href: socials.twitterUrl, icon: <Twitter size={16} />, label: "Twitter" });
  if (socials.websiteUrl) links.push({ href: socials.websiteUrl, icon: <Globe size={16} />, label: "Website" });
  if (socials.email) links.push({ href: `mailto:${socials.email}`, icon: <Mail size={16} />, label: "Email" });

  return (
    <footer className="mt-24 border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {name}. Built with Next.js.
        </p>
        <div className="flex items-center gap-3">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-label={l.label}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              {l.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

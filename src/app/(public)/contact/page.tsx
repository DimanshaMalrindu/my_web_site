import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { getProfile } from "@/lib/content";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await getProfile();
  return (
    <section className="container max-w-4xl py-16">
      <p className="font-mono text-sm text-accent">Get in touch</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s talk</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Have a role, project, or question? Drop a message — I read every email.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
          <ContactForm />
        </div>
        <aside className="space-y-4 text-sm">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-start gap-3 hover:text-accent">
              <Mail size={16} className="mt-0.5 text-accent" />
              <span>{profile.email}</span>
            </a>
          )}
          {profile.location && (
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin size={16} className="mt-0.5 text-accent" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-accent">
              <Github size={16} className="mt-0.5 text-accent" />
              <span>GitHub</span>
            </a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-accent">
              <Linkedin size={16} className="mt-0.5 text-accent" />
              <span>LinkedIn</span>
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}

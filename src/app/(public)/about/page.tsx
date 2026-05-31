import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Mail, Github, Linkedin } from "lucide-react";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const profile = await getProfile();
  return (
    <section className="container max-w-3xl py-16">
      <p className="font-mono text-sm text-accent">About me</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{profile.title}</p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {profile.location && <span className="inline-flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>}
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:text-accent">
            <Mail size={14} /> {profile.email}
          </a>
        )}
        {profile.githubUrl && (
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
            <Github size={14} /> GitHub
          </a>
        )}
        {profile.linkedinUrl && (
          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
            <Linkedin size={14} /> LinkedIn
          </a>
        )}
      </div>

      <div className="prose-portfolio mt-10 text-foreground/90 whitespace-pre-wrap">{profile.bio}</div>

      {profile.resumeUrl && (
        <div className="mt-10">
          <Link
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
          >
            Download résumé (PDF)
          </Link>
        </div>
      )}
    </section>
  );
}

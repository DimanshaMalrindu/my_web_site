import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { prisma } from "@/lib/db";

export const revalidate = 60;

async function getProject(slug: string) {
  try {
    return await prisma.project.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProject(params.slug);
  if (!p) return { title: "Project not found" };
  return { title: p.title, description: p.summary };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <article className="container max-w-3xl py-16">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft size={14} /> All projects
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

      {project.techStack.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span key={t} className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-accent px-4 py-2 text-sm text-[var(--accent-foreground)]">
            <ExternalLink size={14} /> Live demo
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm hover:border-accent">
            <Github size={14} /> Source code
          </a>
        )}
      </div>

      {project.images.length > 0 && (
        <div className="mt-10 space-y-4">
          {project.images.map((src) => (
            <div key={src} className="overflow-hidden rounded-xl border border-border">
              <Image src={src} alt={project.title} width={1200} height={700} className="h-auto w-full" />
            </div>
          ))}
        </div>
      )}

      {project.description && (
        <div className="prose-portfolio mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}

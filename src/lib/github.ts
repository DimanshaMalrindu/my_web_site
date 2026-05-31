import { prisma } from "@/lib/db";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export interface DisplayRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string;
  pinned: boolean;
  thumbnailUrl: string | null;
}

const GITHUB_API = "https://api.github.com";

export async function fetchGitHubRepos(username = process.env.GITHUB_USERNAME ?? "DimanshaMalrindu"): Promise<GitHubRepo[]> {
  if (!username) return [];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "personal-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const all: GitHubRepo[] = [];
  for (let page = 1; page <= 4; page++) {
    const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}&sort=pushed`, {
      headers,
      next: { revalidate: 60 * 30 },
    });
    if (!res.ok) {
      console.error("GitHub fetch failed", res.status, await res.text().catch(() => ""));
      break;
    }
    const batch = (await res.json()) as GitHubRepo[];
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

export async function getDisplayRepos(opts?: { includeForks?: boolean; limit?: number }): Promise<DisplayRepo[]> {
  const raw = await fetchGitHubRepos();
  const overrides = await prisma.repoOverride.findMany().catch(() => []);
  const ovMap = new Map(overrides.map((o) => [Number(o.githubId), o]));

  const merged = raw
    .filter((r) => (opts?.includeForks ? true : !r.fork) && !r.archived)
    .map<DisplayRepo>((r) => {
      const ov = ovMap.get(r.id);
      return {
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        url: r.html_url,
        description: ov?.customDescription ?? r.description,
        homepage: r.homepage,
        language: r.language,
        topics: r.topics ?? [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushedAt: r.pushed_at,
        pinned: ov?.pinned ?? false,
        thumbnailUrl: ov?.thumbnailUrl ?? null,
      };
    })
    .filter((r) => !ovMap.get(r.id)?.hidden)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.stars !== b.stars) return b.stars - a.stars;
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
    });

  return opts?.limit ? merged.slice(0, opts.limit) : merged;
}

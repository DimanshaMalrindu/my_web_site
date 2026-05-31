# Dimansha Wijebandara — Portfolio

Personal portfolio + private admin panel for Dimansha Wijebandara, Senior Software Developer (R&D) at ABB, Helsinki.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind + Prisma 6 + NextAuth + Resend**. Designed for deployment on **Vercel + Vercel Postgres**.

## Features

### Public site
- Flat, minimalistic design (dark + light themes) with subtle motion
- Home with hero, featured projects, live GitHub repos, experience teaser, CTA
- About, Projects (manual + auto-fetched GitHub), Project detail (markdown), Achievements, Experience (timeline), Contact (with Resend + rate limit + honeypot)
- SEO: per-page metadata, sitemap.xml, robots.txt, Open Graph
- Lighthouse-friendly, fully responsive, accessible

### Admin panel (on `admin.` subdomain)
- Secure email + password login (NextAuth Credentials, bcrypt)
- Dashboard with counts and recent messages
- CRUD for: Profile, Projects, Achievements, Experience
- GitHub repos manager (pin / hide / override description + thumbnail)
- Contact messages inbox (mark read, delete, export CSV, mailto reply)
- Site settings (SEO, OG image, analytics, contact recipient)
- Change password

## Local setup

```bash
# 1) Install deps
npm install

# 2) Configure environment
cp .env.example .env
# fill DATABASE_URL, NEXTAUTH_SECRET, ADMIN_*, RESEND_API_KEY, etc.

# 3) Initialize the database
npm run db:push       # or: npm run db:migrate
npm run db:seed       # creates admin user from ADMIN_EMAIL / ADMIN_PASSWORD

# 4) Run dev server
npm run dev
```

- Public site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>

> **Corporate networks / Prisma SSL:** The repo includes `.npmrc` with `node-options=--use-system-ca` so Prisma can download engines through corporate proxies that inject a root CA (e.g. ABB).

## Subdomain setup (production)

On Vercel, attach **two domains** to the same project:

- `dimansha.dev` → public site
- `admin.dimansha.dev` → admin panel

`src/middleware.ts` reads the `Host` header. On the public host, `/admin/*` returns 404. On the admin host, the root redirects to `/admin` and all non-admin paths are routed under `/admin`. The middleware also enforces auth on `/admin` (except `/admin/login`).

Set `PUBLIC_HOST` and `ADMIN_HOST` env vars to match your domains.

## Environment variables

See `.env.example` for the full list. Minimum to run:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_SECRET` | NextAuth JWT secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Public URL of the site |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `db:seed` to create the admin user |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` | Contact form delivery |
| `GITHUB_USERNAME` | Whose repos to fetch (defaults to `DimanshaMalrindu`) |
| `GITHUB_TOKEN` *(optional)* | Lifts rate limit from 60 to 5000/hr |
| `PUBLIC_HOST`, `ADMIN_HOST` | Production hosts for middleware routing |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Generate Prisma client + build Next.js |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push schema to DB (no migration history) |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Seed admin user, profile, site settings |
| `npm run db:studio` | Open Prisma Studio |

## Deployment to Vercel

1. Push to a GitHub repo.
2. Import the repo in Vercel.
3. Add the env vars from `.env.example`.
4. Create a Vercel Postgres database; copy its `POSTGRES_PRISMA_URL` into `DATABASE_URL`.
5. First deploy: `vercel-build` runs `prisma generate && next build`. After it succeeds, run `npm run db:deploy && npm run db:seed` locally pointing at the prod DB (or add as a one-off script).
6. Add both domains in **Settings → Domains** (`dimansha.dev` and `admin.dimansha.dev`).

## Project structure

```
src/
├── app/
│   ├── (public)/        # public portfolio routes
│   ├── (admin)/admin/   # admin panel routes
│   ├── api/             # contact, github, auth, admin APIs
│   ├── sitemap.ts
│   └── robots.ts
├── components/{ui,public,admin}/
├── lib/                 # db, auth, github, email, validators, rate-limit, session, content
└── middleware.ts        # host-based + auth-based routing
prisma/
├── schema.prisma
└── seed.ts
```

## Customization

Almost everything is editable from the admin panel — name, bio, photo, accent color, projects, achievements, experience, GitHub overrides, SEO. To change layout/components, edit files under `src/components/public/`.

---

Built with care. © Dimansha Wijebandara.
"# my_web_site" 

# CLAUDE.md — cvbuilder-v2

## Claude's Role
**Code reviewer and mentor only.** The developer (Majit) writes all code. Claude:
- Reviews code for correctness, best practices, security
- Answers architecture questions
- Helps debug when stuck
- Does NOT write implementation code unprompted

---

## Project
Multi-tenant CV/portfolio SaaS. Users get `username.sparqup.fr` or a custom domain.
Full architecture and 7-stage build plan: **see `ROADMAP.md`**.
> **Always read `ROADMAP.md` before any session** — it contains the full architecture, 7-stage build plan, and list of v1 files to reuse/adapt.

---

## Current Stage
**Stage 1 — Complete.** Auth, Prisma schema, next-intl, login + registration + onboarding pages, dashboard shell (route groups, layouts, sidebar, mobile nav, CvLocaleSwitcher) all done. Deploy to Vercel pending.

**Stage 2 — In progress.** All CV Prisma models migrated. Server actions done for all models (profile, experience, education, skill, skillCategory, certification, project, contactSettings, siteSettings). Dashboard forms done: Profile, Experience (with ExperienceList), Education (with EducationList), Skills (SkillManager + SkillCategoryManager). Remaining: Certifications, Projects, ContactSettings, SiteSettings forms + pages.

## CI/CD
GitLab CI pipeline set up (`.gitlab-ci.yml`). Two remotes: `origin` (GitHub), `gitlab` (GitLab).
Pipeline stages: `validate` (typecheck + lint in parallel) → `build`.
- `pnpm prisma generate` runs in `before_script` before every job — required because generated client is gitignored
- `--max-warnings=0` on lint — warnings are treated as errors
- `DATABASE_URL` not needed in CI — pipeline only validates code, does not connect to DB

## Known TODOs (future stages)
- Date picker with calendar view (current HTML date input is painful)
- Drag-and-drop reordering for all list sections — `sortOrder` field already in Prisma schema, needs `@dnd-kit/core` frontend + `updateSortOrder` server actions
- Skills UX: checkbox multi-select, mass delete, Notion-style inline editing without edit button

---

## Stack
- Next.js 16 (App Router) — `proxy.ts`, NOT `middleware.ts` (Next.js 16 convention)
- Prisma **v6** + Neon serverless Postgres — **do NOT upgrade to v7** (breaking changes: removes `url`/`directUrl` from `schema.prisma`, introduces `prisma.config.ts` with incomplete types, ecosystem not ready)
- NextAuth v5 (Auth.js)
- Cloudflare R2 (images)
- TipTap (rich text)
- next-intl v4 (FR/EN + extensible)
- Resend (email)
- Tailwind v4 + OKLCH
- Vercel + Domains API

## Key Conventions
- `proxy.ts` handles routing — never rename to `middleware.ts`
- All translatable CV fields are `Json` (JSONB): `{ "en": "...", "fr": "..." }` — NOT flat columns
- `t(field, locale)` from `src/lib/locale.ts` resolves bilingual fields (same as v1)
- `User.cvLocales Json` stores `[{ "code": "en", "label": "English" }]` — drives locale tabs in dashboard editor
- NEVER import Prisma in `proxy.ts` — use `@neondatabase/serverless` raw SQL for Edge (Branch C only)
- Server Components by default; `'use client'` only for hooks/interactivity
- `@/` alias for all imports from `src/`
- Tailwind v4: configure tokens in `globals.css` `@theme` block, not a config file
- Accent colors: semantic `accent-*` CSS aliases (not hardcoded `forest-*` like v1)
- Reserved usernames (block at registration): `dashboard`, `login`, `register`, `api`, `studio`, `admin`, `www`

## v1 Reference
`/home/majit/sites/cvbuilder` — live v1. Files reused verbatim listed in ROADMAP.md.

## Environment Variables Needed
```
DATABASE_URL=                   # Neon connection string (pooled, -pooler in hostname)
DIRECT_URL=                     # Neon direct connection (no -pooler, for migrations)
AUTH_SECRET=
AUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_PUBLIC_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
VERCEL_PROJECT_ID=              # For Domains API
VERCEL_TEAM_ID=                 # For Domains API
VERCEL_API_TOKEN=               # For Domains API
```

# cvbuilder-v2 — Roadmap

Multi-tenant CV/portfolio SaaS. Any user creates their own page at `username.sparqup.fr` (or custom domain).

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Same as v1 |
| Database | Prisma **v6** + Neon (serverless Postgres) | `@neondatabase/serverless` for Edge; built-in PgBouncer pooling. **Do NOT upgrade to v7** — breaking changes, incomplete types. |
| Auth | NextAuth v5 (Auth.js) | GitHub + Google OAuth + email/password credentials |
| Images | Cloudflare R2 | Zero egress fees |
| Rich text | TipTap | JSONContent in `jsonb`, `generateHTML` zero-bundle in RSC |
| i18n | next-intl v4 | Platform UI + CV content both multilingual |
| Email | Resend | Reused from v1 |
| Hosting | Vercel + Domains API | Wildcard subdomains + custom domain provisioning |
| Styling | Tailwind v4 + OKLCH | `globals.css` from v1 reused verbatim |

---

## Architecture Decisions

### Multilingual fields — JSONB
All translatable CV fields use `Json` (JSONB), not flat columns:
```json
{ "en": "Software Engineer", "fr": "Ingénieur logiciel", "es": "..." }
```
- `User.cvLocales String[]` controls which locale tabs appear in the editor
- `t(field, locale)` helper from v1 works unchanged
- Adding a new CV language = zero migration
- Adding a new platform UI language = add `messages/xx.json` + update `routing.ts`

### proxy.ts — 3-Branch Routing (Next.js 16 convention: proxy.ts, NOT middleware.ts)
```
Branch A — Platform host (sparqup.fr, localhost)
  → Run next-intl createMiddleware(routing) as-is

Branch B — Subdomain (username.sparqup.fr)
  → Extract username
  → Rewrite to /[locale]/[username]/
  → Set headers: x-tenant-username, x-locale

Branch C — Custom domain (john.doe.com)
  → Edge SQL via @neondatabase/serverless (NEVER import Prisma in proxy.ts)
  → In-memory Map cache, 60s TTL
  → If verified: same rewrite as Branch B
  → If not: 404
```

### Layout Registry
```typescript
interface LayoutDefinition {
  id: string
  name: string
  previewImageUrl: string
  component: React.ComponentType<PortfolioPageProps>
}
// LAYOUT_REGISTRY: Record<string, LayoutDefinition>
// Classic (adapted from v1) + Minimal (single-column card)
```
Accent colors: CSS variable overrides injected as `<style>` in tenant layout.
Replace v1's hardcoded `forest-*` classes with semantic `accent-*` aliases in `globals.css`.

### Reserved Usernames
Block at registration: `dashboard`, `login`, `register`, `registration`, `api`, `studio`, `admin`, `www`, `root`, `superuser`, `support`, `help`, `contact`, `info`, `about`, `security`, `privacy`

### cvLocales Schema
Stored as `Json` (JSONB) array of `{ code: string, label: string }` objects — NOT `String[]`.
Default: `"[]"` in schema, set to `[{ code: locale, label: ... }]` during onboarding.
Dashboard editor generates locale tabs from this array. Adding/removing locales done in Settings only.

### Dashboard Structure
- Route groups: `(protected)` (auth check) → `(onboarded)` (onboarding check) → `dashboard/` (sidebar layout)
- `DashboardSidebar` — desktop only (`hidden md:flex`), static
- `DashboardMobileNav` — mobile only (`md:hidden`), hamburger + fixed drawer + overlay
- Server actions for CV CRUD live in `src/lib/actions/` (one file per model)
- Dashboard forms use locale tabs driven by `user.cvLocales` for translatable fields

---

## Prisma Schema (key models)

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  username     String   @unique
  passwordHash String?
  plan         Plan     @default(FREE)
  cvLocales    String[] @default(["fr", "en"])
  // Relations: Account, Session (NextAuth), Profile, Experience, Education,
  //            Skill, Certification, Project, ContactSettings, CustomDomain, SiteSettings
}

model SiteSettings {
  userId      String @unique
  layoutId    String @default("classic")
  themeMode   String @default("dark")
  accentColor String @default("forest")
  sectionOrder Json  @default("[\"cv\",\"projects\",\"contact\"]")
}

model CustomDomain {
  userId      String  @unique
  domain      String  @unique
  verified    Boolean @default(false)
  verifyToken String
}

// CV models: all have userId FK + sortOrder Int
// All translatable fields: Json (JSONB) e.g. headline, tagline, summary, description
// Non-translated arrays: String[] e.g. techStack
// Rich text: Json (TipTap JSONContent) per locale
```

---

## App Structure

```
src/
├── proxy.ts                     # REWRITTEN — 3-branch routing
├── i18n/routing.ts              # REUSED from v1
├── i18n/request.ts              # ADAPTED — reads x-locale header for tenant routes
├── lib/
│   ├── locale.ts                # REUSED from v1 (t(field, locale) helper)
│   ├── email.ts                 # REUSED from v1
│   ├── auth.ts                  # NEW — NextAuth v5 config
│   ├── db.ts                    # NEW — Prisma singleton
│   ├── r2.ts                    # NEW — R2 presigned URL helpers
│   ├── tenant.ts                # NEW — resolveTenant(username) → User + settings
│   ├── tiptap.ts                # NEW — extensions + generateHTML wrapper
│   └── layouts/
│       ├── index.ts             # LAYOUT_REGISTRY
│       ├── classic/             # Adapted from v1
│       └── minimal/             # New single-column layout
├── types/cv.ts                  # ADAPTED from v1 (remove SanityImage, JSONB bilingual)
├── components/
│   ├── cv/, projects/, contact/ # ADAPTED — PortableText → generateHTML
│   ├── layout/                  # ADAPTED — dynamic brand, remove Sanity deps
│   └── editor/                  # NEW — TipTap dashboard editor
├── app/
│   ├── globals.css              # REUSED from v1
│   ├── [locale]/                # Platform routes (sparqup.fr)
│   │   ├── page.tsx             # Landing page
│   │   ├── login/, registration/
│   │   └── dashboard/
│   │       ├── profile/, experience/, education/, skills/
│   │       ├── projects/, certifications/, contact/
│   │       ├── appearance/      # Layout + theme picker
│   │       └── domain/          # Custom domain UI
│   └── [locale]/[username]/     # Tenant public portfolio
│       ├── layout.tsx           # Loads user data + SiteSettings
│       └── page.tsx             # Renders layout from registry
└── api/
    ├── auth/[...nextauth]/
    ├── contact/                  # Tenant-aware
    ├── upload/                   # R2 presigned URL
    └── domains/                  # Register + verify custom domains
```

---

## Build Stages

> Check off stages as completed. Update `CLAUDE.md` current stage after each.

- [x] **Stage 1 — Foundation**
  - `npx create-next-app cvbuilder-v2` (TypeScript, App Router, Tailwind) ✓
  - Copy `globals.css`, `i18n/routing.ts`, `i18n/request.ts`, `lib/locale.ts`, `lib/email.ts` from v1 ✓
  - `prisma/schema.prisma`: User + NextAuth models ✓
  - Neon project + `prisma migrate dev` ✓
  - `src/lib/auth.ts`: NextAuth v5 with GitHub, Google, credentials ✓
  - `src/proxy.ts`: Branch A only ✓
  - Platform pages: login, register, onboarding ✓
  - Dashboard shell: route groups `(protected)/(onboarded)`, layouts, sidebar ✓
  - `DashboardSidebar` (desktop) + `DashboardMobileNav` (mobile) ✓
  - `CvLocaleSwitcher` + `CvLocaleProvider` context ✓
  - Deploy to Vercel — pending
  - **Verify:** OAuth login works on Vercel preview URL, user record in Neon

- [~] **Stage 2 — CV Data Layer**
  - All CV Prisma models added and migrated ✓ (Profile, Experience, Education, Skill, SkillsCategory, Certification, Project, ContactSettings, SiteSettings)
  - `cvLocales` changed from `String[]` to `Json` storing `[{code, label}]` objects ✓
  - Server Actions for CRUD on all models ✓ (withAuth helper pattern, revalidatePath)
  - Dashboard forms done ✓: Profile, Experience + ExperienceList, Education + EducationList, Skills (SkillManager + SkillCategoryManager with inline double-click editing)
  - Dashboard forms pending: Certifications, Projects, ContactSettings, SiteSettings
  - Locale tabs in forms driven by `user.cvLocales` via CvLocaleContext ✓
  - **Verify:** Fill CV in dashboard, read back via Prisma

- [ ] **Stage 3 — Public Portfolio**
  - Adapt v1 components: swap PortableText → `generateHTML`, remove `urlFor()`, fix type imports
  - `[locale]/[username]/` route
  - `src/lib/tenant.ts`: `resolveTenant(username)`
  - `src/proxy.ts`: add Branch B (subdomain routing)
  - Classic layout in layout registry
  - **Verify:** `username.sparqup.fr` renders CV, locale switcher works

- [ ] **Stage 4 — Rich Text + Appearance**
  - TipTap in dashboard editor (per-locale tabs driven by `User.cvLocales`)
  - `SiteSettings` model + appearance dashboard
  - Layout picker + accent color picker
  - Minimal layout in registry
  - **Verify:** Layout change persists, accent color updates on public page

- [ ] **Stage 5 — Image Upload**
  - Cloudflare R2 bucket + `src/lib/r2.ts`
  - `POST /api/upload` → presigned URL
  - Profile photo + project cover upload UI
  - **Verify:** Profile photo appears on public page from R2 CDN URL

- [ ] **Stage 6 — Custom Domains**
  - `CustomDomain` model
  - Domain dashboard: add domain → DNS instructions
  - `POST /api/domains/register` → Vercel Domains API
  - `POST /api/domains/verify` → DNS TXT check → set `verified=true`
  - `src/proxy.ts`: add Branch C (Edge SQL lookup)
  - **Verify:** Custom domain resolves with SSL, proxy routes correctly

- [ ] **Stage 7 — Launch Polish**
  - Landing page at `sparqup.fr`
  - Per-tenant `<head>` SEO / OG meta
  - Plan gating (FREE/PRO) — rate limiting dashboard actions
  - Empty states, onboarding flow
  - **Verify:** New user sign-up → fill CV → share URL end-to-end

---

## Custom Domain Flow

1. User adds domain in `/dashboard/domain`
2. API: create `CustomDomain` record + call Vercel Domains API (`POST /v10/projects/{id}/domains`)
3. Dashboard shows: CNAME → `cname.vercel-dns.com`, TXT `_sparqup-verify` → `verifyToken`
4. User clicks Verify → `dns.promises.resolveTxt('_sparqup-verify.domain')` → match → `verified=true`
5. `proxy.ts` Branch C picks it up; Vercel handles SSL

---

## v1 Reference
Source: `/home/majit/sites/cvbuilder`
- Reuse verbatim: `globals.css`, `lib/locale.ts`, `lib/email.ts`, `i18n/routing.ts`, `LanguageSwitcher.tsx`, `CVSectionTitle.tsx`, `messages/en.json`, `messages/fr.json`
- Adapt: `CVSection.tsx`, `ProjectsSection.tsx`, `[locale]/layout.tsx`, `types.ts`

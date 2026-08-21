<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Project Context

**Md Abdullah's Personal Portfolio** — positions him as an **Automation & Integration Engineer** who solves business problems through:

- Business process automation
- CRM systems
- API integrations
- AI automation
- Workflow design
- Custom backend systems

This is NOT a generic developer portfolio. Every feature should reinforce the positioning of solving real business operations problems.

---

# Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS v4 + CSS variables
- shadcn/ui (New York style, `components.json`)
- Motion (animation library)
- Supabase (PostgreSQL via `@supabase/ssr`)
- Lucide React (icons)
- Vercel (deployment target)

---

# Architecture

```
app/              → Pages and route handlers. Uses (marketing) route group.
components/       → React components: ui/, layout/, navigation/, sections/, case-studies/, media/, diagrams/, shared/
lib/              → Utilities and external integrations. Supabase clients, video providers, cn(), constants.
data/             → Static content and configuration (navigation, services, site config).
types/            → Shared TypeScript interfaces. Import from @/types.
hooks/            → Custom React hooks.
config/           → App configuration files.
public/           → Static assets (images/, icons/, fonts/).
supabase/         → Database migrations and seed data.
```

### What goes where

| Need | Location |
|------|----------|
| New page | `app/(marketing)/` |
| Reusable UI component | `components/` (appropriate subdirectory) |
| shadcn/ui primitive | `components/ui/` |
| Business/content data | `data/` |
| Shared TypeScript types | `types/` |
| Supabase/database logic | `lib/supabase/` |
| External service integration | `lib/` (new module) |
| Video provider logic | `lib/videos/` |
| Static assets | `public/` |
| Custom React hook | `hooks/` |
| Database schema changes | `supabase/migrations/` |

### What does NOT belong

- `components/` — No data fetching, no Supabase imports, no business logic.
- `lib/` — No React components, no JSX.
- `data/` — No runtime logic, no API calls. Only static exports.
- `types/` — No runtime code. Only type definitions.

---

# Coding Rules

## Minimal Change Principle

For every task:

1. Understand the request.
2. Identify the smallest relevant set of files.
3. Inspect those files.
4. Reuse existing code.
5. Make the smallest coherent change.
6. Do not modify unrelated files.
7. Do not refactor unrelated code.
8. Validate the change.

## Existing Code First

Before creating anything new:

1. Search the repository for an existing implementation.
2. Search for similar components.
3. Search for existing utilities (especially `lib/utils.ts`).
4. Search for existing types in `types/`.
5. Extend existing code when appropriate.

Do not create duplicate abstractions.

## Server/Client Boundaries

- Default to React Server Components.
- Use `"use client"` only when browser interactivity or client-side state is required.
- Keep server-only logic (Supabase, env vars, cookies) out of client components.
- Use Next.js 16 conventions: `PageProps<"/route">`, `LayoutProps<"/route">`, `params` is a Promise.

## Components

- Reuse existing components before creating new ones.
- Keep components focused and composable.
- Avoid giant components (>150 lines is a signal to split).
- Do not duplicate UI logic.
- Use `cn()` from `@/lib/utils` for conditional classes.

## Data Flow

```
UI components
  ↓ (props)
Page/layout (Server Component — fetches data)
  ↓
lib/ modules (Supabase, APIs)
  ↓
External services
```

Never import Supabase directly in presentational components.

## Dependencies

- Do not add a dependency for functionality achievable with existing tools.
- Before adding a package, verify the project doesn't already solve it.
- Avoid unnecessary libraries.

## Content Integrity

Never invent: clients, testimonials, metrics, results, experience, certifications, projects, or technologies used on a project. Use explicit placeholders when real content has not been provided.

---

# AI Context Efficiency

Prefer local context over global context. When working on a feature, inspect only:

1. The target file.
2. Its direct dependencies.
3. Relevant types/data.
4. Project rules only when necessary.

Do not automatically inspect the entire repository.

---

# Response Format

When completing a task, respond concisely:

```
Changed:
- file list

What changed:
- brief explanation

Validation:
- lint/typecheck/build results
```

Do not produce long explanations unless requested.

---

# Design System

## Tokens

All design tokens are CSS variables in `app/globals.css`. Never hardcode colors, radii, or shadows.

- **Colors:** `--background`, `--foreground`, `--surface`, `--surface-muted`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--success`, `--warning`, `--destructive`
- **Radius:** `--radius-sm` through `--radius-2xl`, `--radius-full`
- **Shadows:** `--shadow-xs` through `--shadow-xl` (restrained, professional)
- **Motion:** `--duration-fast` (150ms), `--duration-normal` (250ms), `--duration-moderate` (400ms), `--duration-slow` (700ms). Easings: `--ease-out`, `--ease-in-out`, `--ease-spring`

## Existing Components

| Component | Path | Purpose |
|-----------|------|---------|
| Button | `components/ui/button.tsx` | Variants: primary, secondary, ghost, outline, destructive, link. Sizes: sm, md, lg, icon. Supports `loading`, `icon` props. |
| Card | `components/ui/card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Typography | `components/ui/typography.tsx` | Display, H1-H4, BodyLarge, Body, BodySmall, Caption, Label. Use `as` prop to override element. |
| Container | `components/layout/container.tsx` | Max-width wrapper. Use `narrow` for text-heavy content. |
| Section | `components/layout/section.tsx` | Vertical spacing for page sections. Use `compact` for denser areas. |
| VideoEmbed | `components/media/video-embed.tsx` | Lazy-loaded YouTube/Loom embed with click-to-play thumbnail. |
| Workflow | `components/diagrams/workflow.tsx` | WorkflowNode, WorkflowConnector, Workflow container for process visualization. |

## Motion Rules

- Use `motion` package for JS-driven animation. Config: `lib/motion.ts`
- CSS transitions: use `var(--duration-*)` and `var(--ease-*)` variables.
- Always respect `prefers-reduced-motion` (handled globally in `globals.css`).
- Animate to communicate hierarchy or state changes, not for decoration.

## Responsive

- Mobile-first. All components work at 320px minimum.
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- Container: `max-w-6xl` (default), `max-w-3xl` (narrow).

## Visual Direction

Premium, restrained, professional. Avoid: excessive gradients, glassmorphism, glowing effects, decorative blobs. Use: strong typography hierarchy, subtle shadows, controlled spacing.

---

# Information Architecture

Full decisions: `docs/portfolio-architecture.md`

## Homepage Sections (in order)

1. **Hero** — Positioning, primary CTA, optional intro video
2. **Problem Recognition** — 4-6 relatable business pain points
3. **Approach** — Methodology steps (Workflow component)
4. **System Visual** — Connected systems diagram
5. **Featured Work** — 2-3 case studies as business stories
6. **Testimonials** — Real client quotes
7. **Services Overview** — Problem-first service cards
8. **CTA** — Final conversion prompt

## Case Study Page (`/work/[slug]`)

Flexible sections: Context → Problem → Previous Process → Solution → Architecture → Workflow → Video → Outcome → Technologies → Testimonial → CTA. Not every project uses every section.

## Conversion

- Primary goal: start a conversation / book a call.
- Build confidence before asking for contact.
- CTA in: hero, nav, after featured work, end of case studies, footer.
- Language: conversational, not aggressive sales.

## Content Rules

- Business story first, technology second.
- Audience: business owners, founders, ops managers — not developers.
- Never assume visitor knows APIs, webhooks, CRMs, or specific tools.
- Technology appears as supporting evidence, never as the headline.

## Component → Section Mapping

| Section | Components |
|---------|-----------|
| Hero | Container, Section, Button, Display, Body |
| Problem Recognition | Container, Section, Card, H2, Body |
| Approach | Container, Section, Workflow, WorkflowNode, WorkflowConnector |
| System Visual | Container, Section, custom diagram |
| Featured Work | Container, Section, Card, Button |
| Testimonials | Container, Section, Card |
| Case Study | Container, Section, Typography, VideoEmbed, Workflow |

---

# Admin Architecture

## Routes

```
/login            → Supabase Auth login
/admin            → Dashboard (real-time stats)
/admin/projects   → Case study CRUD
/admin/services   → Service CRUD
/admin/videos     → Video library CRUD
/admin/testimonials → Testimonial CRUD
/admin/proof      → Proof/credibility CRUD
/admin/messages   → Contact inbox (status management)
/admin/settings   → Site-wide configuration
```

## Source of Truth Map (Admin)

| Need | Location |
|------|----------|
| Admin UI pages | `app/admin/` |
| Admin shared components | `components/admin/` (AdminPageHeader, AdminStatusBadge, AdminEmptyState, AdminErrorState) |
| Admin data queries | `lib/supabase/admin.ts` |
| Public data queries | `lib/supabase/queries.ts` (graceful fallback) |
| Site settings | `lib/supabase/settings.ts` |
| Auth proxy | `proxy.ts` |
| Login page | `app/login/` |
| Database schema | `supabase/migrations/` |
| Server actions | `app/admin/[module]/actions.ts` |

## Prompt Boundaries

### For admin work
Inspect only: target module in `app/admin/[module]/` + `components/admin/` + `lib/supabase/admin.ts`.

### For public pages
Inspect only: target section in `components/sections/` + `lib/supabase/queries.ts`.

### For database changes
Inspect: `supabase/migrations/` + relevant data access file.

### For new CRUD module
Follow pattern: `actions.ts` (server actions) + `[entity]-form.tsx` (client form) + `[entity]-table.tsx` (client list) + `page.tsx` (server page).

## Authentication

- Supabase Auth (email/password)
- `proxy.ts` protects all `/admin/*` routes
- Unauthenticated → redirected to `/login`
- Session refresh handled in proxy

## Database Tables

| Table | Purpose | Public Read |
|-------|---------|-------------|
| `projects` | Case studies | Published only |
| `project_videos` | Video refs per project | Published projects only |
| `services` | Service offerings | Published only |
| `videos` | Video library | Published only |
| `testimonials` | Client quotes | Published only |
| `proof_items` | Credibility evidence | Published only |
| `contact_submissions` | Form submissions | Never |
| `site_settings` | Site configuration | Yes (public config) |

## Admin CRUD Pattern

```
List page (server) → fetches data → renders Table (client)
Table (client) → publish/unpublish/delete via server actions
New page (server) → renders Form (client)
Edit page (server) → fetches by ID → renders Form (client)
Form (client) → submits via useActionState → server action → revalidatePath
```

## Data Flow

```
Admin UI → Server Action → Validation → Supabase (write) → revalidatePath
Public page → lib/supabase/queries.ts → Supabase (read published only)
```

## Security

- All tables use Row Level Security (RLS)
- `anon` role: read published content + insert contact submissions
- `authenticated` role: full CRUD on all tables
- No service-role key in browser
- Proxy enforces auth on `/admin/*` routes
- Server actions validate input independently of client

---

# Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking
```

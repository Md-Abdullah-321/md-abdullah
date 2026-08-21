# Md Abdullah — Portfolio

Personal portfolio for **Md Abdullah**, Automation & Integration Engineer. Positions expertise in business process automation, systems integration, CRM optimization, API development, and AI-powered workflows.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables |
| Components | shadcn/ui (New York) |
| Animation | Motion |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Deployment | Vercel |

## Quick Start

```bash
npm install
cp .env.example .env.local   # Fill in values
npm run dev                   # http://localhost:3000
```

## Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking
```

## Environment Variables

See `.env.example` for all required variables.

## Architecture

```
app/          → Pages and route handlers (App Router)
components/   → Reusable React components
lib/          → Utilities and external integrations
data/         → Static content and configuration
types/        → Shared TypeScript interfaces
hooks/        → Custom React hooks
config/       → App configuration
public/       → Static assets
supabase/     → Database migrations and seeds
```

Routes: `/`, `/about`, `/work`, `/work/[slug]`, `/services`, `/contact`, `/api/health`

## AI Development

This repository is optimized for AI-assisted development. See:

- **`AGENTS.md`** — Primary AI context file with architecture, rules, and conventions.
- **`.cursor/rules/`** — Cursor-specific rule files for focused guidance.

Key principles: minimal changes, reuse existing code, never invent content, validate with typecheck + lint.

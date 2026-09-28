# Client Portal — public demo

A client-facing project workspace built with Next.js, React, TypeScript, and Tailwind CSS. It makes progress, blockers, dependencies, and next steps visible in one place.

[Open demo](https://client-portal-woad-gamma.vercel.app) · [My portfolio](https://jack-codet-portfolio.vercel.app)

## Context and my contribution

During my Product & Technology internship at Thunderbird Labs, I built and handed off a full-stack client portal for project tracking, billing visibility, and communication. This public repository is a demonstration of the client experience, not the complete company implementation.

## What this repository actually runs

- A project overview and individual project pages.
- Progress, status, ownership, dependencies, and update histories from the static records in [`lib/projects.ts`](lib/projects.ts).
- Reusable project cards, status badges, and progress bars.
- A browser-session demo gate in [`components/portal-gate.tsx`](components/portal-gate.tsx).

The names, dates, progress values, and project outcomes shown by the demo are sample content, not evidence of delivered client projects.

**The demo gate is not production authentication.** Credentials are intentionally visible in client-side code, and the gate stores a flag in `sessionStorage`. Do not put confidential information behind it.

Database/Supabase SQL and planning documents are retained as project artifacts. The current runtime does not connect to Supabase, process payments, or enforce server-side authorization. Those artifacts should not be mistaken for active capabilities of this demo.

## Design decisions

The project records separate current state, what is happening now, blockers, and next steps. That makes a status page useful for deciding what to do next, rather than just reporting a percentage. A shared typed data module keeps the overview and project details consistent.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Demo credentials are shown in the interface. No provider accounts or environment variables are required for this demo.

```sh
npm run typecheck
npm run build
```

## Code map

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Project overview |
| `app/projects/[id]/page.tsx` | Project detail view |
| `lib/projects.ts` | Typed sample project data |
| `components/` | Demo gate and reusable presentation components |
| `supabase/`, `database.sql` | SQL/schema artifacts, outside the demo runtime |

## Scope

This repository demonstrates the public client interface. It does not establish production readiness, real customer adoption, or the status of a company deployment. Existing project documents may describe a broader planned scope; the runtime description above follows the checked-in implementation.

No new license or permission to reuse company work is granted by this documentation update.

# Thunderbird Labs — Client Portal

## Build Spec & Agent Brief

This document is the single source of truth for building the Thunderbird Labs internal client portal. It is written to be read by both a human contractor and their AI coding agent (Claude Code). Read it top to bottom before writing any code.

If you are the agent: do not start scaffolding until you have completed the task in **Section 10 (Kickoff)**. You must explain the build back first.

---

## 0. How to use this document

1. Read the whole thing once. It is not long, and every rule here has a reason.
2. Do the kickoff task in Section 10 (explain the build back, in your own words).
3. Only then begin Phase 0.
4. Treat Sections 3 (Safety) and 4 (Architecture) as non-negotiable. Everything else has room for judgment. Those two do not.

The bar for all code: **production grade**. Even in a dev or staging branch, assume this code ships to production and that real clients log in and depend on it. No throwaway code, no "we'll fix it later" auth, no unhandled errors, no secrets in the client bundle. Typed everywhere, validated at the boundary, tenant-isolated by default.

---

## 1. What we are building

An internal client portal for Thunderbird Labs. It is the place our clients log in to see the status of the software we are building for them, grab their legal and project documents, and keep track of the app subscriptions they pay for.

It is a **multi-tenant** app. Each client company is a **tenant**. A user belongs to exactly one tenant and can only ever see that tenant's data. Thunderbird staff are the exception: they are admins and can see and manage everything.

There is **no public signup**. We create every account. A client cannot self-register.

### Roles (there are two)

- **`admin`** — Thunderbird Labs internal staff. Creates tenants and client accounts, writes project descriptions, sets up phases, posts project updates, uploads documents to a client's vault, and manages billing entries. Sees all tenants.
- **`client`** — a user belonging to one tenant. Read-only on almost everything. Logs in, sees their own project, phases, updates feed, document vault, and billing renewals. Sees only their own tenant.

> A third role (`client_admin`, a client-side power user who can also write) is a clean future extension because roles are just a check in the service layer. Do not build it now. Build the two roles above.

### What each side sees

**Admin sees:** a tenant switcher / list, and for any selected tenant: the project, its phases, the updates feed (with a compose box), the vault (with upload), and the billing tracker (with add/edit). Plus account management (create tenant, create client user).

**Client sees:** their project description and status, a phase timeline, a reverse-chronological updates feed, their document vault (browse + download), and their billing tracker (list of subscriptions with renewal dates and "due soon" flags).

### Feature list

1. **Auth** — email + password login. Sessions in HttpOnly cookies. No signup.
2. **Tenants** — the client company record. Admin-managed.
3. **Users** — accounts tied to a tenant + role. Admin creates them (no public signup).
4. **Projects** — one project record per tenant: name, description, status.
5. **Phases** — ordered phases under a project, each with a status.
6. **Updates** — a feed of project updates admins post; clients read.
7. **Vault (Documents)** — a Google-Drive-style document store per tenant. Admin uploads, client browses and downloads.
8. **Billing** — a tracker of the SaaS subscriptions a client pays for (Vercel, Supabase, and a few others). Manual entries: vendor, plan, amount, renewal date, cadence. No third-party billing integrations. Just the renewal date and a "due soon" indicator.

Build the UI with **shadcn/ui**. Seed realistic mock data so every screen renders with content from day one.

---

## 2. Stack

- **Next.js (App Router, TypeScript)** — the whole app, frontend and server code, in one repo.
- **Tailwind CSS + shadcn/ui** — styling and components.
- **TanStack Query** — all client-side data fetching, caching, and mutations. No SWR, no Apollo, no ad-hoc `useEffect` fetching alongside it.
- **Supabase** — Postgres (data), Auth (GoTrue, sessions), and Storage (the vault). Run entirely locally via the Supabase CLI + Docker. No cloud project and no credentials required to develop.
- **Zod** — request/response schema validation at the server boundary.

**Deployment target is Vercel-only.** There is no separate API server. Server code lives inside Next.js route handlers and server-only modules. This is the "Vercel-only" shape of our standard architecture: the layered backend pattern moves into Next.js server code, and every principle from our scaffold carries over unchanged.

---

## 3. Safety requirements (non-negotiable)

We build software a specific way. These rules are the reason clients can trust the portal. Break one and the design is wrong.

### 3.1 Tenant isolation is the whole game

This is a multi-tenant app where clients see their own data and nobody else's. Tenant isolation is not a feature, it is the foundation.

- **Every** table that holds tenant data has a `tenant_id` column.
- **Every** query in a repository is scoped by `tenant_id`. There is no such thing as an unscoped read of tenant data.
- The tenant a request is allowed to touch comes from the **authenticated session**, never from the request body or a URL param the client controls. A client cannot ask for tenant B's data by sending `tenant_id=B`. The server derives the tenant from who they are.
- Admins are the only role allowed to act across tenants, and even then the target tenant is explicit and checked.

If you ever write a query that reads tenant data without a `tenant_id` filter derived from the session, stop. That is the single most dangerous bug this app can have.

### 3.2 The three auth gates (in order, on every protected route)

1. **Authentication.** Read the session cookie, validate it, load the user. No valid session, respond 401.
2. **Role check (RBAC).** Does this user's role allow this endpoint at all? Admin-only endpoints reject clients here with 403.
3. **Ownership check.** Does this user's tenant actually own the specific resource being touched? A client with a valid session and the right role still must not read another tenant's document by changing an id in the URL. This gate lives in the **service layer** and it is the one people forget. Never skip it. It is what stops IDOR (insecure direct object reference).

Gates 1 and 2 run in the route handler. Gate 3 runs in the service.

### 3.3 The service layer is the primary authorization boundary. RLS is the floor.

- All authorization decisions (ownership, role, state) are made in the **service layer**. That is the primary boundary and it is where you think.
- Every table also ships **Row-Level Security** policies in the same migration that creates it, keyed on `tenant_id`. RLS is the safety net for the day a service-layer check is missed or the wrong client is used. It is the floor, not the primary control. Both exist together.

### 3.4 Never trust the client. Validate at the boundary.

- Every request body is parsed with a Zod schema using **`.strict()`**, so unexpected fields are rejected, not silently ignored. This is a security boundary, not a nicety.
- Response schemas never include sensitive fields (password hashes, service keys, another tenant's ids). Define the shape you return and return only that.

### 3.5 Secrets and keys

- The Supabase **service role key** is server-only. It never appears in a client component, never in the browser bundle, never in `NEXT_PUBLIC_*`. Only server modules under `server/` touch it.
- The client bundle only ever sees the **anon key** and the public URL, and only for the login flow.
- Nothing secret is committed to git. `.env.local` is gitignored. An `.env.example` documents the variable names.

### 3.6 The external wall

Third-party SDKs (the Supabase client, any email provider, any AI call) are imported in exactly one place: `server/external/`. One file per service (`server/external/supabase.ts`, etc.). Domains call these wrappers and never import an SDK directly. This makes provider swaps a one-file change and makes tests trivial to mock. Even if the wall "doesn't have what you need yet," you add it to the wall. You do not shortcut around it.

### 3.7 Data access path

All tenant data access goes: **client component → feature `api.ts` → `/api/*` route handler → server service → server repository → Supabase (service role, server-side)**. The browser never queries Postgres directly. The Supabase JS client in the browser is used **only for the auth flow** (login, session refresh, logout). This keeps the service layer as the single authorization boundary.

### 3.8 Storage (the vault) is private

- Use a **private** Storage bucket. No public URLs.
- Objects are namespaced by tenant: the object path is prefixed with the tenant id (for example `tenant_<id>/<document_id>/<filename>`).
- Downloads happen through short-lived **signed URLs** minted server-side after the ownership check passes. A client never gets a URL to an object outside their tenant.
- Storage RLS policies enforce the tenant prefix as the floor.

### 3.9 Error envelope

Every error the server returns uses one shape:

```json
{ "error": { "code": "MACHINE_READABLE_CODE", "message": "human readable" } }
```

The frontend parses this into a typed `ApiError` and hooks branch on `error.code`. Never leak stack traces or raw database errors to the client.

### 3.10 Audit log

Sensitive writes (creating a user, uploading a document, editing billing, changing a phase) write an append-only audit row: who, what, which tenant, when. The audit write is wrapped so that if it fails, it logs but never breaks the actual operation.

### 3.11 State transitions are atomic

When something changes status (a phase moving from `in_progress` to `done`), the repository executes it as a compare-and-swap: `UPDATE ... WHERE id = ? AND status = ?`. If two requests race, one wins and the other gets a `STATE_CONFLICT` (409). This closes a class of race conditions.

### 3.12 The same-PR contract rule

When you change a contract on one side (a new endpoint, a new field, a new error code), you change the mirroring side in the **same** commit / PR. The server route and the frontend `api.ts` that calls it move together. This prevents the most common full-stack bug: one side ships, the other does not know, and things break silently.

### 3.13 Production-grade checklist (applies to every PR)

- TypeScript strict mode on. No `any` that hides a real type.
- Every server route validates input (Zod `.strict()`) and returns the error envelope on failure.
- Every tenant query is tenant-scoped from the session.
- No secrets client-side. No `console.log` of tokens or PII.
- Loading, empty, and error states handled in the UI. No screen that renders blank on failure.
- No dead code, no committed TODOs standing in for missing auth or validation.
- Migrations include RLS. Seed data lets every screen render.

---

## 4. Architecture (the code shape)

We organize both halves of the app the same way so that understanding one feature means understanding all of them.

### 4.1 Three principles

1. **A feature is a folder.** Each business concept owns one folder with its full vertical slice. Add a feature, add a folder. Remove it, delete the folder.
2. **Dependencies flow one direction.** Nothing reaches sideways into a sibling feature's internals. Features never import each other.
3. **Each layer has one job and is too dumb to know what the layer below is doing.** That ignorance is what makes layers swappable and testable.

### 4.2 Server layout (Vercel-only shape)

Because there is no FastAPI, the layered backend lives in Next.js server code:

```
src/
├── app/
│   └── api/
│       └── [domain]/route.ts     ← the door (route handler)
├── server/
│   ├── [domain]/
│   │   ├── service.ts            ← the brain (all logic + auth gate 3)
│   │   ├── repository.ts         ← the data layer (only file touching the DB)
│   │   └── schemas.ts            ← Zod shapes (in + out)
│   ├── core/                     ← shared server tools nobody owns
│   │   ├── auth.ts               ← getCurrentUser, requireRole, cookie helpers
│   │   ├── audit.ts              ← append-only audit writes
│   │   ├── errors.ts             ← typed errors + envelope conversion
│   │   └── config.ts             ← env loading, crashes on missing secret
│   └── external/                 ← the wall: SDK wrappers, one file per service
│       └── supabase.ts
```

Mapping from our standard scaffold:

| Standard scaffold | Here (Vercel-only) | Job |
|---|---|---|
| `router.py` | `app/api/[domain]/route.ts` | the door: method + path, validate, run gates 1 and 2, call service |
| `service.py` | `server/[domain]/service.ts` | the brain: logic, ownership (gate 3), audit, typed errors |
| `repository.py` | `server/[domain]/repository.ts` | the data layer: queries only, returns raw rows, no logic |
| `schemas.py` | `server/[domain]/schemas.ts` | Zod schemas, `.strict()` on input |
| `core/` | `server/core/` | shared server tools |
| `external/` | `server/external/` | the SDK wall |

**Route handler** is embarrassingly simple: validate the body, run gate 1 (`getCurrentUser`) and gate 2 (`requireRole`), call the service, return its result or map its typed error to the envelope. Around 10 lines per endpoint. No logic, no DB calls.

**Service** is the only place you think. Ownership check (gate 3, tenant match), business rules, side effects, audit write, typed exceptions. It calls the repository for data and `external/` for third parties. It never imports the Supabase client directly.

**Repository** is the only file in a domain that touches Postgres. Mechanical queries, raw rows out, always tenant-scoped. No logic, no ownership decisions.

**Schemas** define input and output shapes. Input uses `.strict()`. Output never includes sensitive fields.

### 4.3 Frontend layout

```
src/
├── app/                 ← routes, providers, composition (the conductor)
│   ├── admin/           ← admin portal (layout = the bouncer, checks role)
│   ├── client/          ← client portal (layout = the bouncer, checks role)
│   ├── login/
│   └── api/             ← (server route handlers live here, see 4.2)
├── features/
│   └── [feature]/
│       ├── components/  ← dumb UI: render props, emit events
│       ├── hooks.ts     ← the brain: TanStack Query, state, cache, error mapping
│       ├── api.ts       ← the only file that calls the network
│       └── types.ts     ← TS types mirroring server schemas
└── shared/
    ├── ui/              ← shadcn primitives (Button, Card, Dialog, ...)
    ├── api/             ← the request() wrapper + ApiError class
    ├── utils/           ← pure helpers (formatDate, formatCurrency)
    ├── hooks/           ← truly cross-cutting hooks
    ├── types/           ← truly shared types
    └── lib/             ← supabase auth client (login flow only)
```

Frontend layer mapping:

| Layer | File | Job |
|---|---|---|
| the door / UI | `components/` | render + emit events; never calls the network; asks hooks for data |
| the brain | `hooks.ts` | TanStack Query, caching, orchestration, error handling by `error.code` |
| the data layer | `api.ts` | the only file that calls `fetch`, one function per endpoint, relative `/api/...` paths |
| the shapes | `types.ts` | mirrors server schemas exactly (ISO strings for dates, `null` for optional) |

### 4.4 The conductor: `app/`

`app/` is the only zone allowed to know about every feature. It defines routes, sets up providers (auth context, TanStack Query client, theme), and composes features into pages. Pages are thin (1 to 3 lines) and just render a feature component.

**Role-portal pattern.** Each role gets a folder with a `layout.tsx` that is the bouncer: it checks the role server-side and redirects if wrong. Every page beneath inherits the guard. This is the frontend equivalent of `requireRole` on the server. `app/admin/layout.tsx` allows only `admin`; `app/client/layout.tsx` allows only `client`.

**Two layers of auth protection.** `middleware.ts` runs at the edge and does a cheap cookie-presence check (no session cookie, redirect to `/login`). It never reads the cookie value (it is HttpOnly). The layout does the real role check.

### 4.5 Cross-feature interaction

Features never import each other. When one needs another's data or behavior, in order of preference:

1. The server joins the data and exposes one endpoint returning the combined shape.
2. The server triggers the side effect: feature A's service calls feature B's service. The frontend features never touch each other.
3. The page composes both features at the `app/` layer.
4. Promote a tiny generic piece to `shared/` (used sparingly).

Never a direct feature-to-feature import.

### 4.6 Server vs client components

Default to Server Component. Add `"use client"` only when the file needs hooks, state, refs, or event handlers. Layouts and pages stay Server (they run the server-side auth check and render 1 to 3 lines). `hooks.ts` is always Client. Feature components are mixed: a static status badge stays Server, a form or a `useQuery` table is Client.

### 4.7 Adding a feature (the whole process)

Confirm it is a real feature (own data, own UI, describable in one sentence) → create the server domain folder with the three files → create the frontend feature folder with the four files → add the migration with RLS in the same file → wire one thin route in `app/` → seed data → both sides change in the same PR. If you have to touch another feature's internals to make it work, the design is wrong.

---

## 5. Domains and data model

Every table below has: `id` (uuid, pk), `created_at`, `updated_at`, and (except `tenants`) a `tenant_id` foreign key. Every table ships RLS in its migration, keyed on `tenant_id` (the `tenants` table is keyed on membership / admin role). All amounts are integer minor units (cents) to avoid float math.

### tenants
The client company. `name`, `slug`, `status` (`active` / `archived`).
RLS: a user can read their own tenant; admins read all.

### users
Links a Supabase auth user to a tenant and role. `auth_user_id` (uuid, references Supabase auth), `tenant_id` (null for admins), `role` (`admin` / `client`), `full_name`, `email`.
RLS: a user reads their own row; admins read all. Only admins (service role, server-side) create rows.

### projects
One per tenant (keep it one-to-one for v1). `tenant_id`, `name`, `description` (long text), `status` (`planning` / `in_progress` / `on_hold` / `delivered`).
RLS: read where `tenant_id` matches the user's tenant; admins all. Write: admin only.

### phases
Ordered phases under a project. `project_id`, `tenant_id`, `title`, `description`, `order_index` (int), `status` (`not_started` / `in_progress` / `done`).
RLS: read by tenant; write admin only. Status changes use compare-and-swap.

### updates
The project updates feed. `project_id`, `tenant_id`, `author_user_id`, `body` (text), `kind` (`update` / `milestone`), `pinned` (bool).
RLS: read by tenant; write admin only. Rendered reverse-chronological.

### documents
Vault metadata. `tenant_id`, `name`, `folder` (text path for the Drive-style tree, for example `Legal/Contracts`), `storage_path` (the object key in the private bucket), `mime_type`, `size_bytes`, `uploaded_by_user_id`.
RLS: read by tenant; write admin only. The file itself lives in Storage; this table is metadata + the pointer.

### subscriptions (billing)
The apps a client pays for. `tenant_id`, `vendor` (for example "Vercel", "Supabase"), `plan` (text), `amount_cents` (int), `currency` (default `usd`), `cadence` (`monthly` / `annual`), `renews_on` (date), `status` (`active` / `canceled`), `notes`.
RLS: read by tenant; write admin only (default). "Due soon" is derived: renews within N days.

### audit_log
Append-only. `tenant_id`, `actor_user_id`, `action` (text), `entity_type`, `entity_id`, `metadata` (jsonb).
RLS: admins read; nobody updates or deletes. Written by `server/core/audit.ts`.

### Endpoints per domain (illustrative, not exhaustive)

- `auth`: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `tenants`: `GET /api/tenants` (admin), `POST /api/tenants` (admin)
- `users`: `POST /api/users` (admin creates a client account), `GET /api/users` (admin)
- `projects`: `GET /api/projects` (own), `PATCH /api/projects/:id` (admin)
- `phases`: `GET /api/phases?projectId=`, `POST /api/phases` (admin), `PATCH /api/phases/:id` (admin)
- `updates`: `GET /api/updates?projectId=`, `POST /api/updates` (admin)
- `documents`: `GET /api/documents`, `POST /api/documents` (admin upload → returns metadata), `GET /api/documents/:id/download` (returns a signed URL after gate 3)
- `billing`: `GET /api/subscriptions`, `POST /api/subscriptions` (admin), `PATCH /api/subscriptions/:id` (admin)

Every read is tenant-scoped from the session. Every admin write checks role (gate 2) and tenant target (gate 3).

---

## 6. Phased plan

Ship in phases. Each phase ends in a working, demoable, production-grade state. Do not start a phase before the previous one's done-criteria are met.

### Phase 0 — Foundation and local environment
**Goal:** the repo runs locally with Supabase on Docker, the folder skeleton exists, and a placeholder login page renders.
**Deliverables:** git repo initialized; Next.js + TS (strict) + Tailwind + shadcn set up; Supabase CLI local stack running (`supabase start`); `supabase/config.toml` with signups disabled; the `server/` and `features/` and `shared/` skeleton; `shared/api/request.ts` wrapper + `ApiError`; error envelope + typed errors in `server/core/errors.ts`; `server/external/supabase.ts` wall; `middleware.ts` presence check; `CLAUDE.md` copied from this doc.
**Done when:** `npm run dev` serves the app, `supabase start` boots the stack, and the login page renders against the local auth service.

### Phase 1 — Auth, tenancy, and RBAC
**Goal:** real login, sessions, role portals, and the tenant model.
**Deliverables:** `tenants` and `users` tables + RLS + seed; login/logout/me endpoints; HttpOnly session cookies; `app/admin` and `app/client` role-portal layouts (the bouncers); admin ability to create a tenant and create a client account (no public signup); gate 1, 2, 3 helpers in `server/core/auth.ts`.
**Done when:** an admin can log in and land in the admin portal; a seeded client can log in and land in the client portal; a client cannot reach any admin route; a client cannot read another tenant's `me`/tenant data.

### Phase 2 — Projects and phases
**Goal:** admin authors a project + phases; client reads them.
**Deliverables:** `projects` and `phases` tables + RLS + seed; admin edit of project description/status; admin CRUD of phases with ordering and compare-and-swap status changes; client read-only project view + phase timeline (shadcn).
**Done when:** admin edits a project and its phases for a tenant; that tenant's client sees the changes; no other tenant sees them.

### Phase 3 — Updates feed
**Goal:** admin posts updates; client reads a timeline.
**Deliverables:** `updates` table + RLS + seed; admin compose box; reverse-chronological feed with pinned/milestone rendering; client read view.
**Done when:** admin posts an update to a tenant and only that tenant's client sees it, newest first.

### Phase 4 — Vault (documents)
**Goal:** a Google-Drive-style per-tenant document store.
**Deliverables:** private Storage bucket + Storage RLS keyed on tenant prefix; `documents` metadata table + RLS; admin upload (writes the object under `tenant_<id>/...` and a metadata row); folder-style browsing UI; download via server-minted signed URL after gate 3.
**Done when:** admin uploads a doc to a tenant; that client browses folders and downloads it; a client cannot obtain a URL to another tenant's object even by guessing ids.

### Phase 5 — Billing tracker
**Goal:** track the SaaS subscriptions a client pays for and flag upcoming renewals.
**Deliverables:** `subscriptions` table + RLS + seed; admin add/edit (vendor, plan, amount, cadence, renewal date); client read view; "due soon" derived flag (renews within N days) and sorting by soonest renewal.
**Done when:** admin adds Vercel/Supabase entries for a tenant with renewal dates; that client sees them sorted by soonest, with due-soon flagged.

### Phase 6 — Hardening and polish
**Goal:** production-grade finish.
**Deliverables:** audit log wired on all sensitive writes; consistent loading/empty/error states across every screen; a written test for each service's ownership check (gate 3) proving cross-tenant access fails; accessibility pass on shadcn components; README with run instructions; final RLS review (every table, every policy).
**Done when:** the production-grade checklist in Section 3.13 passes on every feature.

---

## 7. Running everything locally with Supabase on Docker (no credentials)

The point of this setup: the contractor needs **no cloud account and no real credentials**. The Supabase CLI runs the entire stack (Postgres, Auth, Storage, Studio) in Docker locally, and prints local-only keys that are safe for development. Nothing here touches production.

### 7.1 Prerequisites

- **Docker Desktop** running.
- **Node.js** 20+ and npm.
- **Supabase CLI** (installed as a dev dependency below, run via `npx`, so no global install needed).

### 7.2 Install the CLI as a dev dependency

From the repo root:

```bash
npm install --save-dev supabase
npx supabase --version
```

### 7.3 Initialize Supabase in the repo

```bash
npx supabase init
```

This creates a `supabase/` folder with `config.toml`, a `migrations/` folder, and a `seed.sql`.

### 7.4 Disable public signup

In `supabase/config.toml`, under the auth section, turn signups off so accounts can only be created by us server-side:

```toml
[auth]
enable_signup = false

[auth.email]
enable_confirmations = false
```

(`enable_confirmations = false` lets seeded/local accounts log in without an email round-trip during development.)

### 7.5 Start the stack

```bash
npx supabase start
```

The first run pulls Docker images (a few minutes). When it finishes it prints something like:

```
API URL: http://127.0.0.1:54321
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
anon key: <local anon key>
service_role key: <local service_role key>
```

Those keys are **local development keys**, not real credentials. They are the same well-known values on every developer's machine and are safe to use locally. They must never be used against a real Supabase project, and only the anon key is ever exposed to the browser.

Studio (the local dashboard) is at `http://127.0.0.1:54323`. Use it to inspect tables, auth users, and storage while developing.

### 7.6 Environment variables

Create `.env.local` (gitignored) from the printed values:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local anon key>
SUPABASE_SERVICE_ROLE_KEY=<local service_role key>   # server-only, never NEXT_PUBLIC
```

Commit a matching `.env.example` with the variable names (and the well-known local values as defaults are acceptable since they are non-secret local keys). The real rule: `SUPABASE_SERVICE_ROLE_KEY` is only ever read in `server/` code.

### 7.7 Migrations and seed

Create a migration for each table (with its RLS in the same file):

```bash
npx supabase migration new create_tenants
# edit supabase/migrations/<timestamp>_create_tenants.sql
```

Put seed data in `supabase/seed.sql` so every screen has content: one admin, two demo tenants, a client user per tenant, a project with phases, a few updates, a couple of documents' metadata, and some subscriptions.

Apply migrations + seed by resetting the local database:

```bash
npx supabase db reset
```

This drops the local DB, re-runs every migration in order, then runs `seed.sql`. Run it whenever you add a migration or want a clean slate.

### 7.8 Creating the first accounts locally (no signup)

Since public signup is off, create the admin and client auth users with the service role, server-side. Add a small dev script (run with `npx tsx scripts/seed-users.ts`) that uses `server/external/supabase.ts` with the service role key to call the admin create-user API, then insert matching rows into `public.users` with the correct `tenant_id` and `role`. Alternatively, create the auth users by hand in Studio (`http://127.0.0.1:54323`) and let `seed.sql` insert the `public.users` rows. Document whichever path in the README.

### 7.9 Run the app

```bash
npm run dev
```

Open the app, log in with a seeded admin, verify the admin portal. Log in with a seeded client, verify they only see their own tenant.

### 7.10 Everyday commands

```bash
npx supabase start     # boot the local stack
npx supabase stop      # shut it down
npx supabase db reset  # re-run migrations + seed (clean slate)
npm run dev            # run Next.js
```

---

## 8. Initializing the repo (git)

It is just a git repo the contractor runs locally. No CI secrets, no deploy target needed yet.

```bash
mkdir thunderbird-client-portal && cd thunderbird-client-portal
git init
# scaffold Next.js (App Router, TypeScript, Tailwind, ESLint) into this folder
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
# shadcn
npx shadcn@latest init
# supabase local
npm install --save-dev supabase
npx supabase init
```

Then create the folder skeleton from Section 4, add `CLAUDE.md` (this document), add `.env.example`, and confirm `.gitignore` includes:

```
.env
.env.local
.env*.local
node_modules
.next
supabase/.branches
supabase/.temp
```

First commit should be Phase 0 complete: the app runs, the local stack runs, the skeleton and safety scaffolding (request wrapper, error envelope, auth helpers, external wall) are in place.

---

## 9. Common mistakes to avoid

- A query that reads tenant data without a `tenant_id` filter from the session. This is the worst bug possible here.
- Trusting `tenant_id` from the request body or URL. Derive it from the session.
- Skipping gate 3 because gates 1 and 2 passed. A valid client with the right role can still try to grab another tenant's resource by id.
- Importing the Supabase client (or any SDK) outside `server/external/`.
- Putting the service role key anywhere the browser can see it, including any `NEXT_PUBLIC_*` var.
- Public Storage URLs or long-lived links. Use private buckets and short-lived signed URLs minted after the ownership check.
- Feature-to-feature imports. Compose at `app/` or join on the server instead.
- Shipping a screen with no loading/empty/error state.
- Changing a server contract without changing the frontend `api.ts` in the same PR.
- Naming a folder `utils`, `helpers`, `common`, or `shared` inside a feature to dump code you did not know where to put. That is a signal it belongs in a real domain or in top-level `shared/`.

---

## 10. Kickoff (do this before writing any code)

Before scaffolding, reply with a written brief in your own words that covers:

1. **What we are building** — the product, the two roles, the multi-tenant model, and each of the eight features, in a few sentences each.
2. **How you will build it** — the Vercel-only architecture: feature-as-folder, the server layers (route handler / service / repository / schemas), the frontend layers (components / hooks / api / types), the role-portal pattern, and how the two halves stay in sync.
3. **The safety model** — the tenant isolation rule, the three auth gates and where each runs, service-layer-as-primary-boundary with RLS as the floor, the external wall, the private-vault + signed-URL rule, and where the service role key is and is not allowed.
4. **The plan** — the phases in order, and specifically what "done" means for Phase 0.
5. **Local setup** — how you will run the whole thing locally with Supabase on Docker and why no real credentials are required.

Then propose the exact folder tree and the Phase 0 file list you intend to create, and wait for a go-ahead before generating code.

If anything in this document is ambiguous, ask before you build. Do not fill a gap with an assumption that weakens tenant isolation or any of the Section 3 rules.

# LOVE Architecture

LOVE (Library of Volunteer Experiences) connects Fannin County, Georgia volunteers with nonprofit
organizations. This document explains how the repository is organized and the decisions that will
keep it maintainable for many years. Deeper dives live in [`docs/architecture/`](docs/architecture/);
recorded decisions live in [`docs/decisions/`](docs/decisions/).

## Contents

1. [Guiding principles](#1-guiding-principles)
2. [Repository structure](#2-repository-structure)
3. [Package dependency rules](#3-package-dependency-rules)
4. [Backend (Convex)](#4-backend-convex)
5. [Legacy packages](#5-legacy-packages)
6. [Configuration](#6-configuration)
7. [Authentication and authorization](#7-authentication-and-authorization)
8. [Notifications](#8-notifications)
9. [Future AI integration points](#9-future-ai-integration-points)
10. [Mobile/web relationship](#10-mobileweb-relationship)
11. [Accessibility](#11-accessibility)
12. [Tooling and quality gates](#12-tooling-and-quality-gates)

---

## 1. Guiding principles

1. **One backend, used directly.** Convex is the database, server functions, file storage, and auth
   ([ADR 0007](docs/decisions/0007-use-convex-directly.md)). Backend code lives in
   `apps/web/convex/`, and pages call it directly. (This replaced the earlier "provider-agnostic"
   design, ADR 0002.)
2. **Secure by default.** See [SECURITY.md](SECURITY.md). Architecture rules that protect security
   are enforced by lint, not just documented.
3. **Accessible first.** Many users are older adults. Large targets, large text, high contrast,
   and full keyboard/screen-reader support are requirements, not polish.
4. **One source of truth.** Types, validation schemas, and constants are defined once in shared
   packages and reused by web, mobile, and server.
5. **Boring, mainstream technology.** Widely used tools with long support horizons, so future
   volunteers and contractors can maintain the code.

## 2. Repository structure

```
love-app/
├── apps/
│   ├── web/                 Next.js 16 (App Router) — primary platform
│   │   ├── convex/          BACKEND: schema.ts, query/mutation/action files, lib/ helpers
│   │   │   └── _generated/  Written by `npx convex dev` (never edit)
│   │   └── src/
│   │       ├── app/         Routes (pages) + globals.css (design tokens)
│   │       ├── components/  ALL web components: ui/ (shadcn building blocks), auth/, …
│   │       └── lib/         Helpers (cn, forms, formatting)
│   └── mobile/              Expo (React Native) — secondary platform, placeholder today
├── packages/
│   ├── shared/              Domain models (Volunteer, Nonprofit, Event, ...) and constants
│   ├── validation/          Zod schemas for every input that crosses a trust boundary
│   ├── api-contracts/       Request/response types between clients and the web server
│   ├── config/              Validated env + backend/auth/notification/security config, feature flags
│   ├── auth/                LEGACY (ADR 0007): RBAC matrix, guards — do not use in new code
│   └── backend/             LEGACY (ADR 0007): provider interfaces — do not use; to be removed
├── docs/
│   ├── architecture/        Deep dives (backend abstraction, AI matching, accessibility, ...)
│   ├── decisions/           Architecture Decision Records (ADRs)
│   └── security/            Data classification, dependency policy, threat model
├── .github/workflows/       CI (lint, types, build) and security (secrets, audit)
├── ARCHITECTURE.md          This file
├── SECURITY.md              Mandatory security rules (humans and AI agents)
├── CONTRIBUTING.md          How to work in this repo
└── AGENTS.md                Entry point for AI coding agents
```

Workspace packages are **internal packages**: they publish TypeScript source (`exports` point at
`src/*.ts`) and are compiled by the consuming app (Next.js `transpilePackages`, Metro for Expo).
There is no separate build step for packages, which keeps the feedback loop fast.

## 3. Package dependency rules

```
                    ┌──────────┐
                    │  shared  │  ← depends on nothing
                    └────┬─────┘
            ┌────────────┤
      ┌─────▼──────┐ ┌───▼────┐
      │ validation │ │ config │
      └─────┬──────┘ └───┬────┘
   ┌────────▼──────┐  ┌──┴───────┐
   │ api-contracts │  │   auth   │
   └───┬───────┬───┘  │ backend  │
       │       │      └────┬─────┘
  ┌────▼───┐ ┌─▼───────────▼─────────────┐
  │ mobile │ │  web (incl. components)   │
  └────────┘ └───────────────────────────┘
```

| Package           | May be imported by                      | Must never import                                       |
| ----------------- | --------------------------------------- | ------------------------------------------------------- |
| `shared`          | everything                              | anything platform-specific                              |
| `validation`      | everything                              | `config`, `backend`, `auth`                             |
| `api-contracts`   | web, mobile                             | `config`, `backend`, `auth`                             |
| `config`          | web (server), `auth`, `backend`         | — (it is the **only** package that reads `process.env`) |
| `auth`            | **legacy — no new imports**             | provider SDKs                                           |
| `backend`         | **legacy — no new imports**             | —                                                       |
| `apps/web/convex` | web pages (through the generated `api`) | browser-only code (it runs on Convex's servers)         |
| **mobile**        | —                                       | `backend`, `config`, `auth` (lint-enforced)             |

## 4. Backend (Convex)

Convex is the backend ([ADR 0007](docs/decisions/0007-use-convex-directly.md)). It provides the
database, server functions, file storage, scheduling, and authentication (Convex Auth). All backend
code lives in **`apps/web/convex/`** and runs on Convex's servers, never in the browser.

| File                                         | Holds                                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `schema.ts`                                  | Every table, its fields (`v.*` validators), and its indexes                              |
| `<area>.ts` (e.g. `events.ts`, `signups.ts`) | `query` (read), `mutation` (read + write), `action` (calls outside services) functions   |
| `lib/`                                       | Shared helpers, e.g. `requireUser(ctx)`, distance math                                   |
| `_generated/`                                | Written by `npx convex dev`: the `api` object, types, and the AI guidelines. Never edit. |

**How a page uses it:**

```ts
// apps/web/convex/events.ts  (backend)
export const listUpcoming = query({
  args: { now: v.number() },
  handler: async (ctx, args) => {
    /* ctx.db reads … */
  },
});

// apps/web/src/app/…/page.tsx  ('use client')
const events = useQuery(api.events.listUpcoming, { now }); // live: re-renders when data changes
```

`useMutation` and `useAction` work the same way, but return a function you call (e.g. on a click).

**Security model:**

- Every exported function is reachable from the internet. Each function that reads private data or
  changes anything must get the caller on the server and check ownership/membership itself. See
  [SECURITY.md §3](SECURITY.md#3-authorization).
- Every function declares `args` validators; Convex rejects mismatched calls before the handler
  runs.
- Functions only other backend code calls use `internalQuery` / `internalMutation` /
  `internalAction`.
- Mutations are transactions: all writes in one mutation succeed or fail together. This is what
  keeps shift capacity and love counts correct.

**Rules for the installed Convex version:** `apps/web/convex/_generated/ai/guidelines.md` and
[docs/product/plan.md §4](docs/product/plan.md).

**Development:** each developer runs `npx convex dev` in `apps/web`, which uses their **own** dev
deployment (own data). Production is a separate deployment, used by the live site.

## 5. Legacy packages

`packages/backend` (provider interfaces, `getBackend()`) and the RBAC matrix/guards in
`packages/auth` come from the original provider-agnostic design (ADR 0002, superseded). They are not
connected to anything. **New code must not import them.** They will be removed once nothing depends
on them. [docs/architecture/backend-abstraction.md](docs/architecture/backend-abstraction.md) and
[provider-replacement.md](docs/architecture/provider-replacement.md) are kept only as history.

## 6. Configuration

`@love/config` is the only package in the web app that reads `process.env` (lint-enforced); the
Convex URL reaches pages through `getPublicEnv().CONVEX_URL`. Convex functions read their own
deployment environment variables, set in the Convex dashboard. Every `@love/config` variable is
validated by a Zod schema at startup. (`backend.config.ts`, `auth.config.ts`, and
`notification.config.ts` belong to the legacy design and are not used by Convex.)

| File                     | Purpose                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| `env.ts`                 | Schema, provider name registries, `getServerEnv()` / `getPublicEnv()`         |
| `backend.config.ts`      | Which provider serves database, auth, storage + connection details            |
| `auth.config.ts`         | Methods, session timeouts, cookie flags, MFA rules, lockout, token TTLs       |
| `notification.config.ts` | Provider per channel (email/SMS/push)                                         |
| `featureFlags.ts`        | All feature toggles (default **off**)                                         |
| `security.config.ts`     | Request size limits, rate limits, upload types, CSP builder, security headers |

`APP_ENV` (`development`/`test`/`staging`/`production`) is separate from `NODE_ENV` (which Next.js
sets to `production` for every build). In `staging`/`production`, validation **requires** all
credentials for the selected providers and rejects dev-only providers such as `console`, so a
misconfigured deployment fails at startup instead of misbehaving.

## 7. Authentication and authorization

- **Authentication** (who are you?) is **Convex Auth**: email + password (and Google sign-in),
  with users stored in the `users` table. Inside any Convex function, `getAuthUserId(ctx)` returns
  the signed-in user's ID (or `null`).
- **Authorization** (may you do this?) is checked **inside each Convex function**:
  - There is **one account type**. A person can volunteer and can also belong to nonprofits.
  - **Nonprofit powers come from a `memberships` record** (`owner` or `member`) linking a user to a
    nonprofit. Functions that change a nonprofit or its events check that the caller has a
    membership for it; only owners manage members.
  - Shared helpers in `apps/web/convex/lib/auth.ts` (e.g. `requireUser`, `requireMember`) keep these
    checks consistent.

## 8. Notifications

Notifications are **in-app only**: rows in the `notifications` table, written inside the mutations
that cause them (e.g. editing an event notifies everyone signed up), and shown by a bell in the
navbar that updates live through `useQuery`. Email and SMS are post-MVP and would be sent from Convex
actions.

## 9. Future AI integration points

Volunteers describe skills in their own words ("I teach kids math.", "I speak Spanish."). Future
AI will extract structured skills, embed them, and match them against event requirements. **No AI
is implemented**, and the MVP matches with tags instead. The interfaces named below live in the
legacy `packages/backend`; when AI work starts, it will be built as Convex actions (with Convex's
vector search), using this design as a guide.

| Integration point                 | Location                                                               |
| --------------------------------- | ---------------------------------------------------------------------- |
| Raw user text (never overwritten) | `Volunteer.skillDescription`, `Event.requiredSkills/desiredSkills`     |
| AI-derived data (regenerable)     | `VolunteerSkillProfile` model, `skillProfiles` collection              |
| Skill extraction                  | `SkillExtractionProvider` interface                                    |
| Embeddings                        | `EmbeddingProvider` interface                                          |
| Vector search                     | `VectorIndexProvider` interface                                        |
| Ranking and explanations          | `MatchingEngine` interface → `OpportunityMatch.matchScore/matchReason` |
| Vendor selection                  | `AI_PROVIDER` env var; `aiMatching` feature flag                       |

Full design, including privacy rules and a non-AI fallback: [docs/architecture/ai-matching.md](docs/architecture/ai-matching.md).

## 10. Mobile/web relationship

- **The web app is the primary platform.** Its pages call the Convex backend in `apps/web/convex/`.
- **Mobile (later)** will most likely call the **same Convex functions** through Convex's React
  Native client. The same `args` validators and caller checks then protect both apps. Record the
  decision in an ADR when mobile work starts (ADR 0004 assumed a web-hosted API, before Convex was
  chosen). Mobile never holds admin credentials (lint-enforced).
- Both share `@love/shared` (constants such as tag lists, and types) and `@love/validation` (Zod
  schemas for forms).
- React is pinned to the single version the current Expo SDK supports, so web and mobile share one
  React copy in the monorepo.
- The UI components (`apps/web/src/components`) are web-only (DOM + Tailwind). Mobile will get its own components that
  follow the same design tokens.

Details: [docs/architecture/mobile-web.md](docs/architecture/mobile-web.md).

## 11. Accessibility

The target is **WCAG 2.2 AA**, with older-adult-specific defaults beyond AA: 18px base text, 44px+
targets, thick focus rings, high-contrast tokens, reduced-motion support, and plain language. See
[docs/architecture/accessibility.md](docs/architecture/accessibility.md).

## 12. Tooling and quality gates

| Concern     | Tool                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| Monorepo    | npm workspaces + Turborepo                                                |
| Language    | TypeScript 6 (strict, `noUncheckedIndexedAccess`)                         |
| Lint        | ESLint 9 flat config (root `eslint.config.mjs`), incl. architecture rules |
| Format      | Prettier (+ Tailwind class sorting)                                       |
| Git hooks   | Husky: pre-commit → lint-staged (ESLint fix + Prettier on staged files)   |
| CI          | `ci.yml`: format, lint, type-check, build (web + iOS/Android bundles)     |
| Security CI | `security.yml`: TruffleHog secret scan, npm audit; Dependabot             |

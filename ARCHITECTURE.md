# LOVE Architecture

LOVE (Library of Volunteer Experiences) connects Fannin County, Georgia volunteers with nonprofit
organizations. This document explains how the repository is organized and the decisions that will
keep it maintainable for many years. Deeper dives live in [`docs/architecture/`](docs/architecture/);
recorded decisions live in [`docs/decisions/`](docs/decisions/).

## Contents

1. [Guiding principles](#1-guiding-principles)
2. [Repository structure](#2-repository-structure)
3. [Package dependency rules](#3-package-dependency-rules)
4. [Backend abstraction strategy](#4-backend-abstraction-strategy)
5. [Provider replacement strategy](#5-provider-replacement-strategy)
6. [Configuration](#6-configuration)
7. [Authentication and authorization](#7-authentication-and-authorization)
8. [Notifications](#8-notifications)
9. [Future AI integration points](#9-future-ai-integration-points)
10. [Mobile/web relationship](#10-mobileweb-relationship)
11. [Accessibility](#11-accessibility)
12. [Tooling and quality gates](#12-tooling-and-quality-gates)

---

## 1. Guiding principles

1. **Provider-agnostic.** No application code knows which backend, email service, SMS gateway, or
   AI vendor is in use. Switching is a configuration change.
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
│   ├── web/                 Next.js 16 (App Router) — primary platform, also hosts the API
│   └── mobile/              Expo (React Native) — secondary platform, placeholder today
├── packages/
│   ├── shared/              Domain models (Volunteer, Nonprofit, Event, ...) and constants
│   ├── validation/          Zod schemas for every input that crosses a trust boundary
│   ├── api-contracts/       Request/response types between clients and the web server
│   ├── config/              Validated env + backend/auth/notification/security config, feature flags
│   ├── auth/                RBAC permission matrix, guards, session policy, CSRF helpers
│   ├── backend/             Provider interfaces + factory; vendor implementations in providers/
│   └── ui/                  shadcn/ui component library + design tokens (web)
├── docs/
│   ├── architecture/        Deep dives (backend abstraction, AI matching, accessibility, ...)
│   ├── decisions/           Architecture Decision Records (ADRs)
│   └── security/            Data classification, dependency policy, threat model
├── .github/workflows/       CI (lint, types, build) and security (CodeQL, secrets, audit)
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
            ┌────────────┼─────────────┐
      ┌─────▼──────┐ ┌───▼────┐   ┌────▼───┐
      │ validation │ │ config │   │   ui   │
      └─────┬──────┘ └───┬────┘   └────┬───┘
   ┌────────▼──────┐  ┌──┴───────┐     │
   │ api-contracts │  │   auth   │     │
   └───┬───────┬───┘  │ backend  │     │
       │       │      └────┬─────┘     │
  ┌────▼───┐ ┌─▼───────────▼───────────▼─┐
  │ mobile │ │            web            │
  └────────┘ └───────────────────────────┘
```

| Package         | May be imported by              | Must never import                                       |
| --------------- | ------------------------------- | ------------------------------------------------------- |
| `shared`        | everything                      | anything platform-specific                              |
| `validation`    | everything                      | `config`, `backend`, `auth`                             |
| `api-contracts` | web, mobile                     | `config`, `backend`, `auth`                             |
| `config`        | web (server), `auth`, `backend` | — (it is the **only** package that reads `process.env`) |
| `auth`          | web (server)                    | provider SDKs                                           |
| `backend`       | web (server code only)          | — (only `src/providers/**` may import provider SDKs)    |
| `ui`            | web                             | `config`, `backend`, `auth`                             |
| **mobile**      | —                               | `backend`, `config`, `auth`, `ui` (lint-enforced)       |

## 4. Backend abstraction strategy

All persistence, authentication, file storage, notifications, and audit logging go through
interfaces in [`packages/backend/src/interfaces/`](packages/backend/src/interfaces/):

| Interface              | Responsibility                                                    |
| ---------------------- | ----------------------------------------------------------------- |
| `AuthProvider`         | Identity: sign-up/in, magic links, OAuth (PKCE), MFA, sessions    |
| `DatabaseProvider`     | Typed CRUD, structured queries, transactions, real-time subscribe |
| `StorageProvider`      | Files (logos, photos) with public/private visibility, signed URLs |
| `NotificationProvider` | Email, SMS, push                                                  |
| `AuditLogProvider`     | Append-only security event log                                    |
| AI interfaces          | Skill extraction, embeddings, vector index, matching (future)     |

Application code obtains implementations from **one function**:

```ts
import { getBackend } from '@love/backend';

const { db, auth, storage, notifications, audit } = getBackend();
const event = await db.getById('events', eventId);
```

`getBackend()` reads validated configuration from `@love/config` and asks the **provider
registry** (`packages/backend/src/index.ts`) for the configured vendor's implementations. Vendor
folders (`providers/convex`, `providers/supabase`, `providers/firebase`) each export a
`BackendProviderModule`. Today every vendor method is a typed stub that throws
`ProviderNotImplementedError`, so the app can boot and type-check before any backend is chosen.

**Why this shape:**

- Interfaces speak the domain's language (`'events'`, `Volunteer`), not a vendor's (`ctx.db`,
  `supabase.from()`), so swapping vendors cannot ripple into features.
- Queries are structured objects with keys constrained to real model fields, so implementations
  can always translate them into parameterized calls (no query strings).
- Authorization lives **above** the provider (in `@love/auth`), so access rules don't have to be
  re-implemented per vendor.

Details: [docs/architecture/backend-abstraction.md](docs/architecture/backend-abstraction.md).

## 5. Provider replacement strategy

Switching providers is a configuration change:

```bash
BACKEND_PROVIDER=supabase   # was: convex — database + auth + storage all follow
```

Optional `AUTH_PROVIDER` / `STORAGE_PROVIDER` overrides allow a **phased migration** (e.g. move
the database first, auth later). Adding a brand-new vendor (PostgreSQL, AWS, Azure, ...) takes four
steps, none of which touch application code:

1. Add the name to `BACKEND_PROVIDERS` and a connection type in `@love/config`.
2. Create `packages/backend/src/providers/<name>/` implementing `BackendProviderModule`.
3. Register it in the registry in `packages/backend/src/index.ts`.
4. Run the shared provider contract tests against it, then flip the config value.

Data migration, dual-running, and rollback are covered in
[docs/architecture/provider-replacement.md](docs/architecture/provider-replacement.md).

## 6. Configuration

`@love/config` is the only package that reads `process.env` (lint-enforced). Every variable is
validated by a Zod schema at startup:

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

- **Authentication** (who are you?) is the `AuthProvider`'s job. The interface supports
  email/password, magic links, OAuth with PKCE, and TOTP MFA. It is stateless: the app layer owns
  cookies, using settings from `auth.config.ts`.
- **Authorization** (may you do this?) is `@love/auth`'s job, identical regardless of provider:
  - Roles: `volunteer`, `nonprofit`, `admin`, `superadmin`.
  - An explicit **permission matrix** with no implicit inheritance (deny by default).
  - **Organization memberships** (`OrganizationMembership`) let many users manage one nonprofit,
    each with a member role (`owner`/`manager`/`member`); `requireNonprofitAccess()` checks them.
  - Session policy: idle timeout, absolute timeout, mandatory MFA for admin roles.

No sign-in screens exist yet. When they are built, they call `AuthProvider` through server
actions and guard everything with `@love/auth`.

## 8. Notifications

One `NotificationProvider` interface; one provider **per channel**, chosen in config:

```
NOTIFICATION_EMAIL_PROVIDER=sendgrid   NOTIFICATION_SMS_PROVIDER=twilio   NOTIFICATION_PUSH_PROVIDER=expo
```

`CompositeNotificationProvider` routes each payload to its channel's provider, so features call
`notifications.send({ channel: 'email', ... })` without knowing the vendor. SMS and push are also
behind feature flags. The dev-only `console` provider masks recipients and omits message bodies.

## 9. Future AI integration points

Volunteers describe skills in their own words ("I teach kids math.", "I speak Spanish."). Future
AI will extract structured skills, embed them, and match them against event requirements. The
foundation is in place; **no AI is implemented**.

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

- **The web app is the primary platform and the API server.** Its route handlers and server
  actions are the only code that talks to the backend.
- **The mobile app is a client of the web app's API**, exactly like a browser. It never imports
  `@love/backend` or `@love/config` and never holds provider credentials (lint-enforced).
- Both share `@love/shared` (models), `@love/validation` (the same Zod schemas validate forms on
  both platforms and requests on the server) and `@love/api-contracts` (request/response types).
- React is pinned to the single version the current Expo SDK supports, so web and mobile share one
  React copy in the monorepo.
- The UI library (`@love/ui`) is web-only (DOM + Tailwind). Mobile will get its own components that
  follow the same design tokens.

Details: [docs/architecture/mobile-web.md](docs/architecture/mobile-web.md).

## 11. Accessibility

The target is **WCAG 2.2 AA**, with older-adult-specific defaults beyond AA: 18px base text, 44px+
targets, thick focus rings, high-contrast tokens, reduced-motion support, and plain language. See
[docs/architecture/accessibility.md](docs/architecture/accessibility.md).

## 12. Tooling and quality gates

| Concern     | Tool                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| Monorepo    | npm workspaces + Turborepo                                                        |
| Language    | TypeScript 6 (strict, `noUncheckedIndexedAccess`)                                 |
| Lint        | ESLint 9 flat config (root `eslint.config.mjs`), incl. architecture rules         |
| Format      | Prettier (+ Tailwind class sorting)                                               |
| Git hooks   | Husky: pre-commit → lint-staged; commit-msg → commitlint; pre-push → type-check   |
| Commits     | Conventional Commits (`commitlint.config.mjs`)                                    |
| CI          | `ci.yml`: format, lint, type-check, build (web + iOS/Android bundles), commitlint |
| Security CI | `security.yml`: CodeQL, TruffleHog, npm audit, dependency review; Dependabot      |

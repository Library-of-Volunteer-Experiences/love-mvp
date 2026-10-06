# 0002. Put every backend behind provider interfaces

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The county may start on Convex but must be able to move to Supabase, Firebase, PostgreSQL, AWS,
Azure, or a future provider for cost, policy, or procurement reasons — without rewriting features.

## Decision

- Define `AuthProvider`, `DatabaseProvider`, `StorageProvider`, `NotificationProvider`,
  `AuditLogProvider`, and AI interfaces in `@love/backend`.
- Vendor code lives only in `packages/backend/src/providers/<vendor>/`; ESLint blocks SDK imports
  everywhere else.
- A registry plus `getBackend()` selects implementations from `BACKEND_PROVIDER`, with optional
  per-concern overrides.
- Authorization stays above the provider layer, in `@love/auth`.

## Consequences

- Switching vendors is a config change plus a new provider folder; features don't change.
- App code cannot use vendor-specific conveniences directly (e.g. Convex reactive hooks in React
  components). Real-time needs go through `DatabaseProvider.subscribe`.
- Vendor strengths such as row-level security are used _inside_ providers as defense in depth, not
  relied on as the only control.

## Alternatives considered

- **Use one vendor's SDK directly** — fastest start, highest lock-in.
- **An ORM (Prisma/Drizzle)** — abstracts SQL databases only; doesn't cover Convex/Firebase, auth,
  storage, or notifications.

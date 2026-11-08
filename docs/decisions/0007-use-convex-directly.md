# 0007. Use Convex directly as the backend

- **Status:** Accepted
- **Date:** 2026-11-07
- **Supersedes:** [0002](0002-backend-provider-abstraction.md), [0003](0003-convex-initial-provider.md)

## Context

ADR 0002 put every backend behind provider interfaces in `@love/backend`, so the vendor could be
swapped by configuration. ADR 0003 proposed Convex as the first vendor.

In practice the abstraction:

- was never connected to a real database (every provider method throws "not implemented")
- blocks Convex's main strength: `useQuery` subscriptions that update the UI live
- adds a layer every new teammate has to learn before writing a single feature

The team is small and has a fixed timeline, and Convex is the chosen backend.

## Decision

- **Convex is the backend.** It provides the database, server functions, file storage, scheduling,
  and auth (Convex Auth).
- **Backend code lives in `apps/web/convex/`.** It contains:
  - `schema.ts` (all tables)
  - one file per area (`events.ts`, `signups.ts`, …) exporting `query`, `mutation`, and `action`
    functions
- **The web app calls Convex directly.** It uses `useQuery` / `useMutation` / `useAction` from
  `convex/react` with the generated `api` object.
- **Authorization happens inside every Convex function** that reads private data or changes
  anything:
  - get the caller on the server (`getAuthUserId(ctx)` / a `requireUser(ctx)` helper)
  - check ownership or membership
  - never trust a user ID passed in as an argument
- **Input validation uses Convex validators** (`args: { ... }` with `v.*` from `convex/values`) on
  every function. Zod (`@love/validation`) remains available for form validation in the browser.
- **The ESLint rule that banned Convex imports outside `packages/backend` is removed.** The rules
  blocking _other_ data-store SDKs (Supabase, Firebase, …) stay, so a second database isn't added by
  accident.
- **`packages/backend` and the RBAC matrix in `packages/auth` are legacy.** New code must not depend
  on them. They will be removed in a cleanup PR once nothing imports them.

## Consequences

**Good:**

- Live updates come for free.
- One place to look for backend code.
- Fully typed from the schema to the UI.

**Bad:**

- Switching away from Convex later means rewriting the functions in `apps/web/convex/`. That's an
  accepted risk at LOVE's scale.

**Security still holds:**

- Every Convex function is a public endpoint, so its own checks are the security boundary.
- PR reviews must check every new function for: an `args` validator, a caller check, and an
  ownership/membership check.

## Alternatives considered

- **Keep the abstraction and implement the Convex provider.** Rejected: it doubles the code and
  loses live queries.
- **Supabase or Firebase.** Rejected earlier, in favor of Convex.

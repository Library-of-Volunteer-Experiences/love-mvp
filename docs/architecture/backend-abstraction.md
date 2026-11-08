# Backend abstraction

> **Outdated (2026-11-07):** this describes the original provider-agnostic design, which was replaced by using Convex directly ([ADR 0007](../decisions/0007-use-convex-directly.md)). Kept for history; do not follow it for new code.

> Summary in [ARCHITECTURE.md §5](../../ARCHITECTURE.md#5-legacy-packages). This page
> covers the mechanics.

## Layers

```
┌───────────────────────────────────────────────────────────────┐
│ apps/web  — route handlers, server actions, server components │
│   1. parse input with @love/validation                        │
│   2. authorize with @love/auth                                │
│   3. call getBackend().<service>.<method>()                   │
└───────────────────────────────┬───────────────────────────────┘
                                │ interfaces only
┌───────────────────────────────▼───────────────────────────────┐
│ @love/backend                                                  │
│   interfaces/   AuthProvider, DatabaseProvider, ...            │
│   index.ts      registry + getBackend() (composition root)     │
│   providers/    convex/  supabase/  firebase/  console/        │  ← ONLY place SDKs are imported
└───────────────────────────────┬───────────────────────────────┘
                                │ vendor SDK
                       Convex / Supabase / Firebase / ...
```

## The request recipe

Every server-side feature follows the same three steps, in this order:

```ts
'use server';

import { getAuthConfig, requireNonprofitAccess } from '@love/auth';
import { getBackend } from '@love/backend';
import { createEventSchema } from '@love/validation';

export async function createEvent(raw: unknown) {
  const input = createEventSchema.parse(raw); // 1. validate
  const session = await getCurrentSession(); //    (reads the HttpOnly cookie → auth.verifySession)
  requireNonprofitAccess(session, input.nonprofitId, 'events:create_own', getAuthConfig()); // 2. authorize
  const { db, audit } = getBackend(); // 3. act through interfaces
  const event = await db.create('events', input);
  await audit.record({
    action: 'data.created',
    outcome: 'success',
    actorId: session!.userId,
    targetType: 'event',
    targetId: event.id,
  });
  return event;
}
```

(`getCurrentSession` will be written when authentication is implemented.)

## Interface design rules

1. **Domain language, not vendor language.** Collections are `'volunteers' | 'nonprofits' | ...`,
   documents are `@love/shared` models. Nothing mentions tables, documents, refs, or RPCs.
2. **Typed, structured queries.** `QueryFilter<T>.field` must be a key of the model. No query
   strings exist anywhere in the interface, so there is nothing to concatenate.
3. **Cursor pagination.** `cursor`/`nextCursor` maps cleanly onto every vendor; offset pagination
   does not scale on document databases.
4. **System fields are provider-owned.** `id`, `createdAt`, `updatedAt` are excluded from
   `CreateData`/`UpdateData`, so callers can't forge them.
5. **Stateless auth.** `AuthProvider` methods take the session token explicitly; cookies are the
   app's concern. The same provider works for web (cookie) and mobile (bearer token).
6. **Vendor errors never escape.** Implementations map failures to `BackendError` subclasses in
   `errors.ts`.
7. **Capabilities are explicit.** If a vendor can't do something (e.g. real-time `subscribe`), it
   throws `ProviderCapabilityError` rather than silently degrading.

## Composition root

`packages/backend/src/index.ts` is the only file that knows every vendor:

```ts
const backendRegistry = {
  convex: convexProviders,
  supabase: supabaseProviders,
  firebase: firebaseProviders,
};
```

`getBackend()` builds services once per process from validated config. Tests call
`setBackendForTesting(fakes)` to inject in-memory implementations.

## Stubs

Until a vendor is implemented, its module returns `notImplemented<Interface>('Name')` — a typed
proxy whose every method throws `ProviderNotImplementedError`. This keeps all three vendors
selectable and type-checked from day one, and fails loudly the moment a feature depends on missing
code.

## Server-only

`@love/backend` must only run on the server. It is imported from route handlers, server actions,
and server components — never from `'use client'` files and never from `apps/mobile` (the latter is
lint-enforced).

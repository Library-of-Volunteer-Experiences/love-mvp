# Provider replacement

LOVE may start on Convex and later move to Supabase, Firebase, plain PostgreSQL, AWS, Azure, or
something that doesn't exist yet. This page is the playbook.

## Switching between implemented providers

One value:

```bash
BACKEND_PROVIDER=supabase
```

Database, auth, and storage all follow. For a phased migration, override a single concern:

```bash
BACKEND_PROVIDER=supabase   # database + storage on Supabase
AUTH_PROVIDER=convex        # auth stays on Convex until users are migrated
```

Notification channels switch independently (`NOTIFICATION_EMAIL_PROVIDER`, etc.).

## Adding a new provider (example: `postgres`)

1. **Config** (`packages/config/src/`)
   - Add `'postgres'` to `BACKEND_PROVIDERS` in `env.ts`, plus its env vars (e.g. `DATABASE_URL`)
     and a production `superRefine` requirement.
   - Add a `PostgresConnection` to `ProviderConnection` and a `case` in `getProviderConnection()`.
     TypeScript's exhaustiveness checks will point at every place that needs updating.
2. **Implementation** (`packages/backend/src/providers/postgres/`)
   - Install the driver in `@love/backend` only.
   - Export `postgresProviders: BackendProviderModule<'postgres'>`. Unimplemented pieces can return
     `notImplemented(...)` while you work.
   - Use parameterized queries exclusively. Map `QueryFilter` operators to SQL with placeholders;
     validate `field` against an allowlist of columns.
3. **Registry**: add `postgres: postgresProviders` to `backendRegistry` in
   `packages/backend/src/index.ts`. (The registry's mapped type makes omitting it a compile error.)
4. **Contract tests**: run the shared provider test suite (to be added under
   `packages/backend/test/contract/` with the first real implementation) against the new provider.
   Every provider must pass the same suite.
5. **ADR**: record the decision and any behavioral differences in `docs/decisions/`.

No file in `apps/` changes.

## Migrating data

1. **Freeze the schema.** Models in `@love/shared` are the contract; both providers store the same
   shapes.
2. **Export → transform → import** using a one-off script in `packages/backend/scripts/` that reads
   through the old provider's `DatabaseProvider` and writes through the new one. Using the
   interfaces on both sides means the script is vendor-neutral.
3. **Preserve IDs** where possible; otherwise keep an old→new ID map for references
   (`volunteerId`, `eventId`, `nonprofitId`).
4. **Users and credentials:** password hashes may not be portable. Options: vendor hash import, or
   lazy migration (verify against the old provider on next sign-in, then re-hash), or forced reset
   via magic link. Decide in an ADR.
5. **Files:** copy objects between `StorageProvider`s; update stored URLs.
6. **Cut over** by changing config; keep the old provider read-only for rollback.
7. **Verify** counts and spot-check records; then decommission the old provider and rotate any
   credentials that were shared.

## Rules

- Never "temporarily" import a vendor SDK outside `providers/` to speed up a migration.
- Never let a vendor-specific type appear in an interface signature.
- If a vendor genuinely can't satisfy an interface method, throw `ProviderCapabilityError` and
  document it — don't change the interface for one vendor without an ADR.

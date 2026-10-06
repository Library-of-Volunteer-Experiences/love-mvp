# Convex provider

Convex is the planned initial backend. Every method is currently a stub that throws
`ProviderNotImplementedError` (see `../shared/notImplemented.ts`), so the app can boot and
type-check before any backend is connected.

## Implementation checklist (applies to every provider folder)

1. Install the SDK **in `packages/backend` only**: `npm install convex -w @love/backend`.
2. Create `ConvexDatabaseProvider.ts`, `ConvexAuthProvider.ts`, and `ConvexStorageProvider.ts`
   implementing the interfaces in `../../interfaces/`. Return the
   implementations from `index.ts` instead of `notImplemented(...)`.
3. Translate `QueryFilter` objects into SDK query builders — **never** build query strings.
   Reject filter fields that are not in the model at runtime.
4. Map every vendor error to a type in `../../errors.ts`. Never let vendor error objects, raw
   responses, or tokens escape this folder.
5. Read connection settings only from the `ConnectionFor<'convex'>` argument (which comes from
   `@love/config`). Never read `process.env` here.
6. Server functions / schema files that Convex requires (`convex/` directory) live inside this
   folder or a sibling `packages/backend/convex/` directory — never in `apps/*`.
7. Add contract tests that run the shared provider test suite against this implementation
   (see `docs/architecture/provider-replacement.md`).
8. Record the decision in `docs/decisions/` if behavior differs from the interface docs.

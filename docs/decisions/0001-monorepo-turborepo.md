# 0001. Use a monorepo with npm workspaces and Turborepo

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

LOVE has a web app, a mobile app, and code both must share (models, validation, API contracts).
Separate repositories would let those copies drift. The project will be maintained over many years,
possibly by rotating volunteers or contractors.

## Decision

One repository. npm workspaces link packages (`apps/*`, `packages/*`); Turborepo orchestrates and
caches tasks. Workspace packages ship TypeScript source and are compiled by the consuming app (no
per-package build step).

## Consequences

- One PR can change a schema and both apps atomically; type errors surface everywhere at once.
- npm is the most widely known package manager; nothing extra to install.
- Turborepo caches lint/type-check/build, keeping CI fast as the repo grows.
- All apps must agree on shared dependency versions (see ADR 0006).

## Alternatives considered

- **pnpm workspaces** — stricter and faster, but Expo + pnpm historically needed extra config
  (`node-linker=hoisted`). npm is simpler for newcomers.
- **Nx** — more powerful, with more concepts to learn; unnecessary at this size.

# Instructions for AI coding agents

You are working on **LOVE**, a volunteer-matching platform for Fannin County, Georgia. Users
include many older adults; the data includes residents' personal information.

## Before you change anything

1. Read **[SECURITY.md](SECURITY.md)** — its rules are mandatory, and §10 is written for you.
2. Skim **[ARCHITECTURE.md](ARCHITECTURE.md)** — especially the backend section (§4).
3. For UI work, read **[docs/architecture/accessibility.md](docs/architecture/accessibility.md)**.
4. For backend work, read **`apps/web/convex/_generated/ai/guidelines.md`** (Convex rules for the
   installed version) and **[docs/product/plan.md](docs/product/plan.md)** §4.
5. For what to build, read **[docs/product/](docs/product/)** (requirements, pages, user flows).

## Hard rules

- **The backend is Convex, used directly** ([ADR 0007](docs/decisions/0007-use-convex-directly.md)).
  Backend code lives in `apps/web/convex/`; pages call it with `useQuery` / `useMutation` /
  `useAction` from `convex/react` and the generated `api` object.
- **Do not use `@love/backend` / `getBackend()` or the RBAC matrix in `packages/auth`.** They are
  legacy and will be removed.
- **Every Convex function:** has an `args` validator (`v.*` from `convex/values`); gets the caller on
  the server (never from an argument); and checks ownership/membership before reading private data
  or changing anything. Functions only the backend calls are `internal*`.
- Do not add another data store or its SDK (Supabase, Firebase, Prisma, …).
- `process.env` only inside `packages/config` (Convex functions read deployment env vars as Convex
  documents describe).
- `apps/mobile` must not import `@love/backend`, `@love/config`, or `@love/auth`.
- Never add `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, or `any` to get past a check.
- Never weaken CSP, security headers, `apps/web/src/proxy.ts`, rate limits, or lint rules.
- Never log passwords, tokens, secrets, or PII.
- Never commit secrets or realistic personal data (use obviously fake fixtures).
- Do not build application features unless the task asks for them.

## Commands

```bash
npm run lint          # must pass
npm run type-check    # must pass (on Windows, `npx turbo run type-check --concurrency=1`)
npm run build         # web build + mobile bundles
npm run verify        # all of the above + format check
```

## When you finish

Report:

1. What you changed and why.
2. The SECURITY.md §10 checklist with each item confirmed (or explained).
3. Which verification commands you ran and their results. If you could not run something, say so.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

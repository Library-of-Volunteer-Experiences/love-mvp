# Contributing to LOVE

Thank you for helping Fannin County residents find meaningful ways to volunteer. This guide covers
how to set up, make changes, and get them merged.

**Read [SECURITY.md](SECURITY.md) first.** Its rules are mandatory for every contribution.

## Setup

Follow **Getting started** in the [README](README.md#getting-started) (Node, `npm install`, your own
Convex dev deployment, running the app).

Windows contributors: the repo enforces LF line endings (`.gitattributes`). If you cloned before
that file existed, run `git add --renormalize .`.

## Workflow

1. **Pick an issue** from the GitHub Project's **Ready** column and assign yourself.
2. **Branch** from the latest `main`:
   `git switch main && git pull && git switch -c feat/<short-name>` (or `fix/…`, `docs/…`).
3. **Make focused changes.** One issue per PR. Link it in the PR (`Closes #12`).
4. **Verify locally:** `npm run lint`, `npx turbo run type-check --concurrency=1`, `npm run build:web`.
5. **Commit** with a short message that says what changed (no enforced format). Don't commit
   practice/scratch files.
6. **Open a PR** and complete the template's security and accessibility checklists.
7. **CI must pass**: format, lint, type check, build, secret scan, dependency audit.
8. **Review:** get a teammate to look at it. Changes to `apps/web/convex/schema.ts`,
   `packages/config`, or `apps/web/src/proxy.ts` need a second look from a lead.

## Git hooks

| Hook         | Runs                                                     |
| ------------ | -------------------------------------------------------- |
| `pre-commit` | `lint-staged`: ESLint `--fix` + Prettier on staged files |

Do not bypass hooks with `--no-verify`.

## Where code goes

| You're adding…                                      | Put it in                                                                         |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| A page                                              | `apps/web/src/app/…` (`page.tsx`; add `'use client'` if it uses hooks)            |
| A feature-specific web component                    | `apps/web/src/components/<feature>/…`                                             |
| A generic UI primitive (shadcn)                     | `apps/web/src/components/ui` — run `npx shadcn@latest add <name>` from `apps/web` |
| A temporary demo of a component                     | `apps/web/src/app/playground/<name>/page.tsx` (deleted before launch)             |
| A table or index                                    | `apps/web/convex/schema.ts`                                                       |
| A backend function (query / mutation / action)      | `apps/web/convex/<area>.ts`, e.g. `events.ts`, `signups.ts`                       |
| A shared backend helper (auth check, distance math) | `apps/web/convex/lib/…`                                                           |
| A mobile screen                                     | `apps/mobile/app/…`                                                               |
| A shared type / constant (tag lists, etc.)          | `packages/shared` (and update `docs/security/data-classification.md`)             |
| Browser-side form validation                        | `packages/validation` (Zod)                                                       |
| An env var or feature flag                          | `packages/config` (+ `.env.example`)                                              |

## Rules of thumb

- **Every Convex function checks its inputs and its caller.** `args` validators on every function;
  get the user on the server, then check ownership/membership before reading private data or
  changing anything. See [ADR 0007](docs/decisions/0007-use-convex-directly.md) and
  `docs/product/plan.md` §4.
- **Don't use the legacy `@love/backend` / `getBackend()` layer**, and don't add another database
  SDK. Lint blocks the common ones.
- **Never read `process.env` outside `packages/config`** (Convex functions excepted). Lint will stop
  you.
- **Accessibility is part of "done."** Follow
  [docs/architecture/accessibility.md](docs/architecture/accessibility.md): 44px targets, labels on
  every field, keyboard-only test.
- **Write an ADR** (`docs/decisions/`) for decisions a future maintainer would question.
- **Install dependencies narrowly:** `npm install <pkg> -w @love/web`. See
  [docs/security/dependency-policy.md](docs/security/dependency-policy.md).

## Upgrading Expo / React

React is pinned to the version the Expo SDK requires (ADR 0006). Upgrade Expo first in
`apps/mobile` with `npx expo install expo@^<sdk> --fix`, then align `react`/`react-dom` in
`apps/web` and the root `overrides`.

## Using AI coding assistants

AI tools are welcome, but you are responsible for what they produce. Point them at
[AGENTS.md](AGENTS.md), and check their work against the AI checklist in
[SECURITY.md §10](SECURITY.md#10-rules-for-ai-coding-agents).

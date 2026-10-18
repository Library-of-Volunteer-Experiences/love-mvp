# Contributing to LOVE

Thank you for helping Fannin County residents find meaningful ways to volunteer. This guide covers
how to set up, make changes, and get them merged.

**Read [SECURITY.md](SECURITY.md) first.** Its rules are mandatory for every contribution.

## Setup

```bash
nvm use                      # Node version from .nvmrc (or install Node 22+)
npm install                  # installs dependencies and Husky Git hooks
npm run dev:web              # http://localhost:3000
```

Windows contributors: the repo enforces LF line endings (`.gitattributes`). If you cloned before
that file existed, run `git add --renormalize .`.

## Workflow

1. **Branch** from `main`: `feat/volunteer-signup`, `fix/event-timezone`, `docs/adr-0007`.
2. **Make focused changes.** One concern per PR.
3. **Verify locally:** `npm run verify` (format, lint, type-check, build).
4. **Commit** with a short message that says what changed (no enforced format).
5. **Open a PR** and complete the template's security and accessibility checklists.
6. **CI must pass**: format, lint, type check, build, secret scan, dependency audit.
7. **Review:** one approval required; two for security-sensitive files (`packages/auth`,
   `packages/config/src/{auth,security}.config.ts`, `apps/web/src/proxy.ts`, provider
   implementations).

## Git hooks

| Hook         | Runs                                                     |
| ------------ | -------------------------------------------------------- |
| `pre-commit` | `lint-staged`: ESLint `--fix` + Prettier on staged files |

Do not bypass hooks with `--no-verify`.

## Where code goes

| You're adding…                                               | Put it in                                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| A page, route handler, or server action                      | `apps/web/src/app/…`                                                              |
| A feature-specific web component                             | `apps/web/src/components/…`                                                       |
| A generic UI primitive (shadcn)                              | `apps/web/src/components/ui` — run `npx shadcn@latest add <name>` from `apps/web` |
| A mobile screen                                              | `apps/mobile/app/…`                                                               |
| A model / shared type / constant                             | `packages/shared` (and update `docs/security/data-classification.md`)             |
| Input validation                                             | `packages/validation`                                                             |
| A request/response type                                      | `packages/api-contracts`                                                          |
| An env var, provider setting, or feature flag                | `packages/config` (+ `.env.example`)                                              |
| A permission or access rule                                  | `packages/auth`                                                                   |
| Anything that talks to Convex/Supabase/Firebase/email/SMS/AI | `packages/backend/src/providers/<vendor>/`                                        |

## Rules of thumb

- **Validate → authorize → act.** Every server entry point parses input with Zod, checks
  permissions with `@love/auth`, then calls `getBackend()`.
- **Never import a vendor SDK outside `packages/backend/src/providers/`.** Lint will stop you.
- **Never read `process.env` outside `packages/config`.** Lint will stop you.
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

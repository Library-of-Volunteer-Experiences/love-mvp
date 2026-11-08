# LOVE — Library of Volunteer Experiences

**LOVE** is a platform for **Fannin County, Georgia**. It connects volunteers with verified
nonprofits by matching volunteers' interests, skills, and availability with volunteer
opportunities.

LOVE is designed to be:

- **simple and accessible for older adults**
- **secure** with residents' personal information

> **Project status:** MVP in progress.
>
> - **Built:** the landing page, signed-in homepage, onboarding UI, and Convex connected.
> - **In progress:** data, accounts, and the remaining pages.
>
> What we're building and in what order: [docs/product/](docs/product/), especially
> [plan.md](docs/product/plan.md).

## Getting started

### 1. What you need

- **Node.js 22+**: 24 LTS recommended; see `.nvmrc`. Check with `node -v`.
- **npm 10+**
- **Git**
- **Access to:**
  - the GitHub repo
  - the team's **GitHub Project** (that's where issues are picked)
  - the team's **Convex project**: ask a lead to invite your email. You'll sign in to Convex with
    GitHub.

### 2. Clone and install

```bash
git clone https://github.com/Library-of-Volunteer-Experiences/love-mvp.git
cd love-mvp
npm install          # also installs the Git pre-commit hook
```

Windows tip: clone **outside OneDrive** if you can (e.g. `C:\Users\<you>\code\`). OneDrive syncing
`node_modules` makes everything slow.

### 3. Start your own Convex backend (first time only)

```bash
cd apps/web
npx convex dev
```

- When asked, **log in** (not "run locally"), then pick the **existing** LOVE project. Don't create
  a new one.
- This gives you **your own development deployment**, with its own empty database, and writes
  `apps/web/.env.local` with its URL.
- That file is git-ignored. Never commit it, and never put secrets in a `NEXT_PUBLIC_` variable.
- **Leave this terminal running** while you work. Every time you save a file in `apps/web/convex/`,
  it uploads your backend functions and regenerates `apps/web/convex/_generated/`.

### 4. Run the website

In a **second** terminal, from the repo root:

```bash
npm run dev:web      # http://localhost:3000
```

Pages to check:

- `/`: landing page
- `/homepage`: signed-in feed
- `/onboarding`: onboarding

### 5. Fill your database with test data (once the seed script exists)

```bash
cd apps/web
npx convex run seed:run
```

### Every time you start new work

```bash
git switch main
git pull
npm install                      # in case packages changed
git switch -c feat/<short-name>  # one branch per issue
```

Then keep `npx convex dev` (in `apps/web`) and `npm run dev:web` running. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full PR workflow.

## Scripts

Run from the repository root:

| Command                                    | What it does                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `npm run dev:web`                          | Start only the web app                                                             |
| `npm run dev:mobile`                       | Start only the Expo dev server                                                     |
| `npm run dev`                              | Start web and mobile dev servers                                                   |
| `npm run build:web`                        | Production build of the web app                                                    |
| `npm run lint`                             | ESLint across all workspaces (includes architecture/security rules)                |
| `npx turbo run type-check --concurrency=1` | TypeScript across all workspaces (one at a time; avoids memory crashes on Windows) |
| `npm run format`                           | Format everything with Prettier                                                    |
| `npm run verify`                           | Format check + lint + type-check + build                                           |
| `npm run clean`                            | Remove build outputs and caches                                                    |

`npx convex dashboard` (from `apps/web`) opens your Convex dashboard: data, functions, and logs.

## Tech stack

| Area     | Choice                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Web      | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Lucide, React Hook Form, Zod                               |
| Backend  | **Convex**: database, server functions, file storage, auth (Convex Auth). See [ADR 0007](docs/decisions/0007-use-convex-directly.md) |
| Mobile   | Expo SDK 57, React Native, Expo Router, TypeScript (later)                                                                           |
| Monorepo | npm workspaces + Turborepo                                                                                                           |
| Quality  | ESLint, Prettier, Husky, lint-staged, GitHub Actions (CI + secret scan + audit)                                                      |

## Repository layout

```
apps/web/convex          BACKEND: schema.ts + query/mutation/action files (runs on Convex)
apps/web/src/app         Pages (Next.js App Router)
apps/web/src/components  Web UI components (ui/ = shadcn building blocks, others by feature)
apps/mobile              Expo mobile app (later)
packages/shared          Shared constants (tag lists, …) and types
packages/validation      Zod schemas for forms
packages/config          Validated env config, security headers/CSP, feature flags
packages/auth            LEGACY — do not use in new code (ADR 0007)
packages/backend         LEGACY — do not use in new code (ADR 0007)
docs/product             What we're building: requirements, pages, user flows, plan
docs/                    Architecture notes, decisions (ADRs), security docs
```

## Documentation

| Document                           | Read it when…                                           |
| ---------------------------------- | ------------------------------------------------------- |
| [docs/product/](docs/product/)     | You want to know **what** to build and how pages behave |
| [CONTRIBUTING.md](CONTRIBUTING.md) | You're about to start an issue or open a pull request   |
| [SECURITY.md](SECURITY.md)         | **Before writing any code**: the rules are mandatory    |
| [ARCHITECTURE.md](ARCHITECTURE.md) | You want to understand how everything fits              |
| [AGENTS.md](AGENTS.md)             | You (or your AI coding tool) need the hard rules        |
| [docs/decisions/](docs/decisions/) | You want to know _why_ something is the way it is       |
| [docs/security/](docs/security/)   | Data classification, dependency policy, threat model    |

## Security

Please report vulnerabilities privately; see [SECURITY.md](SECURITY.md#reporting-a-vulnerability).
Never commit secrets or real residents' data.

## License

Proprietary (`UNLICENSED` in `package.json`). Ownership and licensing terms are to be confirmed with
Fannin County.

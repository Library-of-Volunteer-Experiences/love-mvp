# LOVE — Library of Volunteer Experiences

The official repository for **LOVE**, a platform for **Fannin County, Georgia** that connects
volunteers with nonprofit organizations by matching volunteers' skills, availability, and
preferences with volunteer opportunities.

LOVE is designed to be **simple and accessible for older adults**, **secure** with residents' personal
information, and **independent of any single backend vendor**.

> **Project status:** foundation only. The repository architecture, tooling, security standards,
> and abstractions are in place. Application features (registration, dashboards, matching) have
> **not** been built yet. The web and mobile apps show placeholder screens.

## Quick start

**Prerequisites:** Node.js 22+ (24 LTS recommended — see `.nvmrc`), npm 10+.

```bash
git clone https://github.com/KirillMcQ/love-app.git
cd love-app
npm install                                   # also installs Git hooks
cp .env.example apps/web/.env.local           # optional — sensible dev defaults exist

npm run dev:web                               # http://localhost:3000
npm run dev:mobile                            # Expo: press i (iOS), a (Android), or scan the QR code with Expo Go
```

You should see:

- **Web:** "LOVE — Library of Volunteer Experiences — Repository Successfully Initialized"
- **Mobile:** "LOVE Mobile — Repository Successfully Initialized"

## Scripts

Run from the repository root:

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run dev`        | Start web and mobile dev servers                                    |
| `npm run dev:web`    | Start only the web app                                              |
| `npm run dev:mobile` | Start only the Expo dev server                                      |
| `npm run build`      | Production build of web + iOS/Android JS bundles                    |
| `npm run lint`       | ESLint across all workspaces (includes architecture/security rules) |
| `npm run type-check` | TypeScript across all workspaces                                    |
| `npm run format`     | Format everything with Prettier                                     |
| `npm run verify`     | Format check + lint + type-check + build (what CI runs)             |
| `npm run clean`      | Remove build outputs and caches                                     |

## Tech stack

| Area     | Choice                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Web      | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Lucide, TanStack Query, React Hook Form, Zod |
| Mobile   | Expo SDK 57, React Native, Expo Router, TypeScript                                                                     |
| Monorepo | npm workspaces + Turborepo                                                                                             |
| Backend  | Provider-agnostic interfaces; Convex planned first, Supabase/Firebase/others swappable by config                       |
| Quality  | ESLint, Prettier, Husky, lint-staged, Commitlint, GitHub Actions (CI + CodeQL + secret scan + audit)                   |

## Repository layout

```
apps/web          Next.js web app (primary platform; also hosts the API)
apps/mobile       Expo mobile app (secondary platform)
packages/shared         Domain models and constants
packages/validation     Zod schemas for all input
packages/api-contracts  API request/response types (web + mobile)
packages/config         Validated env + provider configuration + feature flags
packages/auth           RBAC, session policy, CSRF helpers
packages/backend        Provider interfaces + implementations (Convex, Supabase, Firebase)
packages/ui             shadcn/ui component library
docs/                   Architecture deep dives, ADRs, security docs
```

## Documentation

| Document                                 | Read it when…                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)       | You want to understand how everything fits                                        |
| [SECURITY.md](SECURITY.md)               | **Before writing any code** — the rules are mandatory                             |
| [CONTRIBUTING.md](CONTRIBUTING.md)       | You're about to open a pull request                                               |
| [AGENTS.md](AGENTS.md)                   | You're an AI coding agent                                                         |
| [docs/architecture/](docs/architecture/) | Backend abstraction, provider replacement, AI matching, mobile/web, accessibility |
| [docs/decisions/](docs/decisions/)       | You want to know _why_ something is the way it is                                 |
| [docs/security/](docs/security/)         | Data classification, dependency policy, threat model                              |

## Switching backend providers

```bash
BACKEND_PROVIDER=convex     # or supabase | firebase
```

That single value selects the database, auth, and storage implementations. See
[docs/architecture/provider-replacement.md](docs/architecture/provider-replacement.md).

## Security

Please report vulnerabilities privately — see [SECURITY.md](SECURITY.md#reporting-a-vulnerability).
Never commit secrets or real residents' data.

## License

Proprietary (`UNLICENSED` in `package.json`). Ownership and licensing terms are to be confirmed with
Fannin County.

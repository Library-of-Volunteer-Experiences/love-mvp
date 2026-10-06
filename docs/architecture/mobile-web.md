# Mobile and web relationship

## Roles

|                            | Web (`apps/web`)                           | Mobile (`apps/mobile`)                                   |
| -------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| Priority                   | Primary platform                           | Secondary platform                                       |
| Framework                  | Next.js 16 App Router                      | Expo SDK 57 + Expo Router                                |
| Talks to backend           | Directly, server-side, via `@love/backend` | **Never** — calls the web app's HTTP API                 |
| Holds provider credentials | Server env only                            | Never                                                    |
| UI components              | `@love/ui` (shadcn/ui, Tailwind)           | Own React Native components (future), same design tokens |
| Session storage            | HttpOnly cookie                            | `expo-secure-store` bearer token (future)                |

## What is shared

```
@love/shared         models + constants        (web, mobile, server)
@love/validation     Zod schemas               (web forms, mobile forms, server request parsing)
@love/api-contracts  request/response types    (web client, mobile client, server handlers)
```

Because the mobile app validates a form with the **same** Zod schema the server will use, and
types its fetch calls with the **same** contract types the route handler returns, the platforms
cannot drift apart silently — a breaking change fails type-check in both apps.

## What is not shared (and why)

- `@love/backend`, `@love/config`, `@love/auth`: server-only. Shipping them in a mobile binary
  would expose configuration and invite direct database access. Lint blocks these imports in
  `apps/mobile`.
- `@love/ui`: depends on the DOM and Tailwind. React Native needs native primitives.

## Future mobile API

1. Web exposes versioned route handlers (e.g. `apps/web/src/app/api/v1/...`) gated by the
   `mobileApi` feature flag.
2. Each handler: parse with `@love/validation` → authorize with `@love/auth` → call `getBackend()`
   → return an `ApiResponse<T>` from `@love/api-contracts`.
3. Mobile authenticates with a bearer token in the `Authorization` header (no cookies, so CSRF does
   not apply to those routes), stored in `expo-secure-store`.
4. Mobile reads its API base URL from `EXPO_PUBLIC_API_URL`. `EXPO_PUBLIC_*` values are bundled into
   the app binary — never put secrets there.
5. Clients send `X-API-Version: API_VERSION`; breaking changes bump the version and keep the old one
   until store updates propagate.

## Dependency alignment

- React is pinned workspace-wide (root `overrides`) to the version required by the current Expo
  SDK. Next.js accepts any React 19, so both apps share one copy — avoiding the "invalid hook call"
  class of bugs that duplicate React causes in monorepos.
- Upgrade Expo with `npx expo install expo@^<sdk> --fix` inside `apps/mobile`, then update the root
  `overrides` and `apps/web` React versions to match.
- Expo SDK 52+ configures Metro for monorepos automatically; no custom `metro.config.js` is needed.

## Placeholder state

Mobile currently renders one screen ("LOVE Mobile — Repository Successfully Initialized") that
imports from `@love/shared`, proving workspace resolution works on device. `npm run build:mobile`
(`expo export`) bundles iOS and Android JavaScript in CI.

The bundle identifiers in `app.json` (`gov.fannincountyga.love`) are placeholders — confirm with the
county before the first store submission; they cannot be changed afterwards.

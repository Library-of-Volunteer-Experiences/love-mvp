# LOVE Security Standards

**Status: MANDATORY.** These rules apply to every change in this repository — whether written by a
person or by an AI coding agent. A change that violates a rule below must not be merged, regardless
of urgency.

LOVE stores personal information about Fannin County residents (names, contact details, dates of
birth, home addresses, availability). Many users are older adults. Treat every piece of their data
as something you would want protected if it were your own family's.

- [Reporting a vulnerability](#reporting-a-vulnerability)
- [1. General principles](#1-general-principles)
- [2. Authentication](#2-authentication)
- [3. Authorization](#3-authorization)
- [4. API and input handling](#4-api-and-input-handling)
- [5. Data protection](#5-data-protection)
- [6. Frontend](#6-frontend)
- [7. Backend](#7-backend)
- [8. Logging](#8-logging)
- [9. Dependencies and supply chain](#9-dependencies-and-supply-chain)
- [10. Rules for AI coding agents](#10-rules-for-ai-coding-agents)
- [11. How these rules are enforced](#11-how-these-rules-are-enforced)

---

## Reporting a vulnerability

**Do not open a public GitHub issue for security problems.**

Report privately through GitHub's **Security → Report a vulnerability** (private advisory) on this
repository, or contact the repository maintainers directly. Include the affected area, steps to
reproduce, and the impact you expect. We aim to acknowledge reports within 3 business days.

Never test against production data or real residents' accounts.

---

## 1. General principles

| Rule                  | What it means here                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Deny by default**   | Access is refused unless a rule explicitly grants it. Roles have only the permissions listed in `packages/auth/src/permissions.ts` — no inheritance. |
| **Least privilege**   | Users, service accounts, API keys, and CI jobs get the minimum access they need. Use read-only credentials where possible.                           |
| **Secure by default** | New feature flags default to `false`. New config defaults to the safer option. Dev-only providers are rejected in staging/production.                |
| **Defense in depth**  | Never rely on one control. Example: SameSite cookies **and** origin checks for CSRF; client validation **and** server validation.                    |
| **Fail closed**       | On error, missing data, or ambiguity, deny access. Never fall back to "allow".                                                                       |

## 2. Authentication

- **MFA support is required.** The `AuthProvider` interface includes TOTP enrollment and challenge
  methods. MFA is **mandatory for `admin` and `superadmin`** (`auth.config.ts → mfa.requiredForRoles`).
- **Session timeouts:** 30-minute idle timeout and 12-hour absolute timeout
  (`auth.config.ts → session`). Every request re-checks them with `getSessionStatus()`.
- **Cookies** that hold session tokens are always:
  - `HttpOnly` (unreadable by JavaScript),
  - `Secure` in staging/production (with the `__Host-` prefix),
  - `SameSite=Lax` or stricter,
  - `Path=/` with no `Domain` attribute.
- **CSRF protection:** SameSite cookies, plus:
  - Server Actions: Next.js built-in Origin/Host verification (do not disable).
  - State-changing route handlers: must call `isTrustedOrigin()` from `@love/auth`.
  - OAuth: random `state` + PKCE, compared with `timingSafeEqual()`.
- **Passwords:** minimum 12 characters (NIST SP 800-63B). Never stored or logged in plaintext —
  hashing is the auth provider's responsibility and must use a modern adaptive algorithm
  (Argon2id, scrypt, or bcrypt).
- **Account lockout / throttling** after 5 failed attempts (`auth.config.ts → lockout`).
- **No account enumeration:** sign-in, sign-up, and password-reset responses must not reveal whether
  an email is registered.
- Magic links and reset tokens are single-use and short-lived (`auth.config.ts → tokenTtlSeconds`).
- Mobile stores session tokens in the OS secure store (`expo-secure-store`), never in AsyncStorage.

## 3. Authorization

- **Every secure endpoint and server action performs an authorization check** using
  `authorize()`, `requirePermission()`, `requireNonprofitAccess()`, or `requireSelf()` from
  `@love/auth` — **before** calling the backend.
- The `proxy.ts` (middleware) layer is **never** the only authorization check.
- `*_own` permissions additionally verify ownership (`requireSelf`) or organization membership
  (`requireNonprofitAccess`). Nonprofit users can only act on nonprofits they belong to.
- Roles are assigned server-side only. Self-service sign-up can create `volunteer` or `nonprofit`
  accounts — never `admin` or `superadmin` (enforced in `signUpSchema`).
- Changes to `permissions.ts`, `guards.ts`, `session.ts`, or `auth.config.ts` require review by a
  second maintainer.

## 4. API and input handling

- **Validate all input with Zod.** Every request body, query string, route param, form submission,
  webhook payload, and environment variable is parsed with a schema from `@love/validation` (or
  `@love/config` for env). Use `schema.parse()`/`safeParse()` — never cast with `as`.
- Schemas are `.strict()` (unknown keys rejected) and every string has a `.max()`.
- Never accept `id`, `createdAt`, `updatedAt`, `role`, or ownership fields from the client unless
  the endpoint is specifically for changing them and is authorized for it.
- **Rate limiting** applies to every endpoint; stricter limits for auth and password reset
  (`security.config.ts → rateLimits`).
- **Request size limits** (`security.config.ts → requestSizeLimits`): 100 KB JSON, 1 MB server
  actions, 5 MB uploads. Uploads are also checked against `allowedUploadTypes`.
- **Audit logging:** sign-ins, failures, role changes, MFA changes, permission denials, deletions,
  and data exports are recorded through `AuditLogProvider`.
- Errors returned to clients use the `ApiError` shape from `@love/api-contracts`: a safe message and
  a request ID — **never** stack traces, SQL, provider errors, or internal identifiers.

## 5. Data protection

- **Encrypt sensitive data at rest.** Use provider-level encryption at minimum. Fields classified
  as _Restricted_ in [docs/security/data-classification.md](docs/security/data-classification.md)
  (e.g. date of birth, MFA secrets) must be encrypted at field level or stored by a provider that
  guarantees encryption at rest with managed keys.
- **Encrypt all traffic in transit.** HTTPS only (HSTS is set with a 2-year max-age). Provider
  connections must use TLS. No plain HTTP endpoints in staging/production.
- **No secrets in source control.** Not in code, comments, tests, fixtures, screenshots, or docs.
  `.env*` files are git-ignored; only `.env.example` (with empty values) is committed. CI scans every
  push for secrets.
- **Environment variables only** for secrets, read exclusively through `@love/config`. Never put a
  secret in a `NEXT_PUBLIC_*` or `EXPO_PUBLIC_*` variable — those are shipped to every browser and
  phone.
- Collect only the data a feature needs (data minimization). Support deleting a user's data on
  request.
- Use synthetic data in development and tests. Never copy production data to a laptop.

## 6. Frontend

- **Prevent XSS:** rely on React's automatic escaping. `dangerouslySetInnerHTML` is banned by lint
  (`react/no-danger`). If rich text is ever required, it must be sanitized server-side with an
  allowlist sanitizer and reviewed.
- **Escape all user content**, including in emails (`EmailNotification.htmlBody` must be rendered
  from templates that escape interpolated values) and in `href`s (`httpUrlSchema` rejects
  `javascript:` and `data:` URLs).
- **Prevent CSRF:** see section 2.
- **Strict Content Security Policy:** a per-request nonce CSP with `'strict-dynamic'` is set in
  `apps/web/src/proxy.ts` (built by `buildContentSecurityPolicy()`). No `'unsafe-inline'` or
  `'unsafe-eval'` for scripts in production. Adding an origin to the CSP requires review.
- Security headers (HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, COOP) are set in `next.config.ts` from `securityHeaders`.
- Never store tokens in `localStorage`/`sessionStorage`.
- Never put secrets or personal data in URLs (they end up in logs and browser history).

## 7. Backend

- **Parameterized queries only.** `DatabaseProvider` accepts structured, typed `QueryFilter`
  objects; implementations translate them into parameterized queries or SDK calls.
- **No dynamic query concatenation.** Never build SQL, GraphQL, or query strings from user input.
  Never pass user input as a field/collection name without checking it against an allowlist.
- **Authorization checks on every secure endpoint** (section 3).
- **No direct database or provider access outside the provider layer.** Only
  `packages/backend/src/providers/**` may import provider SDKs (enforced by ESLint).
  Application code uses `getBackend()` and the interfaces.
- Service-role / admin credentials (e.g. `SUPABASE_SERVICE_ROLE_KEY`, Firebase admin keys) are used
  only on the server, only inside provider implementations.
- Server-only packages (`@love/backend`, `@love/config`) are never imported into client components
  or the mobile app.

## 8. Logging

**Never log:**

- passwords (including wrong ones),
- session tokens, API keys, refresh tokens, magic-link or reset tokens, MFA secrets or codes,
- authentication secrets or provider credentials,
- **personally identifiable information** — names, emails, phone numbers, addresses, dates of
  birth, free-text skill descriptions — **unless explicitly approved** in
  [docs/security/data-classification.md](docs/security/data-classification.md).

Instead: log user **IDs**, request IDs, action names, and outcomes. Mask anything that must appear
(see `ConsoleNotificationProvider`). Do not log full request/response bodies. `console.log` is
flagged by lint; use `console.warn`/`console.error` or a structured logger.

## 9. Dependencies and supply chain

- Add a dependency only when it's needed, maintained, and license-compatible. Prefer packages
  already in the tree.
- `npm audit` runs in CI on every push and weekly. High/critical advisories in web/server code
  block merges. See [docs/security/dependency-policy.md](docs/security/dependency-policy.md).
- Dependabot opens weekly update PRs; review changelogs before merging.
- Commit `package-lock.json`; CI installs with `npm ci`.

---

## 10. Rules for AI coding agents

AI agents (Claude, Copilot, Cursor, Codex, etc.) **must follow every rule in this document.** In
addition, before finishing any change, an AI agent **must verify and state** that:

- [ ] **No secrets exposed** — no keys, tokens, passwords, or connection strings added to code,
      tests, docs, logs, or `NEXT_PUBLIC_*`/`EXPO_PUBLIC_*` variables.
- [ ] **No authentication bypasses** — no new code path reaches protected data without a verified
      session; no "temporary" auth skips, test backdoors, or hard-coded users.
- [ ] **No authorization bypasses** — every new or modified secure endpoint/server action calls an
      `@love/auth` guard before touching data; ownership/membership is checked for `*_own`
      permissions.
- [ ] **No unsanitized input** — every new input is parsed with a Zod schema; no `as` casts on
      untrusted data; no `dangerouslySetInnerHTML`.
- [ ] **No insecure dependencies** — any new package is necessary, maintained, and `npm audit`
      shows no new high/critical advisories.
- [ ] **No disabled security middleware** — CSP, security headers, `proxy.ts`, Server Action origin
      checks, rate limits, and lint rules are unchanged (or the change is explicitly approved).
- [ ] **No direct database access outside the provider layer** — no provider SDK imports or raw
      queries outside `packages/backend/src/providers/**`.
- [ ] **All new APIs validated with Zod** — request and response contracts live in
      `@love/validation` / `@love/api-contracts`.
- [ ] **All changes pass linting and type checking** — `npm run lint` and `npm run type-check`
      succeed (ideally `npm run verify`).
- [ ] **No storage of plaintext credentials** — passwords are only ever handled by the
      `AuthProvider`; recovery codes and MFA secrets are never persisted or logged in plaintext.

Additional rules for AI agents:

1. **Never weaken a security control to make something work.** If a lint rule, type error, CSP, or
   guard blocks your change, fix the change — or stop and ask a human.
2. **Never use `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, or `any`** to silence a
   security-relevant rule.
3. **Never invent credentials**, sample secrets that look real, or real people's data in fixtures.
4. **Flag, don't guess.** If a requirement is ambiguous in a way that affects security, say so in
   your summary instead of choosing the permissive option.
5. **Report honestly.** If you could not run lint/type-check/build, say so explicitly.

## 11. How these rules are enforced

| Rule                                       | Enforcement                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| Provider SDKs only in the provider layer   | ESLint `no-restricted-imports` (`eslint.config.mjs`)                             |
| `process.env` only in `@love/config`       | ESLint `no-restricted-properties`                                                |
| Server packages not in mobile              | ESLint `no-restricted-imports` (mobile override)                                 |
| No `dangerouslySetInnerHTML`, `eval`       | ESLint `react/no-danger`, `no-eval`, `no-implied-eval`, `no-new-func`            |
| Env vars valid; prod fully configured      | Zod schema in `packages/config/src/env.ts` (fails at startup)                    |
| Deny-by-default RBAC                       | `packages/auth/src/permissions.ts` + guards                                      |
| CSP + security headers                     | `apps/web/src/proxy.ts`, `apps/web/next.config.ts`                               |
| Lint, types, build                         | Husky pre-commit/pre-push + CI (`.github/workflows/ci.yml`)                      |
| Secrets, SAST, vulnerable deps             | CI (`.github/workflows/security.yml`): TruffleHog, CodeQL, npm audit, Dependabot |
| Human review of security-sensitive changes | PR template security checklist                                                   |

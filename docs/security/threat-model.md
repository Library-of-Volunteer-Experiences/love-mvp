# Threat model (initial)

A living document. Revisit when authentication, the first real data flows, or the mobile API are
built.

## Assets

1. Residents' personal data (see [data-classification.md](data-classification.md)), especially
   older adults' contact details, addresses, and dates of birth.
2. Account access — especially nonprofit and admin accounts, which can see volunteer details.
3. Platform integrity — event listings and matches residents rely on to show up at a real place.
4. Provider credentials and API keys.

## Actors

| Actor                         | Goal                                                    |
| ----------------------------- | ------------------------------------------------------- |
| Opportunistic attacker        | Credential stuffing, scraping PII, spam                 |
| Scammer                       | Fake nonprofit/event to lure or defraud older residents |
| Malicious or careless insider | Over-broad data access, data export                     |
| Compromised dependency        | Supply-chain code execution                             |
| Curious user                  | Access other users' or organizations' data (IDOR)       |

## Key threats and mitigations

| Threat                                      | Mitigation (where)                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Credential stuffing / brute force           | Rate limits + lockout (`security.config.ts`, `auth.config.ts`); MFA; no account enumeration     |
| Session theft (XSS)                         | HttpOnly cookies; nonce CSP with `strict-dynamic`; `react/no-danger`; URL scheme validation     |
| CSRF                                        | SameSite cookies; Server Action origin checks; `isTrustedOrigin()`; OAuth `state` + PKCE        |
| IDOR (reading another org's data)           | `requireNonprofitAccess()` / `requireSelf()` on every `*_own` operation                         |
| Privilege escalation                        | Explicit permission matrix; roles never accepted from client input; `signUpSchema` limits roles |
| Injection                                   | Structured `QueryFilter`s; parameterized queries in providers; strict Zod schemas               |
| Fake nonprofits / events                    | `nonprofits:verify` permission for admins; events from unverified nonprofits hidden (future)    |
| PII leakage via logs                        | Logging rules (SECURITY.md §8); masking in dev providers; audit events reference IDs only       |
| Secrets in repo                             | `.gitignore`; TruffleHog in CI; env validation                                                  |
| Vulnerable / malicious dependency           | npm audit, Dependabot, dependency review, lockfile + `npm ci`                                   |
| Clickjacking                                | `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'`                                           |
| Misconfigured production                    | Zod env validation rejects missing credentials and dev-only providers when `APP_ENV=production` |
| AI prompt injection / data leakage (future) | Skill text treated as data only; no PII sent; output validated (ai-matching.md)                 |

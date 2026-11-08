# Dependency policy

## Adding a dependency

Before `npm install`-ing anything, check:

1. **Need** — can existing code or a package already in the tree do it?
2. **Health** — actively maintained, widely used, has a security policy.
3. **License** — MIT/Apache-2.0/BSD/ISC preferred. Avoid GPL/AGPL (check the package's licence by hand;
   there is no automated licence check).
4. **Scope** — install into the narrowest workspace (`npm install <pkg> -w @love/web`). Don't
   add another database SDK; Convex is the backend (ADR 0007).
5. **Audit** — `npm audit` shows no new high/critical advisories.

## Automated checks

| Check                        | When               | Blocks merge?                                      |
| ---------------------------- | ------------------ | -------------------------------------------------- |
| `npm audit` (web + packages) | every push, weekly | Yes, on **high** or **critical**                   |
| `npm audit` (mobile)         | every push, weekly | Yes, on **critical**; high is reported (see below) |
| Dependabot                   | weekly             | Opens PRs                                          |

## Known accepted advisories

Reviewed **2026-10-02**. Re-review whenever Expo is upgraded.

| Package (path)                                                              | Advisory                       | Why accepted                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `node-forge` (via `expo` → `@expo/cli` → `@expo/code-signing-certificates`) | GHSA-86w9-cpqp-85rv (high)     | Build-time CLI only (code signing for dev builds); not in the app bundle. No patched release exists yet.                                     |
| `decode-uri-component` (via `expo-router` → `query-string`)                 | GHSA-vcc3-ghjq-m6fr (moderate) | DoS via malformed URI on the device itself; fixed versions are ESM-only and incompatible with `query-string`. Track the Expo Router upgrade. |
| `uuid@7` (via `@expo/config-plugins` → `xcode`)                             | GHSA-w5hq-g745-h8pq (moderate) | Build-time iOS prebuild only; affected functions (v3/v5/v6 with `buf`) are not used.                                                         |

These sit only in the mobile toolchain, which is why mobile audits block on **critical** while
web/server code blocks on **high**. Remove rows as soon as upstream fixes land.

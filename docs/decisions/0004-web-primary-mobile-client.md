# 0004. Next.js web is the primary platform and API; Expo mobile is an API client

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

Web is the primary platform. Mobile comes later and must reuse backend contracts and types. Mobile
binaries are public: anything inside them can be extracted.

## Decision

- The web app's server (route handlers, server actions) is the only code that calls the backend.
- The mobile app calls the web app's versioned HTTP API using types from `@love/api-contracts` and
  schemas from `@love/validation`.
- Mobile may not import `@love/backend`, `@love/config`, or `@love/auth` (lint rule).

## Consequences

- Validation, authorization, rate limiting, and audit logging are enforced in one place.
- No provider credentials ever ship in an app binary.
- Mobile features require a matching web API endpoint.

## Alternatives considered

- **Mobile talks to the provider directly** (e.g. a Convex/Supabase client SDK) — duplicates
  authorization logic in provider rules and couples the app binary to the vendor.
- **A separate API service** — more infrastructure to run; unnecessary at this scale.

# 0003. Convex as the initial backend provider

- **Status:** Superseded by [0007](0007-use-convex-directly.md) (Convex was adopted, but used directly)
- **Date:** 2026-10-02

## Context

A provider must be chosen before features are built. The abstraction (ADR 0002) lowers the cost of
choosing wrong.

## Decision

Default `BACKEND_PROVIDER=convex`. The Convex module is currently a typed stub; implementing it is
the first backend task.

## Open questions (resolve before moving to Accepted)

- Data residency, and the county's procurement and records-retention requirements.
- Whether Convex Auth meets the MFA and session requirements in SECURITY.md, or whether auth should
  use a separate provider via `AUTH_PROVIDER`.
- Encryption-at-rest guarantees, and the field-level encryption approach for Restricted data.
- Cost at expected scale.

## Consequences

If the questions above favor another vendor, change the default and supersede this ADR; no
application code is affected.

# 0005. Explicit RBAC permission matrix with organization memberships

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

Roles: Volunteer, Nonprofit, Admin, SuperAdmin. Multiple users must be able to manage one nonprofit.
An early draft used a numeric role hierarchy (`volunteer < nonprofit < admin < superadmin`), which
would have silently granted nonprofit users every volunteer permission and admins every nonprofit
permission.

## Decision

- `packages/auth/src/permissions.ts` lists each role's permissions explicitly. There is no
  inheritance; anything unlisted is denied.
- `*_own` permissions additionally require an ownership check (`requireSelf`) or a membership check
  (`requireNonprofitAccess`).
- Nonprofit membership is a separate `OrganizationMembership` record with its own member role
  (`owner`/`manager`/`member`), so one user can belong to several organizations.
- MFA is mandatory for `admin` and `superadmin`.

## Consequences

- Adding a permission means editing the matrix deliberately, which is reviewable in one diff.
- Slightly more verbose than a hierarchy, and much harder to over-grant by accident.

// ─────────────────────────────────────────────────────────────
// LOVE — Role-Based Access Control
// ─────────────────────────────────────────────────────────────
// DENY BY DEFAULT: a role has a permission only if it is listed
// explicitly below. There is no implicit inheritance between
// roles — a nonprofit user does not automatically get volunteer
// permissions, and admin does not silently get superadmin powers.
//
// "own" permissions additionally require an ownership/membership
// check at the call site (see guards.ts).
//
// Changes to this matrix require security review (SECURITY.md).
// ─────────────────────────────────────────────────────────────

import type { UserRole } from '@love/shared';

export const PERMISSIONS = [
  // Volunteer self-service
  'profile:read_own',
  'profile:update_own',
  'profile:delete_own',
  'matches:read_own',
  'matches:respond_own',
  // Public-ish reads (still require sign-in)
  'events:read',
  'nonprofits:read',
  // Nonprofit members (scoped to their organization)
  'nonprofit:update_own',
  'nonprofit:manage_members_own',
  'events:create_own',
  'events:update_own',
  'events:delete_own',
  'event_volunteers:read_own',
  // Platform administration
  'users:read_any',
  'users:suspend',
  'nonprofits:verify',
  'events:moderate',
  'audit:read',
  // Super administration
  'roles:assign_admin',
  'system:configure',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const VOLUNTEER: readonly Permission[] = [
  'profile:read_own',
  'profile:update_own',
  'profile:delete_own',
  'matches:read_own',
  'matches:respond_own',
  'events:read',
  'nonprofits:read',
];

const NONPROFIT: readonly Permission[] = [
  'profile:read_own',
  'profile:update_own',
  'events:read',
  'nonprofits:read',
  'nonprofit:update_own',
  'nonprofit:manage_members_own',
  'events:create_own',
  'events:update_own',
  'events:delete_own',
  'event_volunteers:read_own',
];

const ADMIN: readonly Permission[] = [
  'profile:read_own',
  'profile:update_own',
  'events:read',
  'nonprofits:read',
  'users:read_any',
  'users:suspend',
  'nonprofits:verify',
  'events:moderate',
  'audit:read',
];

const SUPERADMIN: readonly Permission[] = [...ADMIN, 'roles:assign_admin', 'system:configure'];

export const ROLE_PERMISSIONS: Readonly<Record<UserRole, ReadonlySet<Permission>>> = {
  volunteer: new Set(VOLUNTEER),
  nonprofit: new Set(NONPROFIT),
  admin: new Set(ADMIN),
  superadmin: new Set(SUPERADMIN),
};

/** True only if `role` is explicitly granted `permission`. Unknown roles get nothing. */
export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

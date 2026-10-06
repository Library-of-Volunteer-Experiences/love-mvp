// ─────────────────────────────────────────────────────────────
// LOVE — Auth Package
// ─────────────────────────────────────────────────────────────
// Provider-independent authorization and session policy.
//
// Authentication ("who are you?") is delegated to the AuthProvider
// interface in @love/backend. This package answers "may you do
// this?" and enforces session rules — identically no matter which
// backend provider is configured.
// ─────────────────────────────────────────────────────────────

import type { UserRole } from '@love/shared';

export * from './permissions';
export * from './session';
export * from './guards';
export * from './csrf';

export type { UserRole, UserSession, NonprofitMemberRole } from '@love/shared';
export { getAuthConfig, type AuthConfig, type AuthMethod } from '@love/config';

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  volunteer: 'Volunteer',
  nonprofit: 'Nonprofit Organization',
  admin: 'Administrator',
  superadmin: 'Super Administrator',
};

export function getRoleDisplayName(role: UserRole): string {
  return ROLE_DISPLAY_NAMES[role];
}

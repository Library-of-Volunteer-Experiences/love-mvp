// ─────────────────────────────────────────────────────────────
// LOVE — Auth Package
// ─────────────────────────────────────────────────────────────
// High-level authentication utilities that consume the
// AuthProvider interface from @love/backend.
//
// This package provides:
// - Role-based access control helpers
// - Session management utilities
// - Authorization guard functions
//
// No actual auth implementation lives here — that's in
// @love/backend/providers/<provider>/
// ─────────────────────────────────────────────────────────────

import type { UserRole, UserSession } from '@love/shared';
import { hasRole, type AuthConfig } from '@love/config';

/**
 * Check if a session is valid (not expired).
 */
export function isSessionValid(session: UserSession | null): boolean {
  if (!session) return false;
  return new Date(session.expiresAt) > new Date();
}

/**
 * Authorization guard: check if a user has the required role.
 * Returns true if authorized, false otherwise.
 */
export function authorize(
  session: UserSession | null,
  requiredRole: UserRole,
  config: AuthConfig
): boolean {
  if (!session || !isSessionValid(session)) return false;
  return hasRole(session.role, requiredRole, config);
}

/**
 * Get a display-friendly role name.
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    volunteer: 'Volunteer',
    nonprofit: 'Nonprofit Organization',
    admin: 'Administrator',
    superadmin: 'Super Administrator',
  };
  return names[role];
}

// Re-export commonly used auth types
export type { UserRole, UserSession } from '@love/shared';
export { hasRole, createAuthConfig, type AuthConfig, type AuthMethod } from '@love/config';

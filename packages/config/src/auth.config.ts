// ─────────────────────────────────────────────────────────────
// LOVE — Auth Configuration
// ─────────────────────────────────────────────────────────────

import type { AuthProvider } from './env';
import type { UserRole } from '@love/shared';

export interface AuthConfig {
  provider: AuthProvider;
  /** Session timeout in seconds */
  sessionTimeout: number;
  /** Whether MFA is enabled */
  mfaEnabled: boolean;
  /** Supported auth methods */
  methods: AuthMethod[];
  /** Role hierarchy for authorization */
  roleHierarchy: Record<UserRole, number>;
}

export type AuthMethod = 'email-password' | 'magic-link' | 'oauth-google' | 'oauth-github';

export function createAuthConfig(provider: AuthProvider): AuthConfig {
  return {
    provider,
    sessionTimeout: 60 * 60 * 24, // 24 hours
    mfaEnabled: process.env['FEATURE_MFA'] === 'true',
    methods: ['email-password', 'magic-link'],
    roleHierarchy: {
      volunteer: 0,
      nonprofit: 1,
      admin: 2,
      superadmin: 3,
    },
  };
}

/**
 * Check if a role has sufficient privileges for a required role level.
 */
export function hasRole(
  userRole: UserRole,
  requiredRole: UserRole,
  config: AuthConfig
): boolean {
  return (config.roleHierarchy[userRole] ?? 0) >= (config.roleHierarchy[requiredRole] ?? 0);
}

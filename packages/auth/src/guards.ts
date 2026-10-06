// ─────────────────────────────────────────────────────────────
// LOVE — Authorization guards
// ─────────────────────────────────────────────────────────────
// Every secure endpoint / server action calls one of these BEFORE
// touching the backend. They fail closed: any missing, expired, or
// ambiguous input results in denial.
// ─────────────────────────────────────────────────────────────

import type { AuthConfig } from '@love/config';
import type { NonprofitMemberRole, UserSession } from '@love/shared';
import { roleHasPermission, type Permission } from './permissions';
import { isSessionActive, needsMfa } from './session';

export type AuthorizationFailure = 'unauthenticated' | 'mfa_required' | 'forbidden';

export class AuthorizationError extends Error {
  constructor(public readonly reason: AuthorizationFailure) {
    super(reason === 'unauthenticated' ? 'Authentication required' : 'Not permitted');
    this.name = 'AuthorizationError';
  }
}

export type AuthorizationResult =
  { allowed: true; session: UserSession } | { allowed: false; reason: AuthorizationFailure };

const MEMBER_ROLE_RANK: Record<NonprofitMemberRole, number> = { member: 0, manager: 1, owner: 2 };

/** Checks session validity, MFA, and the role → permission matrix. */
export function authorize(
  session: UserSession | null,
  permission: Permission,
  config: Pick<AuthConfig, 'session' | 'mfa'>,
  now?: Date
): AuthorizationResult {
  if (!isSessionActive(session, config, now)) return { allowed: false, reason: 'unauthenticated' };
  if (needsMfa(session, config)) return { allowed: false, reason: 'mfa_required' };
  if (!roleHasPermission(session.role, permission)) return { allowed: false, reason: 'forbidden' };
  return { allowed: true, session };
}

/** Throwing variant of authorize() for use in server actions / route handlers. */
export function requirePermission(
  session: UserSession | null,
  permission: Permission,
  config: Pick<AuthConfig, 'session' | 'mfa'>,
  now?: Date
): UserSession {
  const result = authorize(session, permission, config, now);
  if (!result.allowed) throw new AuthorizationError(result.reason);
  return result.session;
}

/**
 * For `*_own` nonprofit permissions: the user must hold the permission
 * AND be a member of the specific nonprofit with at least `minimumRole`.
 */
export function requireNonprofitAccess(
  session: UserSession | null,
  nonprofitId: string,
  permission: Permission,
  config: Pick<AuthConfig, 'session' | 'mfa'>,
  minimumRole: NonprofitMemberRole = 'member',
  now?: Date
): UserSession {
  const active = requirePermission(session, permission, config, now);
  const membership = active.memberships.find((m) => m.nonprofitId === nonprofitId);
  if (!membership || MEMBER_ROLE_RANK[membership.memberRole] < MEMBER_ROLE_RANK[minimumRole]) {
    throw new AuthorizationError('forbidden');
  }
  return active;
}

/** For `*_own` user permissions: the resource must belong to the caller. */
export function requireSelf(
  session: UserSession | null,
  resourceOwnerId: string,
  permission: Permission,
  config: Pick<AuthConfig, 'session' | 'mfa'>,
  now?: Date
): UserSession {
  const active = requirePermission(session, permission, config, now);
  if (active.userId !== resourceOwnerId) throw new AuthorizationError('forbidden');
  return active;
}

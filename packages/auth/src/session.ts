// ─────────────────────────────────────────────────────────────
// LOVE — Session policy
// ─────────────────────────────────────────────────────────────
// Provider-independent checks applied on top of whatever the
// AuthProvider returns: expiry, idle timeout, absolute timeout,
// and MFA requirements.
// ─────────────────────────────────────────────────────────────

import type { AuthConfig } from '@love/config';
import type { UserSession } from '@love/shared';

export type SessionStatus = 'active' | 'missing' | 'expired' | 'idle_timeout' | 'absolute_timeout';

export function getSessionStatus(
  session: UserSession | null,
  config: Pick<AuthConfig, 'session'>,
  now: Date = new Date()
): SessionStatus {
  if (!session) return 'missing';
  const nowMs = now.getTime();

  const expiresAt = Date.parse(session.expiresAt);
  if (Number.isNaN(expiresAt) || expiresAt <= nowMs) return 'expired';

  const issuedAt = Date.parse(session.issuedAt);
  if (Number.isNaN(issuedAt) || nowMs - issuedAt > config.session.absoluteTimeoutSeconds * 1000) {
    return 'absolute_timeout';
  }

  const lastActivityAt = Date.parse(session.lastActivityAt);
  if (
    Number.isNaN(lastActivityAt) ||
    nowMs - lastActivityAt > config.session.idleTimeoutSeconds * 1000
  ) {
    return 'idle_timeout';
  }

  return 'active';
}

export function isSessionActive(
  session: UserSession | null,
  config: Pick<AuthConfig, 'session'>,
  now?: Date
): session is UserSession {
  return getSessionStatus(session, config, now) === 'active';
}

/** True when the user's role requires MFA and the session has not completed it. */
export function needsMfa(session: UserSession, config: Pick<AuthConfig, 'mfa'>): boolean {
  if (!config.mfa.enabled) return false;
  return config.mfa.requiredForRoles.includes(session.role) && !session.mfaVerified;
}

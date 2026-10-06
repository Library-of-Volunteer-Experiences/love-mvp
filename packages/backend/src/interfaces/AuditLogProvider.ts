// ─────────────────────────────────────────────────────────────
// LOVE — AuditLogProvider Interface
// ─────────────────────────────────────────────────────────────
// Records security-relevant events (sign-ins, role changes, data
// exports, deletions, permission denials) to an append-only store.
//
// NEVER include passwords, tokens, secrets, or PII in `metadata`.
// Reference people by ID only. See SECURITY.md → Logging.
// ─────────────────────────────────────────────────────────────

import type { UserRole } from '@love/shared';

export type AuditAction =
  | 'auth.sign_in'
  | 'auth.sign_in_failed'
  | 'auth.sign_out'
  | 'auth.mfa_enrolled'
  | 'auth.mfa_disabled'
  | 'auth.password_changed'
  | 'auth.password_reset'
  | 'auth.role_changed'
  | 'authz.denied'
  | 'data.created'
  | 'data.updated'
  | 'data.deleted'
  | 'data.exported';

export interface AuditEvent {
  action: AuditAction;
  outcome: 'success' | 'failure';
  /** Null for anonymous actors (e.g. failed sign-in). */
  actorId: string | null;
  actorRole?: UserRole;
  targetType?: string;
  targetId?: string;
  /** Request correlation ID — not the IP or user agent. */
  requestId?: string;
  /** Non-sensitive context only. */
  metadata?: Record<string, string | number | boolean>;
  /** ISO 8601; set by the provider if omitted. */
  timestamp?: string;
}

export interface AuditLogProvider {
  record(event: AuditEvent): Promise<void>;
}

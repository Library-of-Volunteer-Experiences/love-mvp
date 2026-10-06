// ─────────────────────────────────────────────────────────────
// LOVE — Console Audit Log Provider (DEVELOPMENT ONLY)
// ─────────────────────────────────────────────────────────────
// Writes structured audit events to stderr. Production must use a
// durable, append-only store implemented in a vendor provider folder.
// ─────────────────────────────────────────────────────────────

import type { AuditEvent, AuditLogProvider } from '../../interfaces/AuditLogProvider';

export class ConsoleAuditLogProvider implements AuditLogProvider {
  async record(event: AuditEvent): Promise<void> {
    console.warn(
      '[LOVE audit]',
      JSON.stringify({ ...event, timestamp: event.timestamp ?? new Date().toISOString() })
    );
  }
}

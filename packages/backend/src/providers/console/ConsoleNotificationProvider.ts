// ─────────────────────────────────────────────────────────────
// LOVE — Console Notification Provider (DEVELOPMENT ONLY)
// ─────────────────────────────────────────────────────────────
// Logs notifications instead of sending them. Recipients are masked
// and bodies are omitted so local logs never accumulate PII.
// @love/config rejects this provider in staging/production.
// ─────────────────────────────────────────────────────────────

import type { NotificationChannel } from '@love/shared';
import type {
  NotificationPayload,
  NotificationProvider,
  NotificationResult,
} from '../../interfaces/NotificationProvider';

function maskRecipient(value: string): string {
  if (value.length <= 4) return '****';
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

function describe(notification: NotificationPayload): Record<string, unknown> {
  switch (notification.channel) {
    case 'email':
      return {
        channel: 'email',
        to: maskRecipient(notification.to),
        subjectLength: notification.subject.length,
      };
    case 'sms':
      return {
        channel: 'sms',
        to: maskRecipient(notification.to),
        bodyLength: notification.body.length,
      };
    case 'push':
      return { channel: 'push', userId: notification.userId, title: notification.title };
  }
}

export class ConsoleNotificationProvider implements NotificationProvider {
  constructor(private readonly channels: ReadonlySet<NotificationChannel>) {}

  async send(notification: NotificationPayload): Promise<NotificationResult> {
    console.warn('[LOVE dev notification]', describe(notification));
    return {
      success: true,
      channel: notification.channel,
      messageId: `console-${crypto.randomUUID()}`,
    };
  }

  async sendBatch(notifications: NotificationPayload[]): Promise<NotificationResult[]> {
    return Promise.all(notifications.map((n) => this.send(n)));
  }

  isChannelAvailable(channel: NotificationChannel): boolean {
    return this.channels.has(channel);
  }
}

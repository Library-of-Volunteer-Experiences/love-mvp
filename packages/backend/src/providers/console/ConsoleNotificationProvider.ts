// ─────────────────────────────────────────────────────────────
// LOVE — Console Notification Provider
// ─────────────────────────────────────────────────────────────
// A development-only notification provider that logs
// notifications to the console instead of sending them.
// ─────────────────────────────────────────────────────────────

import type { NotificationChannel } from '@love/shared';
import type {
  NotificationProvider,
  NotificationPayload,
  NotificationResult,
} from '../../interfaces/NotificationProvider';

export class ConsoleNotificationProvider implements NotificationProvider {
  async send(notification: NotificationPayload): Promise<NotificationResult> {
    console.log('[LOVE Notification]', JSON.stringify(notification, null, 2));
    return {
      success: true,
      channel: notification.channel,
      messageId: `console-${Date.now()}`,
    };
  }

  async sendBatch(notifications: NotificationPayload[]): Promise<NotificationResult[]> {
    return Promise.all(notifications.map((n) => this.send(n)));
  }

  isChannelAvailable(_channel: NotificationChannel): boolean {
    return true;
  }
}

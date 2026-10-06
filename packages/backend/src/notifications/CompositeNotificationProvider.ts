// ─────────────────────────────────────────────────────────────
// LOVE — Composite Notification Provider
// ─────────────────────────────────────────────────────────────
// Presents a single NotificationProvider to the application while
// routing each payload to the provider configured for its channel
// (e.g. email → SendGrid, sms → Twilio, push → Expo).
// ─────────────────────────────────────────────────────────────

import type { NotificationChannel } from '@love/shared';
import type {
  NotificationPayload,
  NotificationProvider,
  NotificationResult,
} from '../interfaces/NotificationProvider';

export type ChannelProviders = Partial<Record<NotificationChannel, NotificationProvider>>;

export class CompositeNotificationProvider implements NotificationProvider {
  constructor(private readonly channels: ChannelProviders) {}

  async send(notification: NotificationPayload): Promise<NotificationResult> {
    const provider = this.channels[notification.channel];
    if (!provider || !provider.isChannelAvailable(notification.channel)) {
      return {
        success: false,
        channel: notification.channel,
        error: `Channel "${notification.channel}" is disabled`,
      };
    }
    return provider.send(notification);
  }

  async sendBatch(notifications: NotificationPayload[]): Promise<NotificationResult[]> {
    return Promise.all(notifications.map((n) => this.send(n)));
  }

  isChannelAvailable(channel: NotificationChannel): boolean {
    return this.channels[channel]?.isChannelAvailable(channel) ?? false;
  }

  async registerDevice(userId: string, deviceToken: string): Promise<void> {
    await this.channels.push?.registerDevice?.(userId, deviceToken);
  }

  async unregisterDevice(userId: string, deviceToken: string): Promise<void> {
    await this.channels.push?.unregisterDevice?.(userId, deviceToken);
  }
}

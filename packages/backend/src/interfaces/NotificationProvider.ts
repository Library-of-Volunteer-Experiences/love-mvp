// ─────────────────────────────────────────────────────────────
// LOVE — NotificationProvider Interface
// ─────────────────────────────────────────────────────────────
// All notification delivery MUST go through this interface.
// Supports email, push notifications, and SMS.
// Application code should never reference Twilio, SendGrid,
// or any other provider directly.
// ─────────────────────────────────────────────────────────────

import type { NotificationChannel } from '@love/shared';

export interface EmailNotification {
  channel: 'email';
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface PushNotification {
  channel: 'push';
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface SmsNotification {
  channel: 'sms';
  to: string;
  body: string;
}

export type NotificationPayload =
  | EmailNotification
  | PushNotification
  | SmsNotification;

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
}

export interface NotificationProvider {
  /** Send a notification */
  send(notification: NotificationPayload): Promise<NotificationResult>;

  /** Send multiple notifications (batch) */
  sendBatch(notifications: NotificationPayload[]): Promise<NotificationResult[]>;

  /** Check if a channel is available/configured */
  isChannelAvailable(channel: NotificationChannel): boolean;

  /** Register a device for push notifications */
  registerDevice?(userId: string, deviceToken: string): Promise<void>;

  /** Unregister a device from push notifications */
  unregisterDevice?(userId: string, deviceToken: string): Promise<void>;
}

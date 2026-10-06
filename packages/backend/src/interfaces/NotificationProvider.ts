// ─────────────────────────────────────────────────────────────
// LOVE — NotificationProvider Interface
// ─────────────────────────────────────────────────────────────
// All notification delivery MUST go through this interface.
// Supports email, push notifications, and SMS.
// Application code never references Twilio, SendGrid, Expo Push,
// or any other delivery service directly.
//
// Each channel has its own provider (configured in
// @love/config notification.config.ts); the
// CompositeNotificationProvider routes payloads by channel so
// callers only ever see this one interface.
// ─────────────────────────────────────────────────────────────

import type { NotificationChannel } from '@love/shared';

export interface EmailNotification {
  channel: 'email';
  to: string;
  subject: string;
  /** Must be rendered from a template with escaped user content. */
  htmlBody: string;
  textBody: string;
}

export interface PushNotification {
  channel: 'push';
  userId: string;
  title: string;
  body: string;
  /** Do not include PII or secrets — payloads may be stored by OS vendors. */
  data?: Record<string, string>;
}

export interface SmsNotification {
  channel: 'sms';
  /** E.164 format, e.g. +17065550123 */
  to: string;
  body: string;
}

export type NotificationPayload = EmailNotification | PushNotification | SmsNotification;

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  /** Safe-to-log error description (no recipient data). */
  error?: string;
}

export interface NotificationProvider {
  send(notification: NotificationPayload): Promise<NotificationResult>;

  sendBatch(notifications: NotificationPayload[]): Promise<NotificationResult[]>;

  /** Whether the channel is configured and enabled. */
  isChannelAvailable(channel: NotificationChannel): boolean;

  /** Register a device token for push notifications. */
  registerDevice?(userId: string, deviceToken: string): Promise<void>;

  unregisterDevice?(userId: string, deviceToken: string): Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// LOVE — Notification Configuration
// ─────────────────────────────────────────────────────────────

import type { NotificationProvider } from './env';

export interface NotificationConfig {
  provider: NotificationProvider;
  /** Provider-specific options */
  options: Record<string, unknown>;
}

export function createNotificationConfig(
  provider: NotificationProvider
): NotificationConfig {
  switch (provider) {
    case 'console':
      return { provider: 'console', options: {} };
    case 'smtp':
      return {
        provider: 'smtp',
        options: {
          host: process.env['SMTP_HOST'] ?? '',
          port: parseInt(process.env['SMTP_PORT'] ?? '587', 10),
          user: process.env['SMTP_USER'] ?? '',
          pass: process.env['SMTP_PASS'] ?? '',
        },
      };
    case 'sendgrid':
      return {
        provider: 'sendgrid',
        options: {
          apiKey: process.env['SENDGRID_API_KEY'] ?? '',
        },
      };
    case 'twilio':
      return {
        provider: 'twilio',
        options: {
          accountSid: process.env['TWILIO_ACCOUNT_SID'] ?? '',
          authToken: process.env['TWILIO_AUTH_TOKEN'] ?? '',
        },
      };
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown notification provider: ${_exhaustive}`);
    }
  }
}

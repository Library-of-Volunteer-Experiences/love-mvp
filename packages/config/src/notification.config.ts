// ─────────────────────────────────────────────────────────────
// LOVE — Notification Configuration
// ─────────────────────────────────────────────────────────────
// Each channel (email, SMS, push) selects its own provider:
//
//   NOTIFICATION_EMAIL_PROVIDER=none | console | smtp | sendgrid
//   NOTIFICATION_SMS_PROVIDER=none | console | twilio
//   NOTIFICATION_PUSH_PROVIDER=none | console | expo
//
// Defaults: `console` in local development, `none` elsewhere, so a
// misconfigured deployment never silently logs messages containing PII.
// ─────────────────────────────────────────────────────────────

import {
  getServerEnv,
  type EmailProviderName,
  type PushProviderName,
  type ServerEnv,
  type SmsProviderName,
} from './env';
import { getFeatureFlags } from './featureFlags';

export type EmailChannelConfig =
  | { provider: 'none' | 'console' }
  | { provider: 'smtp'; from: string; host: string; port: number; user?: string; pass?: string }
  | { provider: 'sendgrid'; from: string; apiKey: string };

export type SmsChannelConfig =
  | { provider: 'none' | 'console' }
  | { provider: 'twilio'; accountSid: string; authToken: string; fromNumber: string };

export type PushChannelConfig =
  { provider: 'none' | 'console' } | { provider: 'expo'; accessToken?: string };

export interface NotificationConfig {
  email: EmailChannelConfig;
  sms: SmsChannelConfig;
  push: PushChannelConfig;
}

export function getNotificationConfig(env: ServerEnv = getServerEnv()): NotificationConfig {
  const flags = getFeatureFlags(env);
  const fallback = env.APP_ENV === 'development' || env.APP_ENV === 'test' ? 'console' : 'none';

  const emailProvider: EmailProviderName = env.NOTIFICATION_EMAIL_PROVIDER ?? fallback;
  const smsProvider: SmsProviderName = flags.smsNotifications
    ? (env.NOTIFICATION_SMS_PROVIDER ?? fallback)
    : 'none';
  const pushProvider: PushProviderName = flags.pushNotifications
    ? (env.NOTIFICATION_PUSH_PROVIDER ?? fallback)
    : 'none';

  return {
    email: buildEmailConfig(emailProvider, env),
    sms: buildSmsConfig(smsProvider, env),
    push:
      pushProvider === 'expo'
        ? { provider: 'expo', accessToken: env.EXPO_PUSH_ACCESS_TOKEN }
        : { provider: pushProvider },
  };
}

function buildEmailConfig(provider: EmailProviderName, env: ServerEnv): EmailChannelConfig {
  const from = env.EMAIL_FROM ?? '';
  switch (provider) {
    case 'smtp':
      return {
        provider,
        from,
        host: env.SMTP_HOST ?? '',
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      };
    case 'sendgrid':
      return { provider, from, apiKey: env.SENDGRID_API_KEY ?? '' };
    default:
      return { provider };
  }
}

function buildSmsConfig(provider: SmsProviderName, env: ServerEnv): SmsChannelConfig {
  if (provider !== 'twilio') return { provider };
  return {
    provider,
    accountSid: env.TWILIO_ACCOUNT_SID ?? '',
    authToken: env.TWILIO_AUTH_TOKEN ?? '',
    fromNumber: env.TWILIO_FROM_NUMBER ?? '',
  };
}

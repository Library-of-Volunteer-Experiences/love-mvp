// ─────────────────────────────────────────────────────────────
// LOVE — Feature Flags
// ─────────────────────────────────────────────────────────────
// Centralized feature flag management. Every toggle is defined here
// and defaults to OFF (secure by default). In the future this can be
// backed by a remote flag service without changing call sites.
// ─────────────────────────────────────────────────────────────

import { getServerEnv, type ServerEnv } from './env';

export interface FeatureFlags {
  /** AI-powered skill extraction and volunteer-to-event matching. */
  aiMatching: boolean;
  /** SMS notification channel. */
  smsNotifications: boolean;
  /** Push notification channel (mobile). */
  pushNotifications: boolean;
  /** Passwordless magic-link sign-in. */
  magicLink: boolean;
  /** OAuth sign-in (Google, Apple, Microsoft). */
  oauth: boolean;
  /** Multi-factor authentication (TOTP). */
  mfa: boolean;
  /** API surface consumed by the mobile app. */
  mobileApi: boolean;
}

export function getFeatureFlags(env: ServerEnv = getServerEnv()): FeatureFlags {
  return {
    // AI matching additionally requires a configured provider.
    aiMatching: env.FEATURE_AI_MATCHING && env.AI_PROVIDER !== 'none',
    smsNotifications: env.FEATURE_SMS_NOTIFICATIONS,
    pushNotifications: env.FEATURE_PUSH_NOTIFICATIONS,
    magicLink: env.FEATURE_MAGIC_LINK,
    oauth: env.FEATURE_OAUTH,
    mfa: env.FEATURE_MFA,
    mobileApi: env.FEATURE_MOBILE_API,
  };
}

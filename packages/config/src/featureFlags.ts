// ─────────────────────────────────────────────────────────────
// LOVE — Feature Flags
// ─────────────────────────────────────────────────────────────
// Centralized feature flag management.
// All feature toggles should be defined here.
// In the future, this can be backed by a remote feature
// flag service (LaunchDarkly, Statsig, etc.).
// ─────────────────────────────────────────────────────────────

export interface FeatureFlags {
  /** Enable AI-powered volunteer-to-event matching */
  aiMatching: boolean;
  /** Enable SMS notification channel */
  smsNotifications: boolean;
  /** Enable push notification channel */
  pushNotifications: boolean;
  /** Enable multi-factor authentication */
  mfa: boolean;
  /** Enable OAuth login methods */
  oauth: boolean;
  /** Enable mobile app API endpoints */
  mobileApi: boolean;
}

function flag(envVar: string): boolean {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[envVar] === 'true';
  }
  return false;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    aiMatching: flag('FEATURE_AI_MATCHING'),
    smsNotifications: flag('FEATURE_SMS_NOTIFICATIONS'),
    pushNotifications: flag('FEATURE_PUSH_NOTIFICATIONS'),
    mfa: flag('FEATURE_MFA'),
    oauth: flag('FEATURE_OAUTH'),
    mobileApi: flag('FEATURE_MOBILE_API'),
  };
}

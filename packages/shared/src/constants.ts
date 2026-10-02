// ─────────────────────────────────────────────────────────────
// LOVE — Shared Constants
// ─────────────────────────────────────────────────────────────

export const APP_NAME = 'LOVE' as const;
export const APP_FULL_NAME = 'Library of Volunteer Experiences' as const;
export const APP_CLIENT = 'Fannin County, Georgia' as const;

export const USER_ROLES = ['volunteer', 'nonprofit', 'admin', 'superadmin'] as const;

export const MATCH_STATUS = [
  'pending',
  'accepted',
  'declined',
  'completed',
  'cancelled',
] as const;

export const NOTIFICATION_CHANNELS = ['email', 'push', 'sms'] as const;

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/** Default matching configuration */
export const DEFAULT_MATCHING_CONFIG = {
  minScore: 50,
  maxMatches: 10,
  skillWeight: 0.5,
  distanceWeight: 0.3,
  availabilityWeight: 0.2,
} as const;

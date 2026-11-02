// ─────────────────────────────────────────────────────────────
// LOVE — Shared Constants
// ─────────────────────────────────────────────────────────────

export const APP_NAME = 'love' as const;
export const APP_FULL_NAME = 'Library of Volunteer Experiences' as const;
export const APP_CLIENT = 'Fannin County, Georgia' as const;

/** Platform-level roles. Single source of truth for the UserRole type. */
export const USER_ROLES = ['volunteer', 'nonprofit', 'admin', 'superadmin'] as const;

/** Roles a user can hold inside one nonprofit organization. */
export const NONPROFIT_MEMBER_ROLES = ['owner', 'manager', 'member'] as const;

export const MATCH_STATUS = ['pending', 'accepted', 'declined', 'completed', 'cancelled'] as const;

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

// ─────────────────────────────────────────────────────────────
// Volunteer preferences (onboarding, settings, filters)
// `value` is what gets stored; `label` is what people see.
// ─────────────────────────────────────────────────────────────

export const CAUSES = [
  { value: 'food_hunger', label: 'Food & hunger' },
  { value: 'seniors', label: 'Seniors' },
  { value: 'kids_education', label: 'Kids & education' },
  { value: 'animals', label: 'Animals' },
  { value: 'outdoors', label: 'Outdoors' },
  { value: 'housing_repair', label: 'Housing & repair' },
  { value: 'health', label: 'Health' },
  { value: 'arts_culture', label: 'Arts & culture' },
  { value: 'community_events', label: 'Community events' },
  { value: 'veterans', label: 'Veterans' },
  { value: 'disaster_relief', label: 'Disaster relief' },
] as const;

export const SKILLS = [
  { value: 'cooking', label: 'Cooking' },
  { value: 'driving', label: 'Driving' },
  { value: 'building_repair', label: 'Building & repair' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'office_computer', label: 'Office & computer' },
  { value: 'setup_lifting', label: 'Setup & lifting' },
  { value: 'first_aid', label: 'First aid' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'music_arts', label: 'Music & arts' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'photography', label: 'Photography' },
  { value: 'happy_to_help', label: 'Just happy to help' },
] as const;

export const FREE_TIMES = [
  { value: 'weekday_mornings', label: 'Weekday mornings' },
  { value: 'weekday_afternoons', label: 'Weekday afternoons' },
  { value: 'weekday_evenings', label: 'Weekday evenings' },
  { value: 'weekends', label: 'Weekends' },
] as const;

export const DISTANCE_OPTIONS = [
  { value: '5', label: '5 miles' },
  { value: '15', label: '15 miles' },
  { value: 'anywhere', label: 'Anywhere' },
] as const;

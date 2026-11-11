// Data shapes for /events/[event]. Today the page fills these from
// lib/fixtures/events.ts; later a Convex query returns the same shapes.

import type { Cause, Skill } from '@love/shared';

export type ShiftData = {
  id: string;
  start: string; // ISO 8601 with offset
  end: string;
  spotsTotal: number;
  spotsTaken: number; // a stored counter on the shift, never counted on the fly
};

export type RoleData = {
  id: string;
  name: string;
  summary: string; // one line, shown on the role block
  description: string; // full text, shown in "Learn more"
  timeNeeded: string | null; // e.g. "About 2 hours"
  skillTags: Skill[];
  shifts: ShiftData[];
};

export type NonprofitSummary = {
  slug: string;
  name: string;
  logoUrl: string | null;
};

/**
 * Everything a logged-out visitor may see. Do NOT add the street address or
 * coordinator contact here: they belong only in EventFullData.
 */
export type EventPublicData = {
  id: string;
  name: string;
  coverUrl: string | null;
  nonprofit: NonprofitSummary;
  town: string;
  description: string;
  causeTags: Cause[];
  loveCount: number;
  roles: RoleData[];
};

/** Only ever sent to signed-in users. */
export type EventFullData = EventPublicData & {
  address: string;
  coordinator: { name: string; email: string | null; phone: string | null } | null;
};

export type VolunteerViewer = {
  lovedByMe: boolean;
  followingNonprofit: boolean;
  isMember: boolean; // member of this event's nonprofit: sees Edit / See sign-ups
  hasPhone: boolean; // has a phone number saved on their profile
  signup: { shiftId: string } | null; // one shift per event
};

export type EventPageView =
  | { kind: 'guest'; event: EventPublicData }
  | { kind: 'volunteer'; event: EventFullData; viewer: VolunteerViewer };

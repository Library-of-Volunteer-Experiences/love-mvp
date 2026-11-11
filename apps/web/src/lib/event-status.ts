// Pure helpers for spots and event status. `now` is always passed in (epoch ms)
// so server and browser agree, and because Convex queries can't read Date.now().

import type { RoleData, ShiftData } from '@/components/events/event-types';

export type EventStatus = 'open' | 'full' | 'ended';

export function shiftSpotsLeft(shift: ShiftData): number {
  return Math.max(0, shift.spotsTotal - shift.spotsTaken);
}

/** Spots left across a role's shifts that haven't started yet. */
export function roleOpenSpots(role: RoleData, now: number): number {
  return role.shifts
    .filter((shift) => !hasShiftStarted(shift, now))
    .reduce((total, shift) => total + shiftSpotsLeft(shift), 0);
}

export function roleHasEnded(role: RoleData, now: number): boolean {
  return role.shifts.every((shift) => new Date(shift.end).getTime() <= now);
}

/** A shift can be picked if it hasn't started yet and has room. */
export function isShiftOpen(shift: ShiftData, now: number): boolean {
  return shiftSpotsLeft(shift) > 0 && new Date(shift.start).getTime() > now;
}

export function hasShiftStarted(shift: ShiftData, now: number): boolean {
  return new Date(shift.start).getTime() <= now;
}

export function eventStatus(roles: readonly RoleData[], now: number): EventStatus {
  const shifts = roles.flatMap((role) => role.shifts);
  if (shifts.every((shift) => new Date(shift.end).getTime() <= now)) return 'ended';
  if (!shifts.some((shift) => isShiftOpen(shift, now))) return 'full';
  return 'open';
}

export function findShift(
  roles: readonly RoleData[],
  shiftId: string
): { role: RoleData; shift: ShiftData } | null {
  for (const role of roles) {
    const shift = role.shifts.find((candidate) => candidate.id === shiftId);
    if (shift) return { role, shift };
  }
  return null;
}

'use client';

// RoleDetailsDialog: the "Learn more" popup for a role
// Used on: /events/[event]
// Spec: docs/product/design-inventory.md, "Role details popup"; user-flows.md 5.2
// Decided: a centered dialog on every screen size.

import { Clock } from 'lucide-react';
import type { RoleData } from '@/components/events/event-types';
import { EventStatusBadge } from '@/components/events/event-status-badge';
import { TagChip } from '@/components/global/tag-chip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { hasShiftStarted, isShiftOpen, shiftSpotsLeft } from '@/lib/event-status';
import { formatShift } from '@/lib/format-shift';
import { skillLabel } from '@/lib/tags';

type RoleDetailsDialogProps = {
  role: RoleData | null; // null = closed
  now: number;
  // Why signing up isn't possible right now (ended, already signed up), or null if it is.
  signUpBlockedReason: string | null;
  onOpenChange: (open: boolean) => void;
  onSignUp: (roleId: string) => void;
};

export function RoleDetailsDialog({
  role,
  now,
  signUpBlockedReason,
  onOpenChange,
  onSignUp,
}: RoleDetailsDialogProps) {
  const hasOpenShift = role?.shifts.some((shift) => isShiftOpen(shift, now)) ?? false;
  const blockedReason =
    signUpBlockedReason ?? (hasOpenShift ? null : 'All spots for this role are filled.');

  return (
    <Dialog open={role !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        {role && (
          <>
            <DialogHeader>
              <DialogTitle>{role.name}</DialogTitle>
              <DialogDescription className="text-foreground">{role.description}</DialogDescription>
            </DialogHeader>

            {role.timeNeeded && (
              <p className="flex items-center gap-2">
                <Clock aria-hidden="true" className="size-5 shrink-0" />
                {role.timeNeeded}
              </p>
            )}

            <div>
              <h3 className="font-semibold">Shifts</h3>
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {role.shifts.map((shift) => {
                  const ended = new Date(shift.end).getTime() <= now;
                  const started = hasShiftStarted(shift, now);
                  const spots = shiftSpotsLeft(shift);
                  return (
                    <li
                      key={shift.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                    >
                      <time dateTime={shift.start}>{formatShift(shift.start, shift.end)}</time>
                      <EventStatusBadge
                        status={
                          ended
                            ? { kind: 'ended' }
                            : started
                              ? { kind: 'started' }
                              : spots === 0
                                ? { kind: 'full' }
                                : { kind: 'spots', count: spots }
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {role.skillTags.length > 0 && (
              <div>
                <h3 className="font-semibold">Helpful skills</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {role.skillTags.map((skill) => (
                    <li key={skill}>
                      <TagChip label={skillLabel(skill)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter className="items-center sm:justify-between">
              {blockedReason && <p className="text-muted-foreground">{blockedReason}</p>}
              <Button
                size="lg"
                className="sm:ml-auto"
                disabled={blockedReason !== null}
                onClick={() => onSignUp(role.id)}
              >
                Sign up for this role
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

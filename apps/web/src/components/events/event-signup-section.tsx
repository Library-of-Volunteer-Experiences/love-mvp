'use client';

// EventSignupSection: the Roles section of the signed-in event page, with the
// "Learn more" popup, the sign-up popup, and the "You're signed up" box.
// Used on: /events/[event] (signed in)
// Spec: docs/product/pages.md "Event page, full"; user-flows.md Part 5
//
// FAKE for now: sign-up and cancel only change local state. When Convex is
// ready, handleConfirm / handleCancel call mutations instead; the spots then
// come back from the live query, so `roles` no longer needs to be state.

import { useEffect, useRef, useState } from 'react';
import type { ShiftSignupInput } from '@love/validation';
import type { RoleData, VolunteerViewer } from '@/components/events/event-types';
import { RoleCard } from '@/components/events/role-card';
import { RoleDetailsDialog } from '@/components/events/role-details-dialog';
import { SignedUpBanner } from '@/components/events/signed-up-banner';
import { SignupDialog, type SignupResult } from '@/components/events/signup-dialog';
import { Button } from '@/components/ui/button';
import { eventStatus, findShift, hasShiftStarted, isShiftOpen } from '@/lib/event-status';

type EventSignupSectionProps = {
  roles: RoleData[];
  nonprofitName: string;
  viewer: VolunteerViewer;
  now: number;
};

function changeSpotsTaken(roles: RoleData[], shiftId: string, change: 1 | -1): RoleData[] {
  return roles.map((role) => ({
    ...role,
    shifts: role.shifts.map((shift) =>
      shift.id === shiftId ? { ...shift, spotsTaken: shift.spotsTaken + change } : shift
    ),
  }));
}

export function EventSignupSection({
  roles: initialRoles,
  nonprofitName,
  viewer,
  now,
}: EventSignupSectionProps) {
  const [roles, setRoles] = useState(initialRoles);
  const [signup, setSignup] = useState(viewer.signup);
  const [detailsRoleId, setDetailsRoleId] = useState<string | null>(null);
  const [signupOpen, setSignupOpen] = useState(false);
  const [preselectRoleId, setPreselectRoleId] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const justSignedUp = useRef(false);
  const justCancelled = useRef(false);

  // After cancelling, the banner (and the button that opened the confirm box)
  // disappears, so move focus to the section heading instead of losing it.
  useEffect(() => {
    if (justCancelled.current && signup === null) {
      justCancelled.current = false;
      headingRef.current?.focus();
    }
  }, [signup]);

  const status = eventStatus(roles, now);
  const signedUp = signup ? findShift(roles, signup.shiftId) : null;

  const blockedReason =
    status === 'ended'
      ? 'This event has ended.'
      : signup
        ? 'You’re already signed up for this event.'
        : null;

  function openSignup(roleId: string | null) {
    setDetailsRoleId(null);
    setPreselectRoleId(roleId);
    setSignupOpen(true);
  }

  async function handleConfirm(values: ShiftSignupInput): Promise<SignupResult> {
    // FAKE: the Convex mutation will re-validate, check the caller, and
    // re-check the spot inside one transaction. Notes and the phone choice are
    // not stored anywhere yet.
    const found = findShift(roles, values.shiftId);
    if (!found || !isShiftOpen(found.shift, now)) return { ok: false, reason: 'shift_full' };
    setRoles((current) => changeSpotsTaken(current, values.shiftId, 1));
    setSignup({ shiftId: values.shiftId });
    justSignedUp.current = true;
    return { ok: true };
  }

  function handleCancel() {
    if (!signup) return;
    setRoles((current) => changeSpotsTaken(current, signup.shiftId, -1));
    justCancelled.current = true;
    setSignup(null);
  }

  return (
    <section aria-labelledby="roles-heading" className="space-y-4">
      <h2
        id="roles-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-semibold outline-none"
      >
        Roles
      </h2>

      {signedUp && (
        <SignedUpBanner
          ref={bannerRef}
          roleName={signedUp.role.name}
          shift={signedUp.shift}
          canCancel={!hasShiftStarted(signedUp.shift, now)}
          onCancel={handleCancel}
        />
      )}

      <ul className="space-y-4">
        {roles.map((role) => (
          <li key={role.id}>
            <RoleCard
              role={role}
              now={now}
              signedUpHere={signedUp?.role.id === role.id}
              onLearnMore={() => setDetailsRoleId(role.id)}
            />
          </li>
        ))}
      </ul>

      {!signup && (
        <div className="flex flex-col items-start gap-2 pt-2">
          <Button size="lg" disabled={status !== 'open'} onClick={() => openSignup(null)}>
            Sign up
          </Button>
          {status === 'ended' && <p className="text-muted-foreground">This event has ended.</p>}
          {status === 'full' && <p className="text-muted-foreground">All spots are filled.</p>}
        </div>
      )}

      <RoleDetailsDialog
        role={roles.find((role) => role.id === detailsRoleId) ?? null}
        now={now}
        signUpBlockedReason={blockedReason}
        onOpenChange={(open) => !open && setDetailsRoleId(null)}
        onSignUp={openSignup}
      />

      <SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        roles={roles}
        now={now}
        preselectRoleId={preselectRoleId}
        nonprofitName={nonprofitName}
        hasPhone={viewer.hasPhone}
        onConfirm={handleConfirm}
        onCloseAutoFocus={(event) => {
          if (!justSignedUp.current) return;
          justSignedUp.current = false;
          event.preventDefault();
          bannerRef.current?.focus();
        }}
      />
    </section>
  );
}

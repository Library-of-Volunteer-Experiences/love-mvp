'use client';

// SignedUpBanner: "You're signed up for Role, Shift" box with Cancel my sign-up
// Used on: /events/[event]
// Spec: docs/product/design-inventory.md, "You're signed up box"; user-flows.md 5.4
// Decided: green success colors, at the top of the Roles section. It receives
// focus right after signing up, so screen readers announce it.

import type { Ref } from 'react';
import { CircleCheck } from 'lucide-react';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { Button } from '@/components/ui/button';
import { formatShift } from '@/lib/format-shift';

type SignedUpBannerProps = {
  roleName: string;
  shift: { start: string; end: string };
  canCancel: boolean; // false once the shift has started
  onCancel: () => void | Promise<void>;
  ref?: Ref<HTMLDivElement>;
};

export function SignedUpBanner({ roleName, shift, canCancel, onCancel, ref }: SignedUpBannerProps) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="rounded-xl border-2 border-success bg-success-soft p-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      <div className="flex items-start gap-3">
        <CircleCheck aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-success" />
        <div>
          <p className="text-xl font-semibold text-success">You’re signed up!</p>
          <p className="mt-1">
            {roleName}, <time dateTime={shift.start}>{formatShift(shift.start, shift.end)}</time>
          </p>
        </div>
      </div>
      {canCancel && (
        <div className="mt-4">
          <ConfirmDialog
            trigger={<Button variant="outline">Cancel my sign-up</Button>}
            title="Cancel your sign-up?"
            description="Your spot will open up for someone else, and the organizers will be told."
            confirmLabel="Yes, cancel"
            cancelLabel="Keep my spot"
            onConfirm={onCancel}
          />
        </div>
      )}
    </div>
  );
}

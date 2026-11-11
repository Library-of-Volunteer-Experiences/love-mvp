'use client';

// SignupDialog: sign-up popup: pick a shift, notes, share-phone consent
// Used on: /events/[event]
// Spec: docs/product/design-inventory.md, "Sign-up popup"; user-flows.md 5.3
// Decided: centered dialog; shifts as large radio cards (full ones shown greyed
// and unpickable); on success the popup closes and the page shows the
// "You're signed up" box.

import { useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { shiftSignupSchema, type ShiftSignupInput } from '@love/validation';
import type { RoleData } from '@/components/events/event-types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { hasShiftStarted, isShiftOpen, shiftSpotsLeft } from '@/lib/event-status';
import { formatShift } from '@/lib/format-shift';
import { useZodForm } from '@/lib/forms';
import { cn } from '@/lib/utils';

export type SignupResult = { ok: true } | { ok: false; reason: 'shift_full' };

type SignupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleData[];
  now: number;
  preselectRoleId: string | null;
  nonprofitName: string;
  hasPhone: boolean;
  onConfirm: (values: ShiftSignupInput) => Promise<SignupResult>;
  // Lets the page move focus to the "You're signed up" box after success.
  onCloseAutoFocus?: (event: Event) => void;
};

export function SignupDialog({
  open,
  onOpenChange,
  onCloseAutoFocus,
  ...formProps
}: SignupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto" onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>Sign up to volunteer</DialogTitle>
          <DialogDescription>
            Pick one shift. You can cancel later if plans change.
          </DialogDescription>
        </DialogHeader>
        {/* Radix unmounts closed content, so the form starts fresh every time it opens. */}
        <SignupForm {...formProps} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

type SignupFormProps = Omit<SignupDialogProps, 'open' | 'onOpenChange' | 'onCloseAutoFocus'> & {
  onDone: () => void;
};

function SignupForm({
  roles,
  now,
  preselectRoleId,
  nonprofitName,
  hasPhone,
  onConfirm,
  onDone,
}: SignupFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const preselected = roles
    .find((role) => role.id === preselectRoleId)
    ?.shifts.find((shift) => isShiftOpen(shift, now));

  const form = useZodForm(shiftSignupSchema, {
    defaultValues: { shiftId: preselected?.id ?? '', notes: '', sharePhone: false, newPhone: '' },
  });
  const { errors, isSubmitting } = form.formState;
  const sharePhone = useWatch({ control: form.control, name: 'sharePhone' });
  const askForPhone = sharePhone && !hasPhone;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    if (askForPhone && values.newPhone === '') {
      form.setError('newPhone', { message: 'Enter your phone number, or uncheck the box above' });
      return;
    }
    const result = await onConfirm(values);
    if (result.ok) {
      onDone();
    } else {
      form.setValue('shiftId', '');
      setSubmitError('Sorry, that shift just filled up. Please pick another.');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <fieldset className="grid gap-3">
        <legend id="shift-legend" className="mb-3 text-lg font-semibold">
          Which shift?
        </legend>
        <Controller
          control={form.control}
          name="shiftId"
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="shift-legend"
              aria-describedby={errors.shiftId ? 'shift-error' : undefined}
              aria-invalid={errors.shiftId ? true : undefined}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setSubmitError(null);
              }}
              onBlur={field.onBlur}
            >
              {roles.flatMap((role) =>
                role.shifts
                  .filter((shift) => !hasShiftStarted(shift, now))
                  .map((shift) => {
                    const id = `shift-${shift.id}`;
                    const spots = shiftSpotsLeft(shift);
                    const open = isShiftOpen(shift, now);
                    return (
                      <label
                        key={shift.id}
                        htmlFor={id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border-2 border-border p-4',
                          'has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5',
                          !open && 'cursor-not-allowed border-dashed bg-muted text-muted-foreground'
                        )}
                      >
                        <RadioGroupItem
                          id={id}
                          value={shift.id}
                          disabled={!open}
                          className="mt-0.5"
                        />
                        <span className="grid gap-0.5">
                          <span className="font-semibold">{role.name}</span>
                          <span>{formatShift(shift.start, shift.end)}</span>
                          <span className={open ? 'text-muted-foreground' : 'font-semibold'}>
                            {open ? `${spots} ${spots === 1 ? 'spot' : 'spots'} left` : 'Full'}
                          </span>
                        </span>
                      </label>
                    );
                  })
              )}
            </RadioGroup>
          )}
        />
        {errors.shiftId && (
          <p id="shift-error" role="alert" className="text-destructive">
            {errors.shiftId.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="signup-notes" className="font-semibold">
          Anything the organizers should know? <span className="font-normal">(optional)</span>
        </label>
        <Textarea
          id="signup-notes"
          maxLength={500}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={errors.notes ? 'notes-error' : undefined}
          {...form.register('notes')}
        />
        {errors.notes && (
          <p id="notes-error" role="alert" className="text-destructive">
            {errors.notes.message}
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <Controller
          control={form.control}
          name="sharePhone"
          render={({ field }) => (
            <label htmlFor="share-phone" className="flex min-h-11 cursor-pointer items-start gap-3">
              <Checkbox
                id="share-phone"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                aria-describedby="share-phone-hint"
                className="mt-0.5"
              />
              <span>
                <span className="font-semibold">Share my phone number with {nonprofitName}</span>
                <span id="share-phone-hint" className="block text-muted-foreground">
                  They’ll only use it to reach you about this event.
                </span>
              </span>
            </label>
          )}
        />

        {askForPhone && (
          <div className="grid gap-2 pl-9">
            <label htmlFor="signup-phone" className="font-semibold">
              Your phone number
            </label>
            <p id="signup-phone-hint" className="text-muted-foreground">
              You haven’t saved one yet. We’ll add it to your profile.
            </p>
            <Input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={errors.newPhone ? true : undefined}
              aria-describedby={
                errors.newPhone ? 'signup-phone-hint signup-phone-error' : 'signup-phone-hint'
              }
              {...form.register('newPhone')}
            />
            {errors.newPhone && (
              <p id="signup-phone-error" role="alert" className="text-destructive">
                {errors.newPhone.message}
              </p>
            )}
          </div>
        )}
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-lg border-2 border-destructive p-4 font-semibold text-destructive"
        >
          {submitError}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Signing you up…' : 'Confirm sign-up'}
        </Button>
      </DialogFooter>
    </form>
  );
}

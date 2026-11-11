// LimitedEventNotice: the "sign in to see more" box on the logged-out event page
// Used on: /events/[event] (logged out)
// Spec: docs/product/design-inventory.md, "Limited event page box"; pages.md (limited)
// Return-to-this-event after login is a proposed CAC cut (plan.md §5), so the
// buttons go to the plain sign-up / log-in pages for now.

import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LimitedEventNotice() {
  return (
    <section
      aria-labelledby="limited-notice-heading"
      className="rounded-xl border-2 border-primary/30 bg-accent p-6"
    >
      <div className="flex items-start gap-3">
        <LockKeyhole aria-hidden="true" className="mt-1 size-6 shrink-0 text-primary" />
        <div>
          <h2 id="limited-notice-heading" className="text-xl font-semibold">
            Want to help?
          </h2>
          <p className="mt-1">Sign up or log in to see the full address and volunteer.</p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/sign_up">Sign up</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/log_in">Log in</Link>
        </Button>
      </div>
    </section>
  );
}

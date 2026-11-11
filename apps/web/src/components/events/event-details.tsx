// EventDetails: description, cause tags, and coordinator contact
// Used on: /events/[event]
// Spec: docs/product/design-inventory.md, "Event details section"

import { Mail, Phone, UserRound } from 'lucide-react';
import type { Cause } from '@love/shared';
import type { EventFullData } from '@/components/events/event-types';
import { TagChip } from '@/components/global/tag-chip';
import { causeLabel } from '@/lib/tags';

type EventDetailsProps = {
  description: string;
  causeTags: Cause[];
  // undefined = logged out (never shown); null = signed in, but none was given
  coordinator?: EventFullData['coordinator'];
};

export function EventDetails({ description, causeTags, coordinator }: EventDetailsProps) {
  return (
    <section aria-labelledby="about-heading" className="space-y-6">
      <div>
        <h2 id="about-heading" className="text-2xl font-semibold">
          About this event
        </h2>
        <p className="mt-2 max-w-prose leading-relaxed whitespace-pre-line">{description}</p>
      </div>

      {causeTags.length > 0 && (
        <div>
          <h3 className="font-semibold">Causes</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {causeTags.map((cause) => (
              <li key={cause}>
                <TagChip label={causeLabel(cause)} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {coordinator && (
        <div>
          <h3 className="font-semibold">Questions? Contact the coordinator</h3>
          <ul className="mt-2 space-y-1">
            {/* TODO: add min-h-11 so this row matches the height of the phone/email links below. */}
            <li className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-5 shrink-0" />
              {coordinator.name}
            </li>
            {coordinator.phone && (
              <li>
                <a
                  href={`tel:${coordinator.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4"
                >
                  <Phone aria-hidden="true" className="size-5 shrink-0" />
                  {coordinator.phone}
                </a>
              </li>
            )}
            {coordinator.email && (
              <li>
                {/* TODO: the email goes into mailto: unencoded, so a "?" or "&" would be read as
                    mailto parameters. Make sure the backend validates coordinator emails with
                    emailSchema from @love/validation before saving them. If it does, delete this TODO. */}
                <a
                  href={`mailto:${coordinator.email}`}
                  className="inline-flex min-h-11 items-center gap-2 break-all text-primary underline underline-offset-4"
                >
                  <Mail aria-hidden="true" className="size-5 shrink-0" />
                  {coordinator.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}

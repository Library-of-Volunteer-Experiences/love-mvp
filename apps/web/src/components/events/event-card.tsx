// EventCard: event card for signed-in users (nonprofit name on top, love button)
// Used on: / (feed), /search, /nonprofits/[nonprofit]
// Spec: docs/product/design-inventory.md, "Event card (logged in)"

import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { LoveButton } from '@/components/events/love-button';
import { TagChip } from '@/components/global/tag-chip';
import { formatShift } from '@/lib/format-shift';

export type EventCardRole = { name: string; skillTags: string[] };

export type EventCardData = {
  id: string;
  name: string;
  nonprofit: { slug: string; name: string };
  town: string;
  nextShift: { start: string; end: string }; // ISO 8601 with offset
  moreShiftCount: number;
  roles: EventCardRole[]; // best match first
  causeTags: string[];
  spotsLeft: number;
  loveCount: number;
  lovedByMe: boolean;
};

const MAX_TAGS = 3;
const MAX_ROLES = 2;
const LOW_SPOTS = 5;

export function EventCard({ event }: { event: EventCardData }) {
  const skillTags = [...new Set(event.roles.flatMap((role) => role.skillTags))];
  const tags = [...event.causeTags, ...skillTags];
  const hiddenTagCount = tags.length - MAX_TAGS;
  const hiddenRoleCount = event.roles.length - MAX_ROLES;

  return (
    <article className="relative rounded-xl border border-border bg-card p-5">
      <Link
        href={`/nonprofits/${event.nonprofit.slug}`}
        className="relative z-10 inline-flex min-h-11 items-center text-muted-foreground hover:underline"
      >
        {event.nonprofit.name}
      </Link>

      <h2 className="text-xl font-semibold">
        <Link href={`/events/${event.id}`} className="after:absolute after:inset-0">
          {event.name}
        </Link>
      </h2>

      <div className="mt-3 space-y-2">
        <p className="flex flex-wrap items-center gap-x-2">
          <CalendarDays aria-hidden="true" className="size-5 shrink-0" />
          <time dateTime={event.nextShift.start}>
            {formatShift(event.nextShift.start, event.nextShift.end)}
          </time>
          {event.moreShiftCount > 0 && (
            <span className="text-muted-foreground">+{event.moreShiftCount} more times</span>
          )}
        </p>

        <p className="flex items-center gap-2">
          <MapPin aria-hidden="true" className="size-5 shrink-0" />
          {event.town}
        </p>

        {event.roles.length > 1 && (
          <p>
            <span className="text-muted-foreground">Roles: </span>
            {event.roles
              .slice(0, MAX_ROLES)
              .map((role) => role.name)
              .join(', ')}
            {hiddenRoleCount > 0 && ` +${hiddenRoleCount} more`}
          </p>
        )}
      </div>

      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
          {tags.slice(0, MAX_TAGS).map((tag) => (
            <li key={tag}>
              <TagChip label={tag} />
            </li>
          ))}
          {hiddenTagCount > 0 && (
            <li>
              <TagChip label={`+${hiddenTagCount}`} />
            </li>
          )}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <SpotsLeft count={event.spotsLeft} />
        <LoveButton
          eventName={event.name}
          initialCount={event.loveCount}
          initialLoved={event.lovedByMe}
          className="relative z-10"
        />
      </div>
    </article>
  );
}

function SpotsLeft({ count }: { count: number }) {
  if (count === 0) return <p className="font-semibold">Full</p>;
  const low = count <= LOW_SPOTS;
  return (
    <p className={low ? 'font-semibold text-destructive' : 'text-muted-foreground'}>
      {count} {count === 1 ? 'spot' : 'spots'} left
    </p>
  );
}

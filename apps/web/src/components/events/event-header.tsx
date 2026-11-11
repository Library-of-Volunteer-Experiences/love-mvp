// EventHeader: cover, name, nonprofit + Follow, date, place, love button, member actions
// Used on: /events/[event]
// Spec: docs/product/design-inventory.md, "Event page header"
// Decided: contained, rounded cover; "Open in Google Maps" link instead of a map image.

import Link from 'next/link';
import { CalendarDays, ClipboardList, Heart, MapPin, Pencil } from 'lucide-react';
import type { EventPublicData, VolunteerViewer } from '@/components/events/event-types';
import { LoveButton } from '@/components/events/love-button';
import { CoverImage } from '@/components/global/cover-image';
import { NonprofitAvatar } from '@/components/global/nonprofit-avatar';
import { FollowButton } from '@/components/nonprofits/follow-button';
import { Button } from '@/components/ui/button';
import { formatEventRange } from '@/lib/format-shift';

type EventHeaderProps = {
  event: EventPublicData;
  address: string | null; // null when logged out
  viewer: VolunteerViewer | null; // null when logged out
};

export function EventHeader({ event, address, viewer }: EventHeaderProps) {
  const shifts = event.roles.flatMap((role) => role.shifts);
  const firstStart = shifts.map((shift) => shift.start).sort()[0];

  return (
    <header className="space-y-5">
      <CoverImage src={event.coverUrl} firstCause={event.causeTags[0]} />

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/nonprofits/${event.nonprofit.slug}`}
          className="inline-flex min-h-11 items-center gap-3 font-medium hover:underline"
        >
          <NonprofitAvatar name={event.nonprofit.name} logoUrl={event.nonprofit.logoUrl} />
          {event.nonprofit.name}
        </Link>
        {viewer && (
          <FollowButton
            nonprofitName={event.nonprofit.name}
            initialFollowing={viewer.followingNonprofit}
          />
        )}
      </div>

      <h1 className="font-serif text-4xl tracking-tight italic sm:text-5xl">{event.name}</h1>

      <div className="space-y-2 text-lg">
        {firstStart && (
          <p className="flex items-start gap-2">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-6 shrink-0" />
            <time dateTime={firstStart}>{formatEventRange(shifts)}</time>
          </p>
        )}
        <div className="flex items-start gap-2">
          <MapPin aria-hidden="true" className="mt-0.5 size-6 shrink-0" />
          {address ? (
            <p>
              {address}
              <br />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                className="inline-flex min-h-11 items-center text-base text-primary underline underline-offset-4"
              >
                Open in Google Maps
              </a>
            </p>
          ) : (
            <p>
              {event.town}
              <span className="block text-base text-muted-foreground">
                The full address is shown after you sign in.
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {viewer ? (
          <LoveButton
            eventName={event.name}
            initialCount={event.loveCount}
            initialLoved={viewer.lovedByMe}
            className="border-2 border-border"
          />
        ) : (
          <p className="inline-flex items-center gap-2 text-muted-foreground">
            <Heart aria-hidden="true" className="size-6" />
            {event.loveCount} {event.loveCount === 1 ? 'love' : 'loves'}
          </p>
        )}

        {viewer?.isMember && (
          <>
            <Button variant="outline" asChild>
              <Link href={`/events/${event.id}/edit`}>
                <Pencil aria-hidden="true" />
                Edit event
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/events/${event.id}/signups`}>
                <ClipboardList aria-hidden="true" />
                See sign-ups
              </Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

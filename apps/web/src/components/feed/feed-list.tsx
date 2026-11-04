// FeedList: ranked list of event cards
// Used on: /homepage (logged in)

import { EventCard, type EventCardData } from '@/components/events/event-card';

export function FeedList({ events }: { events: EventCardData[] }) {
  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}

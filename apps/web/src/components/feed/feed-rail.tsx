import type { FeedEvent } from './feed-list';

export function FeedRail({ events }: { events: FeedEvent[] }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-3xl tracking-tight italic xl:mb-6 xl:flex xl:h-9 xl:items-end">
        Your next shift
      </h2>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {events.map((event) => (
          <li key={event.id} className="p-4">
            <p className="font-medium">{event.name}</p>
            <p className="text-muted-foreground">{event.date}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

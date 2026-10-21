// FeedList: ranked list of event cards
// Used on: /homepage (logged in)

export type FeedEvent = {
  id: string;
  name: string;
  nonprofitName: string;
  date: string;
};

export function FeedList({ events }: { events: FeedEvent[] }) {
  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">{event.nonprofitName}</p>
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p>{event.date}</p>
        </li>
      ))}
    </ul>
  );
}

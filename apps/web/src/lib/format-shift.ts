const TIME_ZONE = 'America/New_York';

const dayFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: TIME_ZONE,
});

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});

// "Sat, Nov 8 · 9:00 – 11:00 AM"
export function formatShift(start: string, end: string) {
  const startDate = new Date(start);
  return `${dayFormat.format(startDate)} · ${timeFormat.formatRange(startDate, new Date(end))}`;
}

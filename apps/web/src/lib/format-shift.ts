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

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});

// "Sat, Nov 8 · 9:00 – 11:00 AM"
export function formatShift(start: string, end: string) {
  const startDate = new Date(start);
  return `${dayFormat.format(startDate)} · ${timeFormat.formatRange(startDate, new Date(end))}`;
}

// Whole event, from its first shift's start to its last shift's end:
// "Sat, Jan 16, 9:00 AM – 3:00 PM" or "Sat, Jan 16, 9:00 AM – Sun, Jan 17, 1:00 PM"
export function formatEventRange(shifts: readonly { start: string; end: string }[]) {
  if (shifts.length === 0) return '';
  const starts = shifts.map((shift) => new Date(shift.start).getTime());
  const ends = shifts.map((shift) => new Date(shift.end).getTime());
  return dateTimeFormat.formatRange(Math.min(...starts), Math.max(...ends));
}

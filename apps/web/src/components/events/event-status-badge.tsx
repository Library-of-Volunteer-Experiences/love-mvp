// EventStatusBadge: "Full", "Ended", "X spots left", "You're signed up"
// Used on: role blocks and the event page (cards later)
// Spec: docs/product/design-inventory.md, "Status badges"
// Every badge pairs an icon with text, so the meaning never relies on color alone.

import { Ban, CircleCheck, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const LOW_SPOTS = 5;

export type EventBadgeStatus =
  | { kind: 'ended' }
  | { kind: 'started' }
  | { kind: 'full' }
  | { kind: 'signed-up' }
  | { kind: 'spots'; count: number };

export function EventStatusBadge({ status }: { status: EventBadgeStatus }) {
  const base = 'gap-1.5 px-3 py-1.5 text-base';

  switch (status.kind) {
    case 'ended':
      return (
        <Badge variant="outline" className={cn(base, 'bg-muted text-muted-foreground')}>
          <Clock aria-hidden="true" />
          Ended
        </Badge>
      );
    case 'started':
      return (
        <Badge variant="outline" className={cn(base, 'bg-muted text-muted-foreground')}>
          <Clock aria-hidden="true" />
          Already started
        </Badge>
      );
    case 'full':
      return (
        <Badge variant="outline" className={cn(base, 'border-foreground/40')}>
          <Ban aria-hidden="true" />
          Full
        </Badge>
      );
    case 'signed-up':
      return (
        <Badge
          variant="outline"
          className={cn(base, 'border-success bg-success-soft text-success')}
        >
          <CircleCheck aria-hidden="true" />
          You’re signed up
        </Badge>
      );
    case 'spots': {
      const low = status.count <= LOW_SPOTS;
      return (
        <Badge
          variant="outline"
          className={cn(base, low ? 'border-destructive text-destructive' : 'text-foreground')}
        >
          <Users aria-hidden="true" />
          {status.count} {status.count === 1 ? 'spot' : 'spots'} left
        </Badge>
      );
    }
  }
}

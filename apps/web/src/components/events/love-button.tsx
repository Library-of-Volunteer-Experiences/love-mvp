'use client';

// LoveButton: heart button with public love count
// Used on: event cards, /events/[event]
// Spec: docs/product/design-inventory.md, "Love button ❤️"
// Not saved yet: needs a toggle-love server action (validate → authorize → getBackend()).

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LoveButtonProps = {
  eventName: string; // gives each button on the feed a distinct accessible name
  initialCount: number;
  initialLoved: boolean;
  className?: string;
};

export function LoveButton({ eventName, initialCount, initialLoved, className }: LoveButtonProps) {
  const [loved, setLoved] = useState(initialLoved);
  const [count, setCount] = useState(initialCount);

  function toggle() {
    setLoved(!loved);
    setCount(count + (loved ? -1 : 1));
    // When the server action exists: call it here and roll back on failure.
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={loved}
      onClick={toggle}
      className={cn('rounded-full', className)}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          'size-6 motion-safe:transition-transform motion-safe:active:scale-90',
          loved && 'fill-current text-destructive'
        )}
      />
      <span className="sr-only">Love {eventName}, </span>
      <span>{count}</span>
      <span className="sr-only">{count === 1 ? ' love' : ' loves'}</span>
    </Button>
  );
}

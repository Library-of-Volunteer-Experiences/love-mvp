// CoverImage: an event's cover photo, or the default tinted block (decision G9)
// Used on: /events/[event] (and event cards later)
// Spec: docs/product/design-inventory.md, "Site-wide decisions" G9

import Image from 'next/image';
import type { Cause } from '@love/shared';
import { CAUSE_ICONS, DEFAULT_CAUSE_ICON } from '@/lib/tags';
import { cn } from '@/lib/utils';

type CoverImageProps = {
  src: string | null;
  firstCause: Cause | undefined; // picks the icon for the default cover
  className?: string;
};

// The cover is decorative: the event name is always shown as text beside it,
// so alt is empty and the fallback icon is hidden from screen readers.
export function CoverImage({ src, firstCause, className }: CoverImageProps) {
  // Lucide icons are module-level components, so picking one from a static map is safe.
  const Icon = firstCause ? CAUSE_ICONS[firstCause] : DEFAULT_CAUSE_ICON;

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-xl bg-accent sm:aspect-21/9',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-primary/70">
          <Icon aria-hidden="true" className="size-16 sm:size-20" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

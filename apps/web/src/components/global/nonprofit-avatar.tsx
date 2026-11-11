// NonprofitAvatar: a nonprofit's logo, or a circle with its initials (decision G10)
// Used on: /events/[event] (and nonprofit pages/cards later)
// Spec: docs/product/design-inventory.md, "Site-wide decisions" G10

import Image from 'next/image';
import { cn } from '@/lib/utils';

const SKIP_WORDS = new Set(['the', 'of', 'for', 'and', 'a', 'an', 'in']);

export function initialsFor(name: string): string {
  const words = name.split(/\s+/).filter((word) => word && !SKIP_WORDS.has(word.toLowerCase()));
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

type NonprofitAvatarProps = {
  name: string;
  logoUrl: string | null;
  className?: string;
};

// Decorative: always shown next to the nonprofit's name in text.
export function NonprofitAvatar({ name, logoUrl, className }: NonprofitAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-secondary-foreground',
        className
      )}
    >
      {logoUrl ? (
        <Image src={logoUrl} alt="" fill sizes="44px" className="object-cover" />
      ) : (
        initialsFor(name)
      )}
    </span>
  );
}

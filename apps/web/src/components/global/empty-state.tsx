// EmptyState: friendly "nothing here" message with an optional next step
// Used on: feed, My sign-ups, Following, notifications, 404
// Spec: docs/product/design-inventory.md, "Shared feedback pieces" (icon only, no illustration)

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode; // e.g. a <Button asChild><Link/></Button>
  headingLevel?: 'h1' | 'h2';
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  headingLevel = 'h2',
  className,
}: EmptyStateProps) {
  const Heading = headingLevel;
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-12 text-center',
        className
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
        <Icon aria-hidden="true" className="size-8" />
      </span>
      <Heading className="mt-4 text-2xl font-semibold">{title}</Heading>
      {description && <p className="mt-2 max-w-prose text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

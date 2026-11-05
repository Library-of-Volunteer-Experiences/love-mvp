// TagChip: display-only cause or skill tag
// Used on: event cards, event page, nonprofit page
// Spec: docs/product/design-inventory.md, "Shared feedback pieces"
// Not built yet.

import { Badge } from '@/components/ui/badge';

export function TagChip({ label }: { label: string }) {
  return (
    <Badge variant="secondary" className="text-base font-medium">
      {label}
    </Badge>
  );
}

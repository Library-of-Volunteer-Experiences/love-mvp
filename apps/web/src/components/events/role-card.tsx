// RoleCard: one role on the event page (name, summary, skills, spots, Learn more)
// Used on: /events/[event]
// Spec: docs/product/design-inventory.md, "Role block"
// Decided: shifts are listed only in the "Learn more" popup, to keep the page short.

import type { RoleData } from '@/components/events/event-types';
import { EventStatusBadge, type EventBadgeStatus } from '@/components/events/event-status-badge';
import { TagChip } from '@/components/global/tag-chip';
import { Button } from '@/components/ui/button';
import { roleHasEnded, roleOpenSpots } from '@/lib/event-status';
import { skillLabel } from '@/lib/tags';

type RoleCardProps = {
  role: RoleData;
  now: number;
  signedUpHere?: boolean;
  onLearnMore?: () => void; // omitted on the logged-out page
};

export function roleBadgeStatus(
  role: RoleData,
  now: number,
  signedUpHere: boolean
): EventBadgeStatus {
  if (signedUpHere) return { kind: 'signed-up' };
  if (roleHasEnded(role, now)) return { kind: 'ended' };
  const spots = roleOpenSpots(role, now);
  return spots === 0 ? { kind: 'full' } : { kind: 'spots', count: spots };
}

export function RoleCard({ role, now, signedUpHere = false, onLearnMore }: RoleCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{role.name}</h3>
        <p>{role.summary}</p>
        {role.skillTags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label={`Skills for ${role.name}`}>
            {role.skillTags.map((skill) => (
              <li key={skill}>
                <TagChip label={skillLabel(skill)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
        <EventStatusBadge status={roleBadgeStatus(role, now, signedUpHere)} />
        {onLearnMore && (
          <Button variant="outline" onClick={onLearnMore}>
            Learn more<span className="sr-only"> about {role.name}</span>
          </Button>
        )}
      </div>
    </article>
  );
}

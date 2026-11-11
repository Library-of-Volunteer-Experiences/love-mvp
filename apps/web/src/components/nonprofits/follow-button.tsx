'use client';

// FollowButton: Follow / Following toggle for a nonprofit
// Used on: /events/[event] (nonprofit page and nonprofit card later)
// Spec: docs/product/design-inventory.md, "Follow button"
// Decided: shows "Following ✓" when on; no hover-swap to "Unfollow", since hover
// doesn't exist on phones and changing text under the pointer is confusing.
// Not saved yet: needs a Convex toggle-follow mutation.

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FollowButtonProps = {
  nonprofitName: string;
  initialFollowing: boolean;
};

export function FollowButton({ nonprofitName, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);

  return (
    <Button
      variant={following ? 'secondary' : 'outline'}
      size="sm"
      aria-pressed={following}
      onClick={() => setFollowing(!following)}
    >
      {following ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
      {following ? 'Following' : 'Follow'}
      <span className="sr-only"> {nonprofitName}</span>
    </Button>
  );
}

// SkipStepLink: light-grey "Skip this step →" link
// Used on: /onboarding
// Spec: docs/product/design-inventory.md, ""Skip this step →" link"
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Looks like a link, but it's a <button>: skipping changes the step in place
// rather than navigating to a new URL.
export function SkipStepLink({ onSkip }: { onSkip: () => void }) {
  return (
    <Button
      variant="link"
      onClick={onSkip}
      className="text-muted-foreground no-underline hover:text-foreground hover:underline"
    >
      Skip this step
      <ArrowRight className="size-4" aria-hidden="true" />
    </Button>
  );
}

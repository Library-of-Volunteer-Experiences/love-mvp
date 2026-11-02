// ToggleTile: large tappable tile that turns on/off (icon + label + checkmark)
// Used on: CausePicker, AvailabilityPicker
// Spec: docs/product/design-inventory.md, "Cause tile grid"
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToggleTileProps = {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onToggle: () => void;
};

export function ToggleTile({ label, icon: Icon, selected, onToggle }: ToggleTileProps) {
  return (
    <button
      type="button"
      // aria-pressed makes screen readers say "selected" / "not selected".
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center text-base font-medium transition-colors outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Icon className="size-8" aria-hidden="true" />
      {label}
      {/* The checkmark means "selected" doesn't rely on color alone. */}
      {selected ? <Check className="absolute top-2 right-2 size-5" aria-hidden="true" /> : null}
    </button>
  );
}

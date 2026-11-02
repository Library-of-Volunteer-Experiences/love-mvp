// DistancePicker: how far they'll travel (5 mi / 15 mi / anywhere)
// Used on: /onboarding, /settings, filter sidebar
// Spec: docs/product/design-inventory.md, "Distance picker"
import { useId } from 'react';
import { Check } from 'lucide-react';
import { DISTANCE_OPTIONS, type DistanceOption } from '@love/shared';
import { cn } from '@/lib/utils';

type DistancePickerProps = {
  /** null = nothing picked yet */
  value: DistanceOption | null;
  onChange: (value: DistanceOption) => void;
  legend?: string;
  /** Hide the legend visually (still read by screen readers), e.g. when a page heading already asks. */
  hideLegend?: boolean;
};

// Only one distance can be chosen, so this is a real radio group (arrow keys move
// between options) styled to look like the other buttons.
export function DistancePicker({
  value,
  onChange,
  legend = 'How far will you travel?',
  hideLegend = false,
}: DistancePickerProps) {
  const name = useId();

  return (
    <fieldset>
      <legend className={cn('mb-4 text-lg font-medium', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {DISTANCE_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-5 text-base font-medium transition-colors',
                'has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background',
                checked
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {checked ? <Check className="size-5" aria-hidden="true" /> : null}
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// AvailabilityPicker: usual free times (weekday mornings/afternoons/evenings, weekends)
// Used on: /onboarding, /settings
// Spec: docs/product/design-inventory.md, "Free-times grid"
import { CalendarDays, Moon, Sun, Sunrise, type LucideIcon } from 'lucide-react';
import { FREE_TIMES, type FreeTime } from '@love/shared';
import { cn, toggleValue } from '@/lib/utils';
import { ToggleTile } from '@/components/onboarding/OnboardingStep/toggle-tile';

const FREE_TIME_ICONS: Record<FreeTime, LucideIcon> = {
  weekday_mornings: Sunrise,
  weekday_afternoons: Sun,
  weekday_evenings: Moon,
  weekends: CalendarDays,
};

type AvailabilityPickerProps = {
  value: FreeTime[];
  onChange: (value: FreeTime[]) => void;
  legend?: string;
  /** Hide the legend visually (still read by screen readers), e.g. when a page heading already asks. */
  hideLegend?: boolean;
};

export function AvailabilityPicker({
  value,
  onChange,
  legend = 'When are you usually free?',
  hideLegend = false,
}: AvailabilityPickerProps) {
  return (
    <fieldset>
      <legend className={cn('mb-4 text-lg font-medium', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="grid grid-cols-2 gap-3">
        {FREE_TIMES.map((time) => (
          <ToggleTile
            key={time.value}
            label={time.label}
            icon={FREE_TIME_ICONS[time.value]}
            selected={value.includes(time.value)}
            onToggle={() => onChange(toggleValue(value, time.value))}
          />
        ))}
      </div>
    </fieldset>
  );
}

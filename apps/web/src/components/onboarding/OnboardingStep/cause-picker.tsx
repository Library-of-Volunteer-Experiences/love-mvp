// CausePicker: large tappable cause tiles
// Used on: /onboarding, /settings
// Spec: docs/product/design-inventory.md, "Cause tile grid"
import {
  GraduationCap,
  Hammer,
  HeartHandshake,
  LifeBuoy,
  Medal,
  Palette,
  PartyPopper,
  PawPrint,
  Stethoscope,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { CAUSES, type Cause } from '@love/shared';
import { cn, toggleValue } from '@/lib/utils';
import { ToggleTile } from '@/components/onboarding/OnboardingStep/toggle-tile';

const CAUSE_ICONS: Record<Cause, LucideIcon> = {
  food_hunger: UtensilsCrossed,
  seniors: HeartHandshake,
  kids_education: GraduationCap,
  animals: PawPrint,
  outdoors: Trees,
  housing_repair: Hammer,
  health: Stethoscope,
  arts_culture: Palette,
  community_events: PartyPopper,
  veterans: Medal,
  disaster_relief: LifeBuoy,
};

type CausePickerProps = {
  value: Cause[];
  onChange: (value: Cause[]) => void;
  legend?: string;
  /** Hide the legend visually (still read by screen readers), e.g. when a page heading already asks. */
  hideLegend?: boolean;
};

export function CausePicker({
  value,
  onChange,
  legend = 'Causes you care about',
  hideLegend = false,
}: CausePickerProps) {
  return (
    <fieldset>
      <legend className={cn('mb-4 text-lg font-medium', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CAUSES.map((cause) => (
          <ToggleTile
            key={cause.value}
            label={cause.label}
            icon={CAUSE_ICONS[cause.value]}
            selected={value.includes(cause.value)}
            onToggle={() => onChange(toggleValue(value, cause.value))}
          />
        ))}
      </div>
    </fieldset>
  );
}

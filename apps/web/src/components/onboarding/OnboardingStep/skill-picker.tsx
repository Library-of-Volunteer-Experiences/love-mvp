// SkillPicker: tappable skill chips
// Used on: /onboarding, /settings, event form
// Spec: docs/product/design-inventory.md, "Skill chips"
import { Check } from 'lucide-react';
import { SKILLS, type Skill } from '@love/shared';
import { cn, toggleValue } from '@/lib/utils';

type SkillPickerProps = {
  value: Skill[];
  onChange: (value: Skill[]) => void;
  legend?: string;
  /** Hide the legend visually (still read by screen readers), e.g. when a page heading already asks. */
  hideLegend?: boolean;
};

export function SkillPicker({
  value,
  onChange,
  legend = 'Skills',
  hideLegend = false,
}: SkillPickerProps) {
  return (
    <fieldset>
      <legend className={cn('mb-4 text-lg font-medium', hideLegend && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {SKILLS.map((skill) => {
          const selected = value.includes(skill.value);
          return (
            <button
              key={skill.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(toggleValue(value, skill.value))}
              className={cn(
                'inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 text-base font-medium transition-colors outline-none',
                'focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {selected ? <Check className="size-5" aria-hidden="true" /> : null}
              {skill.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

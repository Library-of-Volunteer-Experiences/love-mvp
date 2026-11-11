// Display labels and icons for the shared cause/skill tag lists in @love/shared.
// Data stores the `value` (e.g. 'food_hunger'); people see the `label`.

import {
  BookOpen,
  Flag,
  Hammer,
  HandHeart,
  HeartHandshake,
  LifeBuoy,
  Palette,
  PartyPopper,
  PawPrint,
  Stethoscope,
  Trees,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { CAUSES, SKILLS, type Cause, type Skill } from '@love/shared';

const causeLabels = new Map<string, string>(CAUSES.map((cause) => [cause.value, cause.label]));
const skillLabels = new Map<string, string>(SKILLS.map((skill) => [skill.value, skill.label]));

export function causeLabel(value: Cause): string {
  return causeLabels.get(value) ?? value;
}

export function skillLabel(value: Skill): string {
  return skillLabels.get(value) ?? value;
}

export const CAUSE_ICONS: Record<Cause, LucideIcon> = {
  food_hunger: Utensils,
  seniors: HandHeart,
  kids_education: BookOpen,
  animals: PawPrint,
  outdoors: Trees,
  housing_repair: Hammer,
  health: Stethoscope,
  arts_culture: Palette,
  community_events: PartyPopper,
  veterans: Flag,
  disaster_relief: LifeBuoy,
};

/** Used by the default cover (G9) when an event has no cause tags. */
export const DEFAULT_CAUSE_ICON: LucideIcon = HeartHandshake;

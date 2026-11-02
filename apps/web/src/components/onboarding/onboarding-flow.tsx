// OnboardingFlow: steps through the onboarding questions and holds the answers
// Used on: /onboarding
// Spec: docs/product/user-flows.md (Part 3)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Cause, DistanceOption, FreeTime, Skill } from '@love/shared';
import { AddressInput } from '@/components/onboarding/OnboardingStep/address-input';
import { AvailabilityPicker } from '@/components/onboarding/OnboardingStep/availability-picker';
import { CausePicker } from '@/components/onboarding/OnboardingStep/cause-picker';
import { DistancePicker } from '@/components/onboarding/OnboardingStep/distance-picker';
import { OnboardingStep } from '@/components/onboarding/onboarding-step';
import { SkillPicker } from '@/components/onboarding/OnboardingStep/skill-picker';

type OnboardingStepCopy = { title: string; description?: string };

type OnboardingAnswers = {
  causes: Cause[];
  skills: Skill[];
  freeTimes: FreeTime[];
  distance: DistanceOption | null;
  address: string;
};

const STEPS: readonly [OnboardingStepCopy, ...OnboardingStepCopy[]] = [
  { title: 'What do you care about?', description: 'Tap as many as you like.' },
  { title: 'What are you good at or happy to do?', description: 'Tap as many as you like.' },
  { title: 'When are you usually free, and how far will you go?' },
  { title: "What's your address? (optional)" },
];

const EMPTY_ANSWERS: OnboardingAnswers = {
  causes: [],
  skills: [],
  freeTimes: [],
  distance: null,
  address: '',
};

export function OnboardingFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ANSWERS);
  const current = STEPS[stepIndex] ?? STEPS[0];

  function update<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // TODO: save answers (validate → authorize → getBackend()) once the backend exists.
      // /homepage is the signed-in feed for now; the spec's target is `/`.
      router.push('/homepage');
    }
  }

  function renderStepBody() {
    switch (stepIndex) {
      case 0:
        return (
          <CausePicker value={answers.causes} onChange={(v) => update('causes', v)} hideLegend />
        );
      case 1:
        return (
          <SkillPicker value={answers.skills} onChange={(v) => update('skills', v)} hideLegend />
        );
      case 2:
        return (
          <div className="space-y-8">
            <AvailabilityPicker
              value={answers.freeTimes}
              onChange={(v) => update('freeTimes', v)}
            />
            <DistancePicker value={answers.distance} onChange={(v) => update('distance', v)} />
          </div>
        );
      default:
        return <AddressInput value={answers.address} onChange={(v) => update('address', v)} />;
    }
  }

  return (
    <OnboardingStep
      step={stepIndex + 1}
      totalSteps={STEPS.length}
      title={current.title}
      description={current.description}
      onBack={stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : undefined}
      onNext={goNext}
      onSkip={goNext}
    >
      {renderStepBody()}
    </OnboardingStep>
  );
}

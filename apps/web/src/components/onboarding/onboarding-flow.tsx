// OnboardingFlow: steps through the onboarding questions and holds the answers
// Used on: /onboarding
// Spec: docs/product/user-flows.md (Part 3)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStep } from '@/components/onboarding/onboarding-step';

type OnboardingStepCopy = { title: string; description?: string };

const STEPS: readonly [OnboardingStepCopy, ...OnboardingStepCopy[]] = [
  { title: 'What do you care about?', description: 'Tap as many as you like.' },
  { title: 'What are you good at or happy to do?', description: 'Tap as many as you like.' },
  { title: 'When are you usually free, and how far will you go?' },
  {
    title: "What's your address? (optional)",
    description: "We only use it to find events near you. It's never shown to anyone.",
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const current = STEPS[stepIndex] ?? STEPS[0];

  function goNext() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // TODO: save answers (validate → authorize → getBackend()) once the backend exists.
      // /homepage is the signed-in feed for now; the spec's target is `/`.
      router.push('/homepage');
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
      {/* Pickers (CausePicker, SkillPicker, …) go here as they're built. */}
      <p className="rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground">
        Step {stepIndex + 1} options coming soon
      </p>
    </OnboardingStep>
  );
}

// OnboardingStep: one step: question, progress indicator, Back/Next
// Used on: /onboarding
// Spec: docs/product/design-inventory.md, "Step layout + progress indicator"
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkipStepLink } from '@/components/onboarding/skip-step-link';

type OnboardingStepProps = {
  /** 1-based step number */
  step: number;
  totalSteps: number;
  /** The question, e.g. "What do you care about?" */
  title: string;
  description?: string;
  children: ReactNode;
  /** Omit on the first step to hide Back. */
  onBack?: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export function OnboardingStep({
  step,
  totalSteps,
  title,
  description,
  children,
  onBack,
  onNext,
  onSkip,
}: OnboardingStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);
  const isLastStep = step === totalSteps;

  // When the step changes, move focus to the new question so screen readers
  // announce it. Skip the first render so we don't steal focus on page load.
  useEffect(() => {
    if (hasMounted.current) {
      headingRef.current?.focus();
    } else {
      hasMounted.current = true;
    }
  }, [step]);

  return (
    <section aria-labelledby="onboarding-step-title" className="flex flex-col gap-8">
      <p className="text-base font-medium text-muted-foreground">
        Step {step} of {totalSteps}
      </p>

      <div className="space-y-3">
        <h1
          id="onboarding-step-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold text-foreground outline-none"
        >
          {title}
        </h1>
        {description ? <p className="text-lg text-muted-foreground">{description}</p> : null}
      </div>

      <div>{children}</div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {onBack ? (
          <Button variant="outline" size="lg" onClick={onBack}>
            <ArrowLeft className="size-5" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span className="hidden sm:block" aria-hidden="true" />
        )}
        <Button size="lg" onClick={onNext}>
          {isLastStep ? 'Finish' : 'Next'}
          {isLastStep ? (
            <Check className="size-5" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      <div className="flex justify-center">
        <SkipStepLink onSkip={onSkip} />
      </div>
    </section>
  );
}

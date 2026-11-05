// Page: /onboarding: onboarding steps (logged in)
// Spec: docs/product/pages.md and docs/product/user-flows.md (Part 3)
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';

export const metadata = {
  title: 'Get started',
  description: 'Tell LOVE what you care about so we can show you the right events.',
};

export default function OnboardingPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen justify-center bg-background px-4 py-12 text-foreground"
    >
      <div className="w-full max-w-2xl">
        <OnboardingFlow />
      </div>
    </main>
  );
}

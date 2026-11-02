// Hero: headline with the big "Sign up to volunteer" button
// Used on: / (logged out)
// Spec: docs/product/design-inventory.md, "Hero section"
// Not built yet.

import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Background video and dimming overlay are decorative, so they are hidden from assistive tech.

function HeroVideo() {
  return (
    <video
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      //poster="/hero-poster.jpg"
      className="absolute inset-0 -z-20 size-full object-cover motion-reduce:hidden"
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}

function HeroOverlay() {
  return <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-950/50" />;
}

function HeroHeadline() {
  // One h1 so screen readers announce the full headline once.
  return (
    <h1 className="space-y-2">
      <span className="block text-5xl">Connecting communities</span>
      <span className="block font-serif text-6xl italic sm:text-7xl">with love</span>
    </h1>
  );
}

function SignUpButton() {
  return (
    <Button variant="glass" size="lg" asChild>
      <Link href="/sign_up">Sign up to volunteer</Link>
    </Button>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 text-center text-white">
      <HeroVideo />
      <HeroOverlay />

      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <HeroHeadline />
        <div className="mt-8">
          <SignUpButton />
        </div>
      </div>
    </section>
  );
}

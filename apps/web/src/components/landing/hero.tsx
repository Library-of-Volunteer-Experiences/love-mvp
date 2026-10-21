// Hero: headline with the big "Sign up to volunteer" button
// Used on: / (logged out)
// Spec: docs/product/design-inventory.md, "Hero section"
// Not built yet.

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 text-center text-white">
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

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-950/50" />

      <div className="mx-auto flex max-w-4xl flex-col items-center space-y-2">
        <h1 className="text-5xl">Connecting communities</h1>
        <h1 className="font-serif text-6xl italic sm:text-7xl">with love</h1>
        <div className="mt-6">
          <Button variant="glass" size="lg">
            <a href="/sign_up">Sign up to volunteer</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

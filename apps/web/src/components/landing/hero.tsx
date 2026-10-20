// Hero: headline with the big "Sign up to volunteer" button
// Used on: / (logged out)
// Spec: docs/product/design-inventory.md, "Hero section"
// Not built yet.

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 text-center text-white">
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

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-950/55" />

      <div className="mx-auto max-w-4xl space-y-2">
        <h1 className="text-5xl">Connecting communities</h1>
        <h1 className="font-serif text-6xl italic sm:text-7xl">with love</h1>
        {/* Put the hero's main link or button here. */}
      </div>
    </section>
  );
}

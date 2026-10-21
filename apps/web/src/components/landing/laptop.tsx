// LaptopPreview: CSS laptop mockup walking through the volunteer sign-up flow on desktop
// Used on: / (below the phone walkthrough, large screens only)

'use client';

import { type ComponentType, type ReactNode } from 'react';
import { CircleCheck, Clock3, HeartHandshake, MapPin, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { demoSteps } from './demo-steps';
import { useActiveStep } from './use-active-step';

const opportunities = [
  { name: 'Community Meals', place: 'Blue Ridge', time: 'Sat · 9 AM' },
  { name: 'Reading Buddies', place: 'Mineral Bluff', time: 'Tue · 3 PM' },
  { name: 'Senior Check-ins', place: 'McCaysville', time: 'Thu · 10 AM' },
];

const steps: { title: string; description: string; screen: ComponentType }[] = [
  { ...demoSteps.search, screen: SearchScreen },
  { ...demoSteps.details, screen: DetailsScreen },
  { ...demoSteps.shift, screen: ShiftScreen },
  { ...demoSteps.confirm, screen: ConfirmScreen },
];

function LaptopScreens({ activeStep }: { activeStep: number }) {
  return (
    <>
      {steps.map(({ title, screen: Screen }, i) => (
        <div
          key={title}
          className={cn(
            'absolute inset-0 transition-all duration-500 ease-out motion-reduce:transition-none',
            i === activeStep ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          <Screen />
        </div>
      ))}
    </>
  );
}

function SearchScreen() {
  return (
    <div className="flex h-full gap-4 p-4">
      {/* Filter sidebar */}
      <div className="w-1/4 space-y-2 text-[10px]">
        <p className="font-semibold">Causes</p>
        {['Senior support', 'Food access', 'Youth programs'].map((cause, i) => (
          <p key={cause} className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className={cn(
                'size-2.5 rounded-sm border border-border',
                i === 1 && 'border-primary bg-primary'
              )}
            />
            {cause}
          </p>
        ))}
      </div>
      {/* Results */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground ring-2 ring-primary">
          <Search className="size-3" /> Search opportunities
        </div>
        <div className="grid grid-cols-3 gap-2">
          {opportunities.map(({ name, place, time }, i) => (
            <div
              key={name}
              className={cn(
                'rounded-lg border bg-card p-2',
                i === 0 ? 'border-primary' : 'border-border'
              )}
            >
              <div className="mb-1.5 h-8 rounded bg-primary/10" />
              <p className="text-[10px] font-semibold">{name}</p>
              <p className="text-[9px] text-muted-foreground">
                {place} · {time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailsScreen() {
  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex-1 space-y-2">
        <div className="flex h-20 items-center justify-center rounded-lg bg-primary/10">
          <HeartHandshake className="size-8 text-primary" />
        </div>
        <p className="text-sm font-bold">Community Meals</p>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Help prepare and serve a hot meal for neighbors. No experience needed.
        </p>
      </div>
      <div className="w-2/5 space-y-1.5 rounded-lg border border-border bg-card p-3 text-[10px] text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3 text-primary" /> Blue Ridge Community Center
        </p>
        <p className="flex items-center gap-1.5">
          <Clock3 className="size-3 text-primary" /> Saturdays · 9 AM – 1 PM
        </p>
        <p className="flex items-center gap-1.5">
          <Users className="size-3 text-primary" /> 3 of 10 spots left
        </p>
        <div className="mt-2 rounded-full bg-primary py-1 text-center font-medium text-primary-foreground">
          Choose a time
        </div>
      </div>
    </div>
  );
}

const shifts = ['Sat, Oct 25', 'Sat, Nov 1', 'Sat, Nov 8', 'Sat, Nov 15'];

function ShiftScreen() {
  return (
    <div className="space-y-3 p-4">
      <p className="text-sm font-bold">Choose a time · Community Meals</p>
      <div className="grid grid-cols-2 gap-2">
        {shifts.map((day, i) => (
          <div
            key={day}
            className={cn(
              'flex items-center justify-between rounded-lg border p-2',
              i === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'
            )}
          >
            <div>
              <p className="text-[10px] font-semibold">{day}</p>
              <p className="text-[9px] text-muted-foreground">9:00 AM – 1:00 PM</p>
            </div>
            {i === 0 && <CircleCheck className="size-3.5 text-primary" />}
          </div>
        ))}
      </div>
      <div className="ml-auto w-1/4 rounded-full bg-primary py-1 text-center text-[10px] font-medium text-primary-foreground">
        Confirm
      </div>
    </div>
  );
}

function ConfirmScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <CircleCheck className="size-10 text-primary" />
      <p className="text-base font-bold">You&apos;re signed up!</p>
      <p className="text-[10px] text-muted-foreground">Community Meals · Sat, Oct 25 · 9 AM</p>
      <div className="mt-1 flex gap-2 text-[10px]">
        <span className="rounded-full border border-border px-3 py-1">Add to calendar</span>
        <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
          View my sign-ups
        </span>
      </div>
    </div>
  );
}

function BrowserBar() {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-muted px-3 py-1.5">
      <span className="flex gap-1">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-yellow-400" />
        <span className="size-2 rounded-full bg-green-400" />
      </span>
      <span className="flex-1 rounded-md bg-background px-2 py-0.5 text-center text-[9px] text-muted-foreground">
        love-volunteer.example
      </span>
    </div>
  );
}

function AppNav() {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <span className="font-serif text-sm italic">LOVE</span>
      <span className="flex gap-4 text-[10px] text-muted-foreground">
        <span>Explore</span>
        <span>My sign-ups</span>
        <span>Nonprofits</span>
      </span>
    </div>
  );
}

// Decorative copy of the UI; the step text beside it carries the meaning for assistive tech.
function LaptopFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('mx-auto w-full', className)}>
      {/* Lid */}
      <div className="relative mx-[6%] rounded-t-2xl bg-neutral-900 p-2.5 pt-5 shadow-2xl ring-1 ring-neutral-700">
        <div className="absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-neutral-600" />
        <div className="flex aspect-16/10 flex-col overflow-hidden rounded-md bg-background text-foreground">
          <BrowserBar />
          <AppNav />
          <div className="relative flex-1">{children}</div>
        </div>
      </div>
      {/* Base */}
      <div className="relative h-3.5 rounded-b-xl bg-linear-to-b from-neutral-300 to-neutral-400 shadow-lg">
        <div className="absolute top-0 left-1/2 h-1.5 w-20 -translate-x-1/2 rounded-b-md bg-neutral-400" />
      </div>
    </div>
  );
}

export function LaptopPreview() {
  const { activeStep, stepRefs } = useActiveStep();

  return (
    <section className="mx-auto hidden max-w-7xl px-8 py-24 lg:block">
      <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
        Prefer a bigger screen?
      </h2>

      <div className="mt-12 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-16">
        <ol>
          {steps.map(({ title, description }, i) => (
            <li
              key={title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={cn(
                'flex min-h-[70vh] flex-col justify-center transition-opacity duration-500',
                i === activeStep ? 'opacity-100' : 'opacity-30'
              )}
            >
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Step {i + 1}
              </p>
              <h3 className="mt-2 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-lg text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>

        <div>
          <div className="sticky top-0 flex h-svh items-center">
            <LaptopFrame>
              <LaptopScreens activeStep={activeStep} />
            </LaptopFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

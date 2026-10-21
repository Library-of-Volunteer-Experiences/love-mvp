// MobilePreview: CSS phone mockup showing a preview of the volunteer app
// Used on: /homepage (below the hero)

'use client';

import {
  BatteryFull,
  ChevronLeft,
  CircleCheck,
  Clock3,
  HeartHandshake,
  MapPin,
  Search,
  Signal,
  Users,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ComponentType, useEffect, useRef, useState } from 'react';

const causes = [
  {
    name: 'Senior support',
    details: 'Friendly visits, transportation help, and community outreach for older adults.',
  },
  {
    name: 'Food access',
    details: 'Meal prep, pantry support, and neighborhood resource coordination.',
  },
  {
    name: 'Youth programs',
    details: 'Tutoring, mentoring, and event support for families across Fannin County.',
  },
];

// Phone frame drawn in CSS with a phone-sized preview of the volunteer UI inside.
// Decorative copy of the real UI, so it is hidden from assistive tech and described by the caption.

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <Signal className="size-3.5" />
        <Wifi className="size-3.5" />
        <BatteryFull className="size-4" />
      </span>
    </div>
  );
}

function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative mx-auto aspect-9/18 w-full max-w-75 rounded-[3rem] border-10 border-neutral-900 bg-neutral-900 shadow-2xl ring-1 ring-neutral-700',
        className
      )}
    >
      <div className="absolute top-2 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] bg-background text-foreground">
        <StatusBar />
        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="space-y-4 overflow-hidden px-4 pt-4">
      <div>
        <p className="text-xs text-muted-foreground">Good morning</p>
        <p className="font-serif text-lg tracking-tight italic">Find a way to help</p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
        <Search className="size-3.5" />
        <span>Search opportunities</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground">Featured opportunity</p>
            <p className="text-sm font-semibold">Community Meals</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            3 spots left
          </span>
        </div>
        <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3 text-primary" />
            Blue Ridge Community Center
          </p>
          <p className="flex items-center gap-1.5">
            <Clock3 className="size-3 text-primary" />
            Saturday · 9:00 AM – 1:00 PM
          </p>
        </div>
        <div className="mt-3 rounded-full bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground">
          Sign up
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold">Popular causes</p>
        {causes.map(({ name, details }) => (
          <div key={name} className="rounded-xl border border-border bg-card p-2.5">
            <p className="text-xs font-semibold">{name}</p>
            <p className="line-clamp-1 text-[10px] text-muted-foreground">{details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailScreen() {
  return (
    <div className="space-y-3 px-4 pt-2">
      <ChevronLeft className="size-5 text-muted-foreground" />
      <div className="flex h-24 items-center justify-center rounded-2xl bg-primary/10">
        <HeartHandshake className="size-10 text-primary" />
      </div>
      <div>
        <p className="text-base font-bold">Community Meals</p>
        <p className="text-[11px] text-muted-foreground">Fannin County Food Pantry</p>
      </div>
      <div className="space-y-1.5 text-[11px] text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3 text-primary" /> Blue Ridge Community Center
        </p>
        <p className="flex items-center gap-1.5">
          <Clock3 className="size-3 text-primary" /> Saturdays · 9:00 AM – 1:00 PM
        </p>
        <p className="flex items-center gap-1.5">
          <Users className="size-3 text-primary" /> 3 of 10 spots left
        </p>
      </div>
      <p className="text-[11px] leading-relaxed">
        Help prepare and serve a hot meal for neighbors. No experience needed.
      </p>
      <div className="rounded-full bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground">
        Choose a time
      </div>
    </div>
  );
}

const shifts = ['Sat, Oct 25', 'Sat, Nov 1', 'Sat, Nov 8'];

function ShiftScreen() {
  return (
    <div className="space-y-3 px-4 pt-2">
      <ChevronLeft className="size-5 text-muted-foreground" />
      <p className="text-base font-bold">Choose a time</p>
      {shifts.map((day, i) => (
        <div
          key={day}
          className={cn(
            'flex items-center justify-between rounded-xl border p-3',
            i === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'
          )}
        >
          <div>
            <p className="text-xs font-semibold">{day}</p>
            <p className="text-[10px] text-muted-foreground">9:00 AM – 1:00 PM</p>
          </div>
          {i === 0 && <CircleCheck className="size-4 text-primary" />}
        </div>
      ))}
      <div className="rounded-full bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground">
        Confirm
      </div>
    </div>
  );
}

function ConfirmScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 pb-12 text-center">
      <CircleCheck className="size-14 text-primary" />
      <p className="text-lg font-bold">You&apos;re signed up!</p>
      <p className="text-xs text-muted-foreground">Community Meals · Sat, Oct 25</p>
      <p className="text-[11px] text-muted-foreground">
        We&apos;ll send you a reminder the day before.
      </p>
    </div>
  );
}

const steps: { title: string; description: string; screen: ComponentType }[] = [
  {
    title: 'Find something you care about',
    description: 'Search by cause, place, or time. Opportunities near you show up first.',
    screen: HomeScreen,
  },
  {
    title: 'See the details',
    description:
      'Every opportunity shows where it is, when it happens, and how many spots are left.',
    screen: DetailScreen,
  },
  {
    title: 'Choose a time',
    description: 'Pick the shift that fits your week — one time or every week.',
    screen: ShiftScreen,
  },
  {
    title: "You're signed up",
    description: 'You get a confirmation right away and a reminder before your shift.',
    screen: ConfirmScreen,
  },
];

function PhoneScreens({ activeStep }: { activeStep: number }) {
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

export function MobilePreview() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = stepRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActiveStep(index);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
        Signing up takes four taps
      </h2>

      <div className="mt-12 lg:grid lg:grid-cols-[1fr_300px_1fr] lg:gap-12">
        <ol className="lg:col-span-3 lg:col-start-1 lg:row-start-1">
          {steps.map(({ title, description, screen: Screen }, i) => (
            <li
              key={title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={cn(
                'py-10 transition-opacity duration-500 lg:grid lg:min-h-[70vh] lg:grid-cols-[1fr_300px_1fr] lg:items-center lg:gap-12',
                i === activeStep ? 'lg:opacity-100' : 'lg:opacity-30'
              )}
            >
              <div className="lg:col-start-1 lg:text-right">
                <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 text-2xl font-bold">{title}</h3>
              </div>
              <p className="mt-3 text-lg text-muted-foreground lg:col-start-3 lg:mt-0">
                {description}
              </p>

              {/* Small screens: each step shows its own static phone */}
              <PhoneFrame className="mt-8 max-w-55 lg:hidden">
                <Screen />
              </PhoneFrame>
            </li>
          ))}
        </ol>

        {/* Large screens: one sticky phone, in the middle column, same row as the list */}
        <div className="hidden lg:col-start-2 lg:row-start-1 lg:block">
          <div className="sticky top-0 flex h-svh items-center">
            <PhoneFrame>
              <PhoneScreens activeStep={activeStep} />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

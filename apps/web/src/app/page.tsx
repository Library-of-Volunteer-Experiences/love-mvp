import Navbar from '@/components/global/navbar';
import { Hero } from '@/components/landing/hero';
import { MobilePreview } from '@/components/landing/mobile';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, Clock3, HeartHandshake, MapPin, Search } from 'lucide-react';
import { APP_CLIENT, APP_FULL_NAME } from '@love/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LaptopPreview } from '@/components/landing/laptop';

const steps = [
  {
    icon: Search,
    title: 'Search by interest',
    description: 'Browse opportunities that match your skills, schedule, and service area.',
  },
  {
    icon: CalendarCheck2,
    title: 'Choose a time',
    description: 'Find flexible shifts for one-time help, recurring service, or special projects.',
  },
  {
    icon: HeartHandshake,
    title: 'Make a difference',
    description: 'Connect with trusted nonprofits and start volunteering with confidence.',
  },
];

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

export const metadata = {
  title: 'Volunteer opportunities',
  description: 'Explore local volunteer roles in Fannin County, Georgia.',
};

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 bg-linear-to-b from-black/70 via-black/30 to-transparent">
        <Navbar />
      </header>
      <Hero />
      <MobilePreview />
      <LaptopPreview />
      <section className="mx-auto grid max-w-6xl gap-20 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
        <div className="space-y-8">
          <div className="space-y-5">
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Give your time where it matters most.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {APP_FULL_NAME} helps residents in {APP_CLIENT} find service opportunities that fit
              their skills, schedule, and interests.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign_up">
                Create account
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nonprofits/habitat-for-humanity">Explore nonprofits</Link>
            </Button>
          </div>

          <dl className="grid max-w-xl gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">Local groups</dt>
              <dd className="mt-1 text-3xl font-bold">24+</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Open roles</dt>
              <dd className="mt-1 text-3xl font-bold">86</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Volunteer hours</dt>
              <dd className="mt-1 text-3xl font-bold">1.2k</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Featured opportunity</p>
              <h2 className="text-2xl font-semibold">Community Meals</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              3 spots left
            </span>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="size-5 text-primary" aria-hidden="true" />
              <span>Blue Ridge Community Center</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock3 className="size-5 text-primary" aria-hidden="true" />
              <span>Saturday · 9:00 AM – 1:00 PM</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <HeartHandshake className="size-5 text-primary" aria-hidden="true" />
              <span>Meal prep, setup, and cleanup</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Why volunteers choose it</p>
            <p className="mt-2 text-base font-medium">
              Short shifts, friendly team members, and a direct impact on neighbors in need.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Simple steps to get started</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 pb-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
              Popular causes
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Opportunities your neighbors care about
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {causes.map(({ name, details }) => (
            <Card key={name} className="h-full">
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{details}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock3, MapPin, PhoneCall, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@love/ui';

const nonprofitDirectory: Record<
  string,
  {
    name: string;
    location: string;
    description: string;
    phone: string;
    focus: string[];
    upcoming: { title: string; time: string; location: string }[];
  }
> = {
  'habitat-for-humanity': {
    name: 'Habitat for Humanity',
    location: 'Blue Ridge, GA',
    description:
      'Building strength and stability through affordable housing and hands-on community service for families across the region.',
    phone: '(706) 632-1040',
    focus: ['Home repair', 'Volunteer build days', 'Family support'],
    upcoming: [
      {
        title: 'Saturday housing build',
        time: 'Saturday · 8:30 AM',
        location: 'North Main Worksite',
      },
      {
        title: 'Home repair assistance day',
        time: 'Wednesday · 10:00 AM',
        location: 'Civic Center Annex',
      },
    ],
  },
  'fannin-food-bank': {
    name: 'Fannin Food Bank',
    location: 'Blue Ridge, GA',
    description:
      'Helping neighbors access nutritious food and practical support through community partnerships and pantry programs.',
    phone: '(706) 632-2927',
    focus: ['Food distribution', 'Senior outreach', 'Pantry support'],
    upcoming: [
      { title: 'Produce sorting', time: 'Thursday · 9:00 AM', location: 'Distribution Center' },
      {
        title: 'Senior pantry delivery',
        time: 'Friday · 1:00 PM',
        location: 'Northwest Neighborhoods',
      },
    ],
  },
};

export const metadata = {
  title: 'Nonprofit profile',
  description: 'Learn about local nonprofit opportunities in Fannin County.',
};

export default async function NonprofitPage({
  params,
}: {
  params: Promise<{ nonprofit: string }>;
}) {
  const { nonprofit } = await params;
  const nonprofitRecord = nonprofitDirectory[nonprofit] ?? {
    name: nonprofit
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '),
    location: 'Fannin County, GA',
    description:
      'Local nonprofit organization supporting neighbors through volunteer service, outreach, and community partnerships.',
    phone: '(706) 555-0148',
    focus: ['Community support', 'Volunteer opportunities', 'Local outreach'],
    upcoming: [
      {
        title: 'Community volunteer day',
        time: 'Next Saturday · 9:00 AM',
        location: 'Local service site',
      },
    ],
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <Link
          href="/homepage"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to opportunities
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Verified nonprofit
              </div>
              <div>
                <CardTitle className="text-4xl">{nonprofitRecord.name}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {nonprofitRecord.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-5 text-primary" aria-hidden="true" />
                <span>{nonprofitRecord.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <PhoneCall className="size-5 text-primary" aria-hidden="true" />
                <span>{nonprofitRecord.phone}</span>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.15em] text-primary uppercase">
                  Areas of focus
                </p>
                <div className="flex flex-wrap gap-2">
                  {nonprofitRecord.focus.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming opportunities</CardTitle>
              <CardDescription>Flexible ways to support the mission.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nonprofitRecord.upcoming.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-secondary p-4">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-primary" aria-hidden="true" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Button asChild className="w-full">
                <Link href="/sign_up">Join this nonprofit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

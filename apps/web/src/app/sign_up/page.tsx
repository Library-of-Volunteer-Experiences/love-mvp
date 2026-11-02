import Link from 'next/link';
import { ArrowRight, HeartHandshake, UserRound } from 'lucide-react';
import { APP_NAME } from '@love/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const metadata = {
  title: 'Sign up',
  description: 'Create your LOVE account to start volunteering in Fannin County.',
};

export default function SignUpPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground"
    >
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="hidden border-primary/15 bg-primary/5 lg:flex lg:flex-col lg:justify-between">
          <CardHeader className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                {APP_NAME}
              </p>
              <CardTitle className="mt-3 text-3xl">Start volunteering with confidence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-lg text-muted-foreground">
              Match with nonprofits based on your availability, interests, and skills.
            </p>
            <ul className="space-y-3 text-base text-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2.5 rounded-full bg-primary" aria-hidden="true" />
                Find opportunities close to home
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2.5 rounded-full bg-primary" aria-hidden="true" />
                Choose shifts that fit your schedule
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2.5 rounded-full bg-primary" aria-hidden="true" />
                Support neighbors with meaningful community work
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <UserRound className="size-7" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-3xl">Create your account</CardTitle>
              <CardDescription>
                Tell us a little about yourself so we can match you with the right opportunities.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" aria-label="Create account form">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium text-foreground">
                    First name
                  </label>
                  <Input
                    id="first-name"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Jamie"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <Input
                    id="last-name"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="At least 12 characters"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  I want to volunteer as
                </label>
                <select
                  id="role"
                  name="role"
                  className="flex h-12 w-full rounded-md border-2 border-input bg-background px-4 py-2 text-base text-foreground shadow-xs transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  defaultValue="volunteer"
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="nonprofit">Nonprofit organizer</option>
                </select>
              </div>

              {/* Temporary: no account backend yet, so this just goes to onboarding.
                  Swap back to type="submit" with a server action once sign-up is real. */}
              <Button asChild className="w-full" size="lg">
                <Link href="/onboarding">
                  Create account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </form>

            <p className="pt-2 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/log_in"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

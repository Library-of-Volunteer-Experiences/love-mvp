import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { APP_NAME } from '@love/shared';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@love/ui';

export const metadata = {
  title: 'Log in',
  description: 'Sign in to continue helping in Fannin County.',
};

export default function LogInPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12 text-foreground"
    >
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                {APP_NAME}
              </p>
              <CardTitle className="mt-2 text-3xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to manage your volunteer matches and opportunities.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-5" aria-label="Log in form">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link
                    href="/sign_up"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              <label
                className="flex items-center gap-3 text-sm text-muted-foreground"
                htmlFor="remember-me"
              >
                <input
                  id="remember-me"
                  type="checkbox"
                  className="size-4 rounded border-border text-primary"
                />
                Keep me signed in on this device
              </label>

              <Button type="submit" className="w-full" size="lg">
                Sign in
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              New to {APP_NAME}?{' '}
              <Link
                href="/sign_up"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

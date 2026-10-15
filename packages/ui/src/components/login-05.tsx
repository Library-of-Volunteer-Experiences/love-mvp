import * as React from 'react';
import { Apple, GalleryVerticalEnd, Globe } from 'lucide-react';

import { Button } from '@love/ui/components/button';
import { Input } from '@love/ui/components/input';
import { cn } from '@love/ui/lib/utils';

type Login05Props = Omit<React.ComponentProps<'section'>, 'title'> & {
  action: NonNullable<React.ComponentProps<'form'>['action']>;
  brandName?: string;
  signUpHref?: string;
  termsHref?: string;
  privacyHref?: string;
  appleAction?: React.ComponentProps<'button'>['formAction'];
  googleAction?: React.ComponentProps<'button'>['formAction'];
};

function Login05({
  action,
  appleAction,
  brandName = 'LOVE',
  className,
  googleAction,
  privacyHref,
  signUpHref,
  termsHref,
  ...props
}: Login05Props) {
  const emailId = React.useId();
  const hasProviderActions = appleAction !== undefined || googleAction !== undefined;

  return (
    <section className={cn('mx-auto flex w-full max-w-sm flex-col gap-6', className)} {...props}>
      <form action={action} aria-label="Sign in">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <GalleryVerticalEnd className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Welcome to {brandName}</h1>
            {signUpHref ? (
              <p className="text-center text-base text-muted-foreground">
                Don&apos;t have an account?{' '}
                <a
                  href={signUpHref}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Sign up
                </a>
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label htmlFor={emailId} className="text-base font-medium">
              Email
            </label>
            <Input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>

          {hasProviderActions ? (
            <>
              <div className="relative text-center text-base after:absolute after:inset-x-0 after:top-1/2 after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {appleAction !== undefined ? (
                  <Button type="submit" variant="outline" formAction={appleAction}>
                    <Apple aria-hidden="true" />
                    Apple
                  </Button>
                ) : null}
                {googleAction !== undefined ? (
                  <Button type="submit" variant="outline" formAction={googleAction}>
                    <Globe aria-hidden="true" />
                    Google
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </form>

      {termsHref && privacyHref ? (
        <p className="text-center text-base text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href={termsHref} className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>
          {'/sign_up'}
          and{'/log_in'}
          <a href={privacyHref} className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      ) : null}
    </section>
  );
}

export { Login05 };
export type { Login05Props };

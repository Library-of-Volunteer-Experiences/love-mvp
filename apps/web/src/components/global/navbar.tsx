// Navbar: top bar, with logged-out and logged-in versions
// Used on: every page
// Spec: docs/product/design-inventory.md, "Navbar (logged out) / Navbar (logged in)"
// Not built yet.

import Link from 'next/link';
import { APP_NAME } from '@love/shared';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <div className="relative w-full px-4 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between sm:px-6 lg:px-8">
        <Link href="/homepage" className="font-serif text-3xl tracking-tight text-primary italic">
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/log_in">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign_up">Join now</Link>
          </Button>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm font-medium text-white/80 md:flex"
      >
        <Link href="/homepage" className="hover:text-foreground">
          Home
        </Link>
        <Link href="/nonprofits/habitat-for-humanity" className="hover:text-foreground">
          Nonprofits
        </Link>
        <Link href="/sign_up" className="hover:text-foreground">
          Sign up
        </Link>
      </nav>
    </div>
  );
}

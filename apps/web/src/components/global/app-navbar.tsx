// AppNavbar: top bar for app pages (feed, event pages, …)
// Used on: /homepage, /events/[event]
// Spec: docs/product/design-inventory.md, "Navbar (logged in)"; phone layout is decision G8.
// Still to come: the notification bell (step 7) and the profile dropdown menu.

import Link from 'next/link';
import { Plus, User } from 'lucide-react';
import { APP_NAME } from '@love/shared';
import { DesktopNav } from '@/components/global/desktop-nav';
import { HOME_GRID_COLUMNS } from '@/components/global/home-grid';
import { ADD_NONPROFIT_LINK } from '@/components/global/main-nav-links';
import { MobileMenu } from '@/components/global/mobile-menu';
import { Button } from '@/components/ui/button';

export function AppNavbar({ signedIn = true }: { signedIn?: boolean }) {
  return (
    <header
      className={`flex h-16 items-center justify-between border-b border-border px-4 sm:px-6 lg:grid lg:px-0 ${HOME_GRID_COLUMNS}`}
    >
      {/* Column 1: lines up with the "Your nonprofits" sidebar */}
      <div className="flex h-full items-center lg:border-r lg:border-border lg:bg-muted/40 lg:px-6">
        <Link
          href={signedIn ? '/homepage' : '/'}
          className="font-serif text-3xl tracking-tight text-primary italic"
        >
          {APP_NAME}
          <span className="sr-only"> home</span>
        </Link>
      </div>

      {signedIn ? (
        <>
          {/* Column 2: lines up with the feed */}
          <div className="hidden md:block lg:col-start-2 lg:row-start-1 lg:px-10">
            <div className="mx-auto w-full max-w-2xl xl:mx-0">
              <DesktopNav />
            </div>
          </div>

          {/* Column 3: lines up with the rail on xl; shares the feed column on lg */}
          <div className="flex items-center gap-3 lg:col-start-2 lg:row-start-1 lg:justify-self-end lg:pr-10 xl:col-start-3 xl:justify-end xl:justify-self-stretch xl:pr-10">
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link href={ADD_NONPROFIT_LINK.href}>
                <Plus aria-hidden="true" />
                {ADD_NONPROFIT_LINK.label}
              </Link>
            </Button>
            <Button size="icon" className="hidden rounded-full md:inline-flex" asChild>
              <Link href="/settings" aria-label="Your profile and settings">
                <User aria-hidden="true" />
              </Link>
            </Button>
            <MobileMenu />
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 lg:col-start-2 lg:row-start-1 lg:justify-self-end lg:pr-10 xl:col-start-3 xl:justify-end xl:justify-self-stretch xl:pr-10">
          <Button variant="outline" asChild>
            <Link href="/log_in">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign_up">Sign up</Link>
          </Button>
        </div>
      )}
    </header>
  );
}

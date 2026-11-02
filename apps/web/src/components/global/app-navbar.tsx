import Link from 'next/link';
import { APP_NAME } from '@love/shared';
import { Button } from '@/components/ui/button';
import { HOME_GRID_COLUMNS } from '@/components/global/home-grid';

export function AppNavbar() {
  return (
    <header
      className={`flex h-16 items-center justify-between border-b border-border px-4 sm:px-6 lg:grid lg:px-0 ${HOME_GRID_COLUMNS}`}
    >
      {/* Column 1: lines up with the "Your nonprofits" sidebar */}
      <div className="flex h-full items-center lg:border-r lg:border-border lg:bg-muted/40 lg:px-6">
        <Link href="/homepage" className="font-serif text-3xl tracking-tight text-primary italic">
          {APP_NAME}
        </Link>
      </div>

      {/* Column 2: lines up with the feed */}
      <div className="hidden md:block lg:col-start-2 lg:row-start-1 lg:px-10">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-2xl items-center gap-6 font-medium text-muted-foreground xl:mx-0"
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

      {/* Column 3: lines up with the rail on xl; shares the feed column on lg */}
      <div className="flex items-center gap-3 lg:col-start-2 lg:row-start-1 lg:justify-self-end lg:pr-10 xl:col-start-3 xl:justify-end xl:justify-self-stretch xl:pr-10">
        <Button variant="outline" size="sm" asChild>
          <Link href="/log_in">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/sign_up">Join now</Link>
        </Button>
      </div>
    </header>
  );
}

'use client';

// MobileMenu: labeled "Menu" button that opens a side sheet of large links (decision G8)
// Used on: the signed-in navbar, below the md breakpoint

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Plus } from 'lucide-react';
import { ADD_NONPROFIT_LINK, MAIN_NAV_LINKS } from '@/components/global/main-nav-links';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const MENU_LINKS = [...MAIN_NAV_LINKS, { href: '/settings', label: 'Settings' }];

export function MobileMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <Menu aria-hidden="true" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="right" aria-describedby={undefined}>
        <SheetTitle>Menu</SheetTitle>
        <nav aria-label="Main navigation">
          <ul className="grid gap-1">
            {MENU_LINKS.map((link) => {
              const current = pathname === link.href;
              return (
                <li key={link.href}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'flex min-h-12 items-center rounded-md px-3 text-lg hover:bg-accent',
                        current && 'bg-accent font-semibold'
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
        <SheetClose asChild>
          <Button asChild size="lg" className="mt-2">
            <Link href={ADD_NONPROFIT_LINK.href}>
              <Plus aria-hidden="true" />
              {ADD_NONPROFIT_LINK.label}
            </Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

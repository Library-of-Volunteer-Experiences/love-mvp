'use client';

// DesktopNav: the signed-in links in the navbar (md and up), marking the current page

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_LINKS } from '@/components/global/main-nav-links';
import { cn } from '@/lib/utils';

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-2 font-medium">
        {MAIN_NAV_LINKS.map((link) => {
          const current = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-md px-3 text-muted-foreground hover:text-foreground',
                  current && 'text-foreground underline decoration-2 underline-offset-8'
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

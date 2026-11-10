// Footer: site-wide footer
// Used on: every page
// Spec: docs/product/design-inventory.md, "Footer"
// Decided: "Built for Fannin County" line, main page links, and a help contact.

import Link from 'next/link';
import { APP_CLIENT, APP_FULL_NAME, APP_NAME, SUPPORT_EMAIL } from '@love/shared';

const FOOTER_LINKS = [
  { href: '/homepage', label: 'Home' },
  { href: '/my-signups', label: 'My sign-ups' },
  { href: '/following', label: 'Following' },
  { href: '/nonprofits/new', label: 'Add a nonprofit' },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-3xl tracking-tight text-primary italic">{APP_NAME}</p>
          <p className="mt-2 text-muted-foreground">
            {APP_FULL_NAME}. Built for {APP_CLIENT}.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid gap-1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-semibold">Need help or found a problem?</h2>
          <p className="mt-2 text-muted-foreground">Email us and a person will get back to you.</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-1 inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}

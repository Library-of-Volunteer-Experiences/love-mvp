import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import { APP_CLIENT, APP_FULL_NAME, APP_NAME } from '@love/shared';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_FULL_NAME}`,
    template: `%s | ${APP_NAME}`,
  },
  description: `Connect with volunteer opportunities in ${APP_CLIENT}.`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never disable pinch-zoom: many users rely on it (WCAG 1.4.4).
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // The nonce-based CSP (src/proxy.ts) requires per-request rendering:
  // a statically prerendered page would carry a stale nonce and its
  // scripts would be blocked.
  await connection();

  return (
    <html lang="en">
      <body className="min-h-dvh font-sans">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOVE - Library of Volunteer Experiences',
  description: 'Connect with volunteer opportunities in Fannin County.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

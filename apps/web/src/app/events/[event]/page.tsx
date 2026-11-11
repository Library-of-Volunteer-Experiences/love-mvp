// Page: /events/[event]: event page, limited when logged out, full when logged in
// Spec: docs/product/pages.md and docs/product/user-flows.md (Part 1.2 and Part 5)
//
// Uses FAKE data from lib/fixtures/events.ts until the Convex backend exists
// (that file lists one URL per page state to preview).

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetails } from '@/components/events/event-details';
import { EventHeader } from '@/components/events/event-header';
import { EventSignupSection } from '@/components/events/event-signup-section';
import { LimitedEventNotice } from '@/components/events/limited-event-notice';
import { RoleCard } from '@/components/events/role-card';
import { AppNavbar } from '@/components/global/app-navbar';
import { Footer } from '@/components/global/footer';
import { loadEventPage } from '@/lib/fixtures/events';

export async function generateMetadata({
  params,
}: PageProps<'/events/[event]'>): Promise<Metadata> {
  const { event: id } = await params;
  const loaded = loadEventPage(id);
  return { title: loaded ? loaded.view.event.name : 'Event not found' };
}

export default async function EventPage({ params }: PageProps<'/events/[event]'>) {
  const { event: id } = await params;
  const loaded = loadEventPage(id);
  if (!loaded) notFound();

  const { view, now } = loaded;
  const { event } = view;

  return (
    <>
      <AppNavbar signedIn={view.kind === 'volunteer'} />
      <main id="main-content" className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6">
        {view.kind === 'volunteer' ? (
          <>
            <EventHeader event={view.event} address={view.event.address} viewer={view.viewer} />
            <EventDetails
              description={view.event.description}
              causeTags={view.event.causeTags}
              coordinator={view.event.coordinator}
            />
            <EventSignupSection
              roles={view.event.roles}
              nonprofitName={view.event.nonprofit.name}
              viewer={view.viewer}
              now={now}
            />
          </>
        ) : (
          <>
            <EventHeader event={event} address={null} viewer={null} />
            <EventDetails description={event.description} causeTags={event.causeTags} />
            <section aria-labelledby="roles-heading" className="space-y-4">
              <h2 id="roles-heading" className="text-2xl font-semibold">
                Roles
              </h2>
              <ul className="space-y-4">
                {event.roles.map((role) => (
                  <li key={role.id}>
                    <RoleCard role={role} now={now} />
                  </li>
                ))}
              </ul>
            </section>
            <LimitedEventNotice />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

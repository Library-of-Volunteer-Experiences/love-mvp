import type { Metadata } from 'next';
import { NonprofitSidebar, type NonprofitLink } from '@/components/feed/nonprofit-sidebar';
import type { EventCardData } from '@/components/events/event-card';
import { FeedList } from '@/components/feed/feed-list';
import { FeedRail } from '@/components/feed/feed-rail';
import { AppNavbar } from '@/components/global/app-navbar';
import { HOME_GRID_COLUMNS } from '@/components/global/home-grid';

// Fake EventCardData: varied so every card state shows (low spots, full, many roles/tags)
const feedEvents: EventCardData[] = [
  {
    id: '1',
    name: 'Pantry restocking',
    nonprofit: { slug: 'example-food-pantry', name: 'Example Food Pantry' },
    town: 'Exampleville',
    nextShift: { start: '2026-11-08T09:00:00-05:00', end: '2026-11-08T11:00:00-05:00' },
    moreShiftCount: 3,
    roles: [
      { name: 'Shelf stocker', skillTags: ['Lifting'] },
      { name: 'Driver', skillTags: ['Driving'] },
      { name: 'Greeter', skillTags: ['People skills'] },
    ],
    causeTags: ['Hunger', 'Seniors'],
    spotsLeft: 3,
    loveCount: 12,
  },
  {
    id: '2',
    name: 'Book drive',
    nonprofit: { slug: 'sample-literacy-project', name: 'Sample Literacy Project' },
    town: 'Testburg',
    nextShift: { start: '2026-11-09T13:00:00-05:00', end: '2026-11-09T15:30:00-05:00' },
    moreShiftCount: 0,
    roles: [{ name: 'Book sorter', skillTags: ['Organizing'] }],
    causeTags: ['Education'],
    spotsLeft: 14,
    loveCount: 4,
  },
  {
    id: '3',
    name: 'Animal shelter cleanup',
    nonprofit: { slug: 'test-animal-rescue', name: 'Test Animal Rescue' },
    town: 'Sampletown',
    nextShift: { start: '2026-11-10T10:00:00-05:00', end: '2026-11-10T12:00:00-05:00' },
    moreShiftCount: 1,
    roles: [
      { name: 'Kennel cleaner', skillTags: [] },
      { name: 'Dog walker', skillTags: ['Animal care'] },
    ],
    causeTags: ['Animals'],
    spotsLeft: 0,
    loveCount: 27,
  },
];

// Fake NonprofitLink data
const memberOf: NonprofitLink[] = [{ slug: 'example-food-pantry', name: 'Example Food Pantry' }];

const volunteeringWith: NonprofitLink[] = [
  { slug: 'sample-literacy-project', name: 'Sample Literacy Project' },
  { slug: 'test-animal-rescue', name: 'Test Animal Rescue' },
];

export const metadata: Metadata = { title: 'Home' };

export default function HomepagePage() {
  return (
    <div>
      <AppNavbar />
      <div className={`grid min-h-[calc(100dvh-4rem)] grid-cols-1 ${HOME_GRID_COLUMNS}`}>
        {/* Left: full-height panel with a visible divider */}
        <nav
          aria-label="Your nonprofits"
          className="hidden border-r border-border bg-muted/40 px-6 py-8 lg:block"
        >
          <div className="sticky top-8">
            <NonprofitSidebar memberOf={memberOf} volunteeringWith={volunteeringWith} />
          </div>
        </nav>

        {/* Middle: the feed */}
        <main id="main-content" className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full xl:mx-0">
            <h1 className="mb-6 font-serif text-3xl tracking-tight italic">Your feed</h1>
            <FeedList events={feedEvents} />
          </div>
        </main>

        {/* Right: no border, separated only by the gap */}
        <aside
          aria-label="Important events"
          className="px-4 pb-8 sm:px-6 lg:col-start-2 lg:px-10 xl:col-start-auto xl:px-0 xl:py-8 xl:pr-10 xl:pl-0"
        >
          <div className="mx-auto w-full max-w-2xl xl:max-w-none">
            <FeedRail events={feedEvents} />
          </div>
        </aside>
      </div>
    </div>
  );
}

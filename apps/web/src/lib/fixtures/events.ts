// FAKE data for building the event page before the Convex backend exists.
// Every name, address, email, and phone number here is made up. The 555-01xx
// phone numbers and example.org addresses are reserved for fiction.
//
// Each fixture also fakes *who is looking*, so every page state can be previewed:
//   /events/pantry-restocking       signed in, member of the nonprofit, no phone saved
//   /events/book-drive              signed in, already signed up for a shift
//   /events/animal-shelter-cleanup  signed in, every shift is full
//   /events/harvest-festival        signed in, the event has ended
//   /events/senior-lunch            logged out: the limited version
//
// When Convex is ready, replace loadEventPage() in the page with a query and
// delete this file.

import type {
  EventFullData,
  EventPageView,
  VolunteerViewer,
} from '@/components/events/event-types';

const fakeCoordinator = {
  name: 'Sam Sample',
  email: 'coordinator@example.org',
  phone: '(555) 010-0123',
};

const pantryRestocking: EventFullData = {
  id: 'pantry-restocking',
  name: 'Pantry restocking',
  coverUrl: null,
  nonprofit: { slug: 'example-food-pantry', name: 'Example Food Pantry', logoUrl: null },
  town: 'Exampleville',
  address: '100 Example Street, Exampleville, GA',
  description:
    'Help us get ready for the busiest week of the month. Volunteers unload the delivery truck, check dates, and stock the shelves so families can shop with dignity. No experience needed; we will show you everything when you arrive.',
  causeTags: ['food_hunger', 'seniors'],
  loveCount: 12,
  coordinator: fakeCoordinator,
  roles: [
    {
      id: 'shelf-stocker',
      name: 'Shelf stocker',
      summary: 'Unpack boxes and stock the pantry shelves.',
      description:
        'Unpack donated food, check expiration dates, and put items on the right shelves. You can sit for date-checking if you prefer. Boxes are usually under 20 pounds.',
      timeNeeded: 'About 2 hours',
      skillTags: ['setup_lifting', 'happy_to_help'],
      shifts: [
        {
          id: 'shelf-am',
          start: '2027-01-16T09:00:00-05:00',
          end: '2027-01-16T11:00:00-05:00',
          spotsTotal: 6,
          spotsTaken: 3,
        },
        {
          id: 'shelf-midday',
          start: '2027-01-16T11:00:00-05:00',
          end: '2027-01-16T13:00:00-05:00',
          spotsTotal: 6,
          spotsTaken: 5,
        },
      ],
    },
    {
      id: 'driver',
      name: 'Delivery driver',
      summary: 'Drive food boxes to neighbors who can’t get out.',
      description:
        'Use your own car to deliver about eight boxes to homes nearby. We give you a printed route. You need a valid driver’s license.',
      timeNeeded: 'About 2 hours',
      skillTags: ['driving'],
      shifts: [
        {
          id: 'driver-pm',
          start: '2027-01-16T13:00:00-05:00',
          end: '2027-01-16T15:00:00-05:00',
          spotsTotal: 2,
          spotsTaken: 2,
        },
      ],
    },
    {
      id: 'greeter',
      name: 'Greeter',
      summary: 'Welcome shoppers and help them check in.',
      description:
        'Say hello at the front table, help people sign in, and answer simple questions. A chair is provided. Spanish speakers are especially welcome.',
      timeNeeded: null,
      skillTags: ['spanish', 'happy_to_help'],
      shifts: [
        {
          id: 'greeter-am',
          start: '2027-01-16T09:00:00-05:00',
          end: '2027-01-16T12:00:00-05:00',
          spotsTotal: 4,
          spotsTaken: 0,
        },
      ],
    },
  ],
};

const bookDrive: EventFullData = {
  id: 'book-drive',
  name: 'Book drive',
  coverUrl: null,
  nonprofit: { slug: 'sample-literacy-project', name: 'Sample Literacy Project', logoUrl: null },
  town: 'Testburg',
  address: '200 Sample Avenue, Testburg, GA',
  description:
    'Sort donated children’s books by reading level so they can go home with kids at the spring reading fair.',
  causeTags: ['kids_education'],
  loveCount: 4,
  coordinator: null,
  roles: [
    {
      id: 'book-sorter',
      name: 'Book sorter',
      summary: 'Sort books by reading level.',
      description: 'Sort and box donated books at a table. This is a sitting job.',
      timeNeeded: 'About 2½ hours',
      skillTags: ['teaching', 'happy_to_help'],
      shifts: [
        {
          id: 'sorter-pm',
          start: '2027-01-23T13:00:00-05:00',
          end: '2027-01-23T15:30:00-05:00',
          spotsTotal: 15,
          spotsTaken: 1,
        },
      ],
    },
  ],
};

const animalShelterCleanup: EventFullData = {
  id: 'animal-shelter-cleanup',
  name: 'Animal shelter cleanup',
  coverUrl: null,
  nonprofit: { slug: 'test-animal-rescue', name: 'Test Animal Rescue', logoUrl: null },
  town: 'Sampletown',
  address: '300 Test Road, Sampletown, GA',
  description: 'A deep clean of the kennels and play yard before adoption day.',
  causeTags: ['animals'],
  loveCount: 27,
  coordinator: fakeCoordinator,
  roles: [
    {
      id: 'kennel-cleaner',
      name: 'Kennel cleaner',
      summary: 'Scrub and refresh the kennels.',
      description:
        'Clean kennels, wash bedding, and refill water bowls. Wear clothes that can get wet.',
      timeNeeded: 'About 2 hours',
      skillTags: [],
      shifts: [
        {
          id: 'kennel-am',
          start: '2027-01-30T10:00:00-05:00',
          end: '2027-01-30T12:00:00-05:00',
          spotsTotal: 5,
          spotsTaken: 5,
        },
      ],
    },
    {
      id: 'dog-walker',
      name: 'Dog walker',
      summary: 'Walk the dogs while the kennels are cleaned.',
      description: 'Take one dog at a time on a short walk around the property.',
      timeNeeded: null,
      skillTags: ['happy_to_help'],
      shifts: [
        {
          id: 'walker-am',
          start: '2027-01-30T10:00:00-05:00',
          end: '2027-01-30T12:00:00-05:00',
          spotsTotal: 3,
          spotsTaken: 3,
        },
      ],
    },
  ],
};

const harvestFestival: EventFullData = {
  id: 'harvest-festival',
  name: 'Harvest festival',
  coverUrl: null,
  nonprofit: { slug: 'sample-garden-club', name: 'Sample Garden Club', logoUrl: null },
  town: 'Exampleville',
  address: '400 Example Park Road, Exampleville, GA',
  description: 'Our yearly festival with a plant swap, music, and pie contest.',
  causeTags: ['community_events', 'outdoors'],
  loveCount: 41,
  coordinator: null,
  roles: [
    {
      id: 'booth-helper',
      name: 'Booth helper',
      summary: 'Help run the plant swap table.',
      description: 'Label plants and help visitors find what they are looking for.',
      timeNeeded: 'About 3 hours',
      skillTags: ['gardening'],
      shifts: [
        {
          id: 'booth-am',
          start: '2026-10-17T09:00:00-04:00',
          end: '2026-10-17T12:00:00-04:00',
          spotsTotal: 8,
          spotsTaken: 6,
        },
      ],
    },
  ],
};

const seniorLunch: EventFullData = {
  id: 'senior-lunch',
  name: 'Community lunch for seniors',
  coverUrl: null,
  nonprofit: { slug: 'example-senior-center', name: 'Example Senior Center', logoUrl: null },
  town: 'Testburg',
  address: '500 Sample Lane, Testburg, GA',
  description:
    'Serve a warm lunch and share a conversation with older neighbors at our monthly community meal.',
  causeTags: ['seniors', 'food_hunger'],
  loveCount: 9,
  coordinator: fakeCoordinator,
  roles: [
    {
      id: 'server',
      name: 'Lunch server',
      summary: 'Serve plates and refill drinks.',
      description: 'Carry plates to tables and refill drinks. Light standing work.',
      timeNeeded: 'About 2 hours',
      skillTags: ['cooking', 'happy_to_help'],
      shifts: [
        {
          id: 'server-midday',
          start: '2027-02-06T11:00:00-05:00',
          end: '2027-02-06T13:00:00-05:00',
          spotsTotal: 6,
          spotsTaken: 2,
        },
      ],
    },
    {
      id: 'table-host',
      name: 'Table host',
      summary: 'Sit with guests and keep the conversation going.',
      description: 'Join a table of guests for lunch and conversation. A great fit for anyone.',
      timeNeeded: null,
      skillTags: ['happy_to_help'],
      shifts: [
        {
          id: 'host-midday',
          start: '2027-02-06T11:00:00-05:00',
          end: '2027-02-06T13:00:00-05:00',
          spotsTotal: 4,
          spotsTaken: 3,
        },
      ],
    },
  ],
};

function volunteer(overrides: Partial<VolunteerViewer> = {}): VolunteerViewer {
  return {
    lovedByMe: false,
    followingNonprofit: false,
    isMember: false,
    hasPhone: true,
    signup: null,
    ...overrides,
  };
}

/** Removes the fields a logged-out visitor must never receive. */
function toPublic({ address: _address, coordinator: _coordinator, ...rest }: EventFullData) {
  return rest;
}

const views: Record<string, EventPageView> = {
  'pantry-restocking': {
    kind: 'volunteer',
    event: pantryRestocking,
    viewer: volunteer({ isMember: true, hasPhone: false }),
  },
  'book-drive': {
    kind: 'volunteer',
    event: bookDrive,
    viewer: volunteer({
      lovedByMe: true,
      followingNonprofit: true,
      signup: { shiftId: 'sorter-pm' },
    }),
  },
  'animal-shelter-cleanup': {
    kind: 'volunteer',
    event: animalShelterCleanup,
    viewer: volunteer(),
  },
  'harvest-festival': {
    kind: 'volunteer',
    event: harvestFestival,
    viewer: volunteer({ lovedByMe: true }),
  },
  'senior-lunch': { kind: 'guest', event: toPublic(seniorLunch) },
};

/**
 * Stand-in for the future Convex query. Returns `now` alongside the data so
 * the page and its client components agree on what "past" means.
 */
export function loadEventPage(id: string): { view: EventPageView; now: number } | null {
  const view = views[id];
  return view ? { view, now: Date.now() } : null;
}

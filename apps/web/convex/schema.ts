import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    // these are filled in by Convex Auth automatically
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // these are LOVE's own fields
    isOver13: v.optional(v.boolean()),
    onboarded: v.optional(v.boolean()),
    causes: v.optional(v.array(v.string())),
    skills: v.optional(v.array(v.string())),
    freeTimes: v.optional(v.array(v.string())),
    distance: v.optional(v.union(v.literal('5'), v.literal('15'), v.literal('anywhere'))),
    address: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  }).index('email', ['email']),

  nonprofits: defineTable({
    ein: v.string(),
    slug: v.string(),
    name: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    description: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    logoId: v.optional(v.id('_storage')),
  })
    .index('by_ein', ['ein'])
    .index('by_slug', ['slug'])
    .searchIndex('search_name', { searchField: 'name' }),

  memberships: defineTable({
    nonprofitId: v.id('nonprofits'),
    userId: v.id('users'),
    role: v.union(v.literal('owner'), v.literal('member')),
  })
    .index('by_user', ['userId']) // "my nonprofits"
    .index('by_nonprofit', ['nonprofitId']) // members list
    .index('by_nonprofit_and_user', ['nonprofitId', 'userId']), // "is this person a member?"

  invites: defineTable({
    nonprofitId: v.id('nonprofits'),
    token: v.string(), // the random part of the invite link
    createdBy: v.id('users'),
  })
    .index('by_token', ['token'])
    .index('by_nonprofit', ['nonprofitId']),

  events: defineTable({
    nonprofitId: v.id('nonprofits'),
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    address: v.string(), //this will only be shown to the logged-in users
    town: v.string(), // this will be shown to everyone
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    causes: v.array(v.string()),
    coverId: v.optional(v.id('_storage')),
    coordinator: v.optional(
      v.object({ name: v.string(), phone: v.optional(v.string()), email: v.optional(v.string()) })
    ),
    startTime: v.number(),
    endTime: v.number(),
    loveCount: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_start', ['startTime']) // upcoming events
    .index('by_nonprofit_and_start', ['nonprofitId', 'startTime']) // a nonprofit's events in order
    .searchIndex('search_name', { searchField: 'name' }),

  roles: defineTable({
    eventId: v.id('events'),
    name: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
  }).index('by_event', ['eventId']),

  shifts: defineTable({
    roleId: v.id('roles'),
    eventId: v.id('events'),
    start: v.number(),
    end: v.number(),
    spots: v.number(),
    taken: v.number(), // kept up to date by sign-up / cancel
  })
    .index('by_role', ['roleId'])
    .index('by_event', ['eventId']),

  signups: defineTable({
    userId: v.id('users'),
    eventId: v.id('events'),
    shiftId: v.id('shifts'),
    notes: v.optional(v.string()),
    sharePhone: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_shift', ['shiftId'])
    .index('by_event', ['eventId'])
    .index('by_user_and_event', ['userId', 'eventId']), // "one shift per event" rule

  loves: defineTable({
    userId: v.id('users'),
    eventId: v.id('events'),
  })
    .index('by_user', ['userId'])
    .index('by_event', ['eventId'])
    .index('by_user_and_event', ['userId', 'eventId']),

  follows: defineTable({
    userId: v.id('users'),
    nonprofitId: v.id('nonprofits'),
  })
    .index('by_user', ['userId'])
    .index('by_nonprofit', ['nonprofitId'])
    .index('by_user_and_nonprofit', ['userId', 'nonprofitId']),

  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('event_changed'),
      v.literal('event_cancelled'),
      v.literal('volunteer_cancelled')
    ),
    message: v.string(), // written when created, so it still makes sense if the event is deleted
    eventId: v.optional(v.id('events')),
    read: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_read', ['userId', 'read']), // unread count for the bell
});

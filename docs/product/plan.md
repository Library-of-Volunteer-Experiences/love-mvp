# LOVE: Development Plan (Congressional App Challenge build)

- **Last updated:** 2026-10-24
- **Related:** [MVP requirements](mvp-requirements.md) · [Pages](pages.md) ·
  [User flows](user-flows.md) · [Design inventory](design-inventory.md)

This is the order we build the app in for the Congressional App Challenge (CAC). Each step is one
branch and one PR. Update the **Status** column as steps finish.

---

## 1. Who does what

| Person     | Focus                                                                                  |
| ---------- | -------------------------------------------------------------------------------------- |
| **Apurva** | Functionality: Convex backend, data, login, and working pages with plain (unstyled) UI |
| **Arshia** | UI and design: logged-out home page, navbar/footer, styling the pages after they work  |

**Keeping the work separable:**

- Data logic lives in `apps/web/convex/` (queries, mutations, actions).
- Pages stay simple: they call Convex and show the results.
- That way, Arshia can restyle a page without touching how it works.

## 2. How each step is done

1. Start a branch from the latest `main`:

   ```bash
   git switch main
   git pull
   git switch -c feat/<step-name>
   ```

2. Build the step. Keep `npx convex dev` running in `apps/web` in its own terminal.
3. Check that everything passes:

   ```bash
   npm run lint
   npx turbo run type-check --concurrency=1
   npm run build:web
   ```

4. Commit, push, and open a PR. When checks pass, merge it.
5. Tell the other person to pull `main`.

---

## 3. The steps

| #   | Step                                                      | Branch                  | Status          |
| --- | --------------------------------------------------------- | ----------------------- | --------------- |
| 1   | Connect Convex                                            | `feat/convex-setup`     | **In progress** |
| 2   | Schema (all tables)                                       | `feat/schema`           | Not started     |
| 3   | Seed data + "upcoming events" query                       | `feat/seed-data`        | Not started     |
| 4   | Accounts: sign up / log in                                | `feat/auth`             | Not started     |
| 5   | Onboarding saves preferences                              | `feat/onboarding`       | Not started     |
| 6   | Event page + sign up for a shift + cancel + My sign-ups   | `feat/signups`          | Not started     |
| 7   | Loves + follows + Following page                          | `feat/loves-follows`    | Not started     |
| 8   | Feed scoring + filters + "why you're seeing this"         | `feat/feed`             | Not started     |
| 9   | Create nonprofit (EIN check) + nonprofit page + dashboard | `feat/nonprofits`       | Not started     |
| 10  | Create/edit event + sign-ups page                         | `feat/event-management` | Not started     |
| 11  | Notification bell + triggers                              | `feat/notifications`    | Not started     |
| 12  | Deploy + demo prep                                        | `chore/deploy`          | Not started     |

---

### Step 1: Connect Convex

**Goal:** the web app can talk to Convex.

**What is built:**

- Convex installed in `apps/web`, with `npx convex dev` set up
- `NEXT_PUBLIC_CONVEX_URL` registered in `packages/config/src/env.ts`
- `ConvexProvider` added in `apps/web/src/app/providers.tsx`
- The Convex URL allowed in the security policy (`apps/web/src/proxy.ts`)
- Tooling: the `@/convex/*` path, and lint/Prettier ignoring `convex/_generated`
- A test function `convex/ping.ts` and a test page `/convex-test`

**Convex concepts:** deployment, `npx convex dev`, `ConvexProvider`, `query`, `useQuery`.

**Done when:**

- `/convex-test` shows "Convex is connected!"
- lint, type-check, and build pass

**Before merging:**

- Decide whether to commit the Convex AI files (`apps/web/.agents/`, `apps/web/.claude/`,
  `apps/web/skills-lock.json`).
- Invite Arshia to the Convex project.

**After this step:** delete `ping.ts` and `/convex-test` (in step 2 or 3).

---

### Step 2: Schema

**Goal:** define every table. This is the shape of all the data.

**What is built:** `apps/web/convex/schema.ts` with these tables:

- `users` (via Convex Auth, plus our fields)
- `nonprofits`
- `events`
- `roles`
- `shifts`
- `signups`
- `loves`
- `follows`
- `notifications`

Each table gets indexes for the lookups we need.

**Convex concepts:** `defineSchema`, `defineTable`, validators (`v.string()`, `v.id(...)`, …), indexes.

**Done when:** `npx convex dev` accepts the schema, and the tables appear in the dashboard.

---

### Step 3: Seed data + "upcoming events" query

**Goal:** realistic **fake** data, so pages and the demo video aren't empty, and Arshia can show real
events on the home page.

**What is built:**

- An `internalMutation` that inserts fake nonprofits, events, roles, and shifts
- A query `events.listUpcoming`, which takes the current time as an argument

**Convex concepts:** `ctx.db.insert`, `internalMutation`, `.withIndex()`, `.take()`,
`npx convex run`.

**Done when:**

- Running the seed fills the dashboard with data.
- Arshia's preview cards can use `events.listUpcoming`.

---

### Step 4: Accounts

**Goal:** sign up and log in with email + password, including the 18+ checkbox.

**What is built:**

- Convex Auth setup
- Working `/sign_up` and `/log_in` forms
- Log out
- Signed-in-only pages send logged-out users to log in

**Convex concepts:** Convex Auth, `getAuthUserId`, checking "who is calling" in functions.

**Done when:** you can create an account, log out, log back in, and see your user in the dashboard.

**Open:**

- Route names (Q6): keep `/sign_up` and `/log_in`, or rename?
- Google sign-in is **cut for CAC** (proposed).

---

### Step 5: Onboarding

**Goal:** the 4 skippable steps save the user's causes, skills, free times, distance, and optional
address.

**What is built:**

- The `/onboarding` page with plain UI
- A mutation that saves preferences
- An action that turns an address into coordinates (US Census geocoder)

**Convex concepts:** `mutation`, `ctx.db.patch`, `action`, `fetch` from an action.

**Done when:** after signing up you go through onboarding, and the answers appear on your user in
the dashboard.

**Open:** Q1, whether to add the "task comfort" step.

---

### Step 6: Event page + sign-ups

**Goal:** see an event (full when logged in, limited when logged out), sign up for one shift, and
cancel.

**What is built:**

- `/events/[event]`
- The role "Learn more" popup
- The sign-up popup: shift, notes, phone consent
- `/my-signups`

**Convex concepts:**

- Reading related documents (event → roles → shifts)
- Mutations as transactions
- A stored counter on each shift for spots taken (no counting by `.collect().length`)

**Done when:**

- Signing up reduces spots left.
- A full shift can't be taken.
- Cancelling frees the spot.

---

### Step 7: Loves + follows

**Goal:** a love button with a live public count, a follow button, and the `/following` page.

**Convex concepts:** toggle mutations, a stored `loveCount`, live updates across browser windows.

**Done when:** loving in one window updates the count in another window instantly.

---

### Step 8: Feed

**Goal:** the logged-in home page shows events ranked by the scoring formula
([mvp-requirements §4](mvp-requirements.md#4-feed-and-matching)), with filters.

**What is built:**

- The scoring query: causes, skills, free times, follows, past loves, distance, soon, popular,
  variety
- The filter sidebar: distance, tags, and a search box that filters the feed
- A "why you're seeing this" line on each card

**Convex concepts:** bigger queries, combining data in a query, search index.

**Done when:** different onboarding answers produce a different feed order, and filters work.

---

### Step 9: Nonprofits

**Goal:** the **+** button creates a verified nonprofit; each nonprofit has a public page and a
dashboard.

**What is built:**

- An EIN-check action (ProPublica: the EIN exists, is a 501(c)(3), and isn't already on LOVE)
- `/nonprofits/new`
- `/nonprofits/[nonprofit]` (the public page)
- `/nonprofits/[nonprofit]/manage` (the events list)
- Logo upload

**Convex concepts:** an action calling an outside API, file storage (`generateUploadUrl`), owner
checks.

**Done when:** entering a real 501(c)(3) EIN creates a nonprofit with its official IRS name.

**Open:** which real nonprofit's EIN to use in the demo.

---

### Step 10: Event management

**Goal:** the owner creates and edits events with roles, shifts, and a cover photo, and sees who
signed up.

**What is built:**

- `/nonprofits/[nonprofit]/events/new`
- `/events/[event]/edit`
- `/events/[event]/signups` (phone shown only if the volunteer consented)

**Convex concepts:** multi-table inserts in one mutation, permission checks.

**Done when:** a created event shows up in the feed, and the sign-ups page lists volunteers.

**Rule:** a shift or role that has sign-ups can't be deleted.

---

### Step 11: Notifications

**Goal:** a bell in the navbar shows notifications.

**Triggers:**

- An event a volunteer signed up for is edited
- A volunteer cancels (the owner is notified)

**Convex concepts:** inserting notifications inside existing mutations, a live unread count.

**Done when:** editing an event makes the bell light up for signed-up volunteers.

---

### Step 12: Deploy + demo prep

**What is done:**

- A Convex production deployment
- Vercel with the environment variables
- Seed production with demo data
- A test run, then record the demo video

---

## 4. Convex rules we follow

These come from `apps/web/convex/_generated/ai/guidelines.md` for our Convex version.

1. **Every function has `args` validators,** and every public function checks who is calling before
   it reads private data or changes anything. Never take a user ID as an argument for permission
   checks; get it on the server.
2. **Use `.withIndex()` for lookups,** and `.take(n)` instead of `.collect()` on lists that can grow.
3. **Never count with `.collect().length`.** Store counters (spots taken, love count) and update them
   in the same mutation.
4. **Queries can't read `Date.now()`.** Pass the current time in as an argument.
5. **Edits name the table:** `ctx.db.patch('events', id, {...})` and
   `ctx.db.replace('events', id, doc)`.
6. **Actions have no `ctx.db`.** They call queries and mutations with `ctx.runQuery` and
   `ctx.runMutation`.
7. **Functions only the backend uses** are `internalQuery`, `internalMutation`, or `internalAction`.

---

## 5. Proposed CAC cuts (confirm before relying on them)

These are cut for the CAC build and planned for later:

- Members and invites (owner only)
- Settings page
- Full `/notifications` page
- Separate `/search` page and nonprofit search
- Google sign-in
- Delete event / delete nonprofit / edit nonprofit info
- "Loved by" list
- Past events and past sign-ups sections
- Return-to-page after login
- Coordinator contact
- Dark mode, custom 404, skeletons, toasts

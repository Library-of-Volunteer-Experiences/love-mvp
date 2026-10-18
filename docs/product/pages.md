# LOVE: Pages (MVP)

- **Last updated:** 2026-10-18
- **Related:** [MVP requirements](mvp-requirements.md) · [Design inventory](design-inventory.md)

This file lists every page in the MVP: who can see it, what's on it, and what happens when someone
clicks something.

- **Layout and styling are not decided here.** That's [design-inventory.md](design-inventory.md).
- **Route names are proposals** (see [mvp-requirements Q6](mvp-requirements.md#10-open-questions)).
  Today's code still uses `/sign_up`, `/log_in`, and `/homepage`.
- A route segment in `[brackets]` is a **dynamic route**: one page file serves every event or
  nonprofit, and the bracketed part is the ID in the URL.

---

## Site map

| Route                                | Page                                                     | Who can see it                     |
| ------------------------------------ | -------------------------------------------------------- | ---------------------------------- |
| `/`                                  | Landing page (logged out) **or** Feed (logged in)        | Everyone                           |
| `/signup`                            | Create account                                           | Logged out                         |
| `/login`                             | Log in                                                   | Logged out                         |
| `/onboarding`                        | Onboarding steps                                         | Logged in                          |
| `/events/[event]`                    | Event page: limited (logged out) **or** full (logged in) | Everyone                           |
| `/nonprofits/[nonprofit]`            | Nonprofit page                                           | Everyone                           |
| `/nonprofits/new`                    | Create a nonprofit (the **+** button)                    | Logged in                          |
| `/nonprofits/[nonprofit]/manage`     | Nonprofit dashboard                                      | Members only                       |
| `/nonprofits/[nonprofit]/events/new` | Create event                                             | Members only                       |
| `/events/[event]/edit`               | Edit event                                               | Members of that nonprofit          |
| `/events/[event]/signups`            | Who signed up + who loved it                             | Members of that nonprofit          |
| `/invite/[token]`                    | Accept an invite to join a nonprofit                     | Anyone with the link (must log in) |
| `/my-signups`                        | My sign-ups                                              | Logged in                          |
| `/following`                         | Nonprofits I follow                                      | Logged in                          |
| `/notifications`                     | All notifications                                        | Logged in                          |
| `/search`                            | Search results                                           | Logged in                          |
| `/settings`                          | Profile and preferences                                  | Logged in                          |
| (any unknown URL)                    | Not found                                                | Everyone                           |

**Present on every page:**

- The **navbar**, which differs for logged-out and logged-in users
- The **footer**

---

## `/` Landing page (logged out)

**Purpose:** explain LOVE, show that real opportunities exist, and get people to sign up.

**What they see**

1. **Navbar (logged-out version):** LOVE logo, **Log in**, **Sign up**.
2. **Hero:** a short line about what LOVE is, with a **large "Sign up to volunteer" button**, the
   main call to action on the page.
3. **About LOVE:** a few sentences or steps on how it works.
4. **Open opportunities:** a grid or list of **event preview cards**. Each card shows:
   - event name and cover photo
   - nonprofit name
   - date
   - **city** (no street address)
   - cause tags
   - love count
5. A **repeat of the sign-up prompt** below the cards.
6. **Footer.**

**What they can click**

| Click                             | Result                                         |
| --------------------------------- | ---------------------------------------------- |
| Log in / Sign up (navbar or hero) | Go to `/login` or `/signup`                    |
| A preview card                    | Open `/events/[event]` in its **limited** form |
| The nonprofit name on a card      | Open `/nonprofits/[nonprofit]`                 |
| The ❤️ on a card                  | Prompt: "Sign up to love events"               |

---

## `/` Feed (logged in)

**Purpose:** the user's personal feed of events picked for them, like a social media feed.

**What they see**

1. **Navbar (logged-in version):**
   - logo
   - links: Home, My sign-ups, Following
   - **+** (create a nonprofit)
   - 🔔 notification bell with unread count
   - profile menu
2. **Sidebar:**
   - **search box** (events and nonprofits)
   - **distance** selector
   - **tag filters** (causes, skills)
3. **Feed:** a vertical list of **event cards**, ranked by the scoring rules in
   [mvp-requirements §4](mvp-requirements.md#4-feed-and-matching). Each card shows:
   - **nonprofit name at the top** (like a social media post's author)
   - cover photo
   - event name
   - date and time
   - city / address
   - cause tags
   - "X spots left"
   - **❤️ love button with count**
4. **Empty state** if nothing matches, e.g. "No events match your filters," with a way to clear
   the filters.
5. **Footer.**

**What they can click**

| Click                    | Result                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Nonprofit name on a card | `/nonprofits/[nonprofit]`                                                                     |
| The card itself          | `/events/[event]` (full version)                                                              |
| ❤️                       | Toggles love: count +1/−1 instantly, and the feed learns from it                              |
| Sidebar search (Enter)   | `/search?q=…`                                                                                 |
| Distance / tag filters   | Feed updates in place                                                                         |
| **+**                    | `/nonprofits/new`                                                                             |
| 🔔                       | Dropdown of recent notifications (each links to its event), plus "See all" → `/notifications` |
| Profile menu             | Settings, any nonprofits they belong to (→ their dashboards), Log out                         |

---

## `/signup` Create account

**What they see:**

- Full name, email, password
- **"I am 18 or older"** checkbox (required)
- **Create account** button
- **Continue with Google**
- A link to log in instead

**Behavior**

- **Errors** appear next to the field they belong to, in plain language ("Password must be at
  least 12 characters").
- **On success:** the account is created → `/onboarding`.
- **Google sign-up:** Google may not tell us the user's age, so we still show the 18+ checkbox
  (one extra step) before onboarding.

---

## `/login` Log in

**What they see:**

- Email, password, **Log in** button
- **Continue with Google**
- A link to sign up
- A short **"Forgot your password?"** note. No reset email exists in the MVP; wording is open, see
  [Q12](mvp-requirements.md#10-open-questions).

**On success:** `/` (feed). If they came from a specific page, such as an event or an invite link,
they go back there instead.

---

## `/onboarding` Onboarding

**Purpose:** learn what the user likes so the feed can rank events for them. Shown once after
sign-up.

**What they see:** one question per screen, with a progress indicator ("Step 2 of 4").

| Step | Question                                            | Input                                     |
| ---- | --------------------------------------------------- | ----------------------------------------- |
| 1    | What do you care about?                             | Large tappable **cause tiles** (pick any) |
| 2    | What are you good at or happy to do?                | Tappable **skill chips** (pick any)       |
| 3    | When are you usually free? How far will you travel? | Tap grid of free times + distance buttons |
| 4    | Your address (optional)                             | One address field                         |

(Possible extra step, still open as [Q1](mvp-requirements.md#10-open-questions): "What kinds of
tasks are you comfortable with?")

**What they can click**

| Click                                           | Result                             |
| ----------------------------------------------- | ---------------------------------- |
| A tile or chip                                  | Toggles it selected / not selected |
| **Next**                                        | Next step                          |
| **Back**                                        | Previous step                      |
| Light-grey **"Skip this step →"** at the bottom | Skips this step                    |
| **Finish** (last step)                          | Saves the answers → `/` feed       |

Everything can be changed later in `/settings`.

---

## `/events/[event]` Event page, limited (logged out)

**What they see:**

- Cover photo, event name, nonprofit name (links to its page), date, **city only**, description,
  cause tags, love count
- The **list of roles**: names, plus how many spots are left per role
- A clear box: **"Sign up or log in to see the full address and volunteer,"** with buttons

**What's hidden:**

- the exact address
- the shift-level sign-up buttons
- coordinator contact

**What they can click**

| Click            | Result                                                |
| ---------------- | ----------------------------------------------------- |
| Sign up / Log in | Goes there, and returns them to this event afterwards |
| Nonprofit name   | `/nonprofits/[nonprofit]`                             |

---

## `/events/[event]` Event page, full (logged in)

**What they see**

1. Cover photo, event name, **nonprofit name** (link) with a **Follow** button.
2. Date(s), **full address**, description, cause tags, coordinator contact (if given).
3. **❤️ love button with count.**
4. **Roles section:** one block per role with its name, a short line of description, skill tags,
   and spots left. Each role has a **"Learn more"** button.
5. Further down, a **"Sign up"** button.
6. **If already signed up:** a clear "You're signed up for _Role_, _Shift_" box with a **Cancel my
   sign-up** button.
7. **Status cases:**
   - If the event has **passed**, all sign-up buttons are greyed out with "This event has ended."
   - If a shift is **full**, it's shown as "Full" and can't be picked.
8. **For members of this nonprofit only:** **Edit event** and **See sign-ups** buttons.

**What they can click**

| Click                                                | Result                                                                                                    |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Learn more** on a role                             | **Role popup:** full role description, the time needed, every shift with times and spots left, skill tags |
| **Sign up** (from the page or inside the role popup) | **Sign-up popup** (below)                                                                                 |
| ❤️                                                   | Toggles love                                                                                              |
| Follow / Following                                   | Toggles follow on the nonprofit                                                                           |
| Cancel my sign-up                                    | Confirmation ("Are you sure?") → cancels, frees the spot, and notifies the nonprofit's members            |
| Edit event / See sign-ups (members only)             | `/events/[event]/edit` or `/events/[event]/signups`                                                       |

**Sign-up popup**

1. **Pick a shift.** Shows only open shifts. If the user opened it from a role, that role is
   pre-selected.
2. **Notes for the organizers** (optional text box).
3. **"Share my phone number with this nonprofit"** checkbox. If the user has no phone number
   saved, it offers to add one.
4. **Confirm sign-up** → a success message → the "You're signed up" box appears on the page.

**Rules**

- **One shift per event.** If they're already signed up, the Sign up button is replaced by the
  signed-up box.
- If the shift **fills up while the popup is open**, show "Sorry, that shift just filled up."

---

## `/nonprofits/[nonprofit]` Nonprofit page

**What they see (everyone):**

- Logo, **official name**, a ✓ verified badge
- Description, phone, email, website, city/state
- Cause tags of their events, i.e. **"skills and causes we need,"** gathered from their events'
  tags (the client notes ask for this)
- **Follower count** (TBD in design)
- **Upcoming events** as cards
- **Past events** greyed out

**Logged in, additionally:** a **Follow** button.

**Members, additionally:**

- **Manage** button → dashboard
- **+ New event** button

**What they can click**

| Click         | Result                                       |
| ------------- | -------------------------------------------- |
| An event card | `/events/[event]`                            |
| Follow        | Toggles follow (logged out: prompts sign-up) |
| Website link  | Opens the nonprofit's site in a new tab      |

---

## `/nonprofits/new` Create a nonprofit (the **+** button)

**Purpose:** create a GitHub-org-style nonprofit, verified automatically.

**Steps**

1. **Enter the EIN** (format help shown: 12-3456789) → **Check**.
2. **The server looks it up:**

   | Result                     | What the user sees                                                                |
   | -------------------------- | --------------------------------------------------------------------------------- |
   | Not found                  | "We couldn't find a nonprofit with this EIN in IRS records."                      |
   | Found, but not a 501(c)(3) | "Only 501(c)(3) nonprofits can join LOVE."                                        |
   | Already on LOVE            | "This nonprofit already exists," with a link to its page                          |
   | ✓ Found and eligible       | "Is this your nonprofit?" with the **official name and address** from IRS records |

3. **Confirm**, then fill in: description, phone, email, website, logo upload.
4. **Create** → the nonprofit page is created, the user becomes the **owner**, and they're taken
   to the **dashboard**.

---

## `/nonprofits/[nonprofit]/manage` Nonprofit dashboard (members)

**Who can see it:** members only. Everyone else gets "You don't have access."

**What they see**

1. **Events** tab or section:
   - all the nonprofit's events (upcoming first, then past)
   - for each event: date, total spots filled ("12 / 20"), love count
   - buttons: **Edit**, **See sign-ups**, **Delete**
2. **+ New event** button.
3. **Nonprofit info:** edit description, phone, email, website, logo. The name and address come
   from the IRS record and can't be edited.
4. **Members** section:
   - list of members, with the owner marked
   - **Owner only:**
     - **Copy invite link** button (see [Q2](mvp-requirements.md#10-open-questions))
     - **Remove** next to each member
     - **Delete nonprofit** (with a strong "Are you sure?" confirmation)
   - **Leave nonprofit** button for non-owners

---

## `/nonprofits/[nonprofit]/events/new` and `/events/[event]/edit` Create / edit event

**What they see** (one form; the edit version comes pre-filled):

- **Event details:** name, description, address, date, cover photo upload, cause tags (from the
  shared list), coordinator contact (optional)
- **Roles:** **+ Add role**. Each role has a name, description, skill tags, and its **shifts**
  (**+ Add shift**: start time, end time, spots)
- **Save** / **Publish**

**Behavior**

- Every event needs **at least one role**, and every role needs **at least one shift**.
- **Editing** an event that has sign-ups: a warning appears: "X people are signed up. They'll be
  notified of your changes." What happens to sign-ups on a deleted role or shift is open
  ([Q7](mvp-requirements.md#10-open-questions)).
- **Deleting** an event: confirmation → everyone signed up is notified.

---

## `/events/[event]/signups` Who signed up (members)

**What they see:** for each role and shift, a list of volunteers with:

- name and email
- **phone (only if they consented)**
- their notes
- when they signed up

**Plus:**

- A **"Loved by"** list showing who loved the event.
- **Export/print** is not in the MVP (could be a later add).

---

## `/invite/[token]` Accept invite

**What they see:**

- "You've been invited to join **[Nonprofit]** on LOVE."
- **Join** button (logged out: log in or sign up first, then come back here).

**After joining:** they're taken to the nonprofit dashboard.

**If the link is invalid or the person is already a member:** a clear message.

---

## `/my-signups` My sign-ups

**What they see:**

- **Upcoming:** each with event name, nonprofit, role, shift time, address, and a **Cancel**
  button.
- **Past** below, greyed out.
- **Empty state:** "You haven't signed up for anything yet," with a link to the feed.

**Clicks:**

- **Event** → its page.
- **Cancel** → confirmation → cancels and notifies the nonprofit.

---

## `/following` Following

**What they see:** the nonprofits the user follows, as cards (logo, name, number of upcoming
events) with an **Unfollow** button.

**Empty state:** "You're not following any nonprofits yet."

**Clicks:**

- **Card** → nonprofit page.
- **Unfollow** → removes it from the list.

---

## `/notifications` Notifications

**What they see:** all notifications, newest first, with unread ones highlighted. Examples:

- "_Community Meals_ was changed. Check the new time."
- "_Food Drive_ was cancelled."
- "Jane Doe cancelled their sign-up for _Kitchen helper_" (members only)

**Clicks:**

- A notification → its event (and it's marked read).
- **Mark all as read.**

---

## `/search` Search results

**Reached from:** the sidebar search box.

**What they see:** two groups:

- **Events** matching the text (as event cards)
- **Nonprofits** matching the text (as nonprofit cards)

The same distance and tag filters apply.

**Empty state:** "No results for '…'."

---

## `/settings` Settings

**What they see**

- **Profile:** name, phone, address (all editable). Email is shown (whether it can change is TBD).
- **My interests:** the same cause and skill pickers, free times, and distance from onboarding,
  all editable.
- **My nonprofits:** a list with links to each dashboard, and **Leave**.
- **Log out.**
- **Delete account** is open ([Q10](mvp-requirements.md#10-open-questions)).

---

## Not found (404)

A friendly "We couldn't find that page" with links to Home.

The same page is used for deleted events and deleted nonprofits.

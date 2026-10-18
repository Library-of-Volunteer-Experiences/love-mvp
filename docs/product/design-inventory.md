# LOVE: Design Inventory (MVP)

- **Last updated:** 2026-10-18
- **Related:** [Pages](pages.md) · [MVP requirements](mvp-requirements.md)

This file lists **every visual piece that needs designing** in the MVP, with:

- where it lives in the code
- which pages use it
- what design decisions must be made before it's built

**How to use it:** before building a component, settle its "Decisions needed" with the team, then
record the answers here.

**Code location:** components live in `apps/web/src/components/` (the layout follows the
AP-Students repo):

| Folder           | Holds                                                   |
| ---------------- | ------------------------------------------------------- |
| `ui/`            | Generic building blocks: button, card, dialog, input, … |
| `global/`        | Site-wide pieces: navbar, footer, sidebar, …            |
| `auth/`          | Sign-up and log-in                                      |
| `landing/`       | The logged-out landing page                             |
| `feed/`          | The logged-in feed                                      |
| `events/`        | Event cards, event page, sign-up                        |
| `nonprofits/`    | Nonprofit pages and dashboard                           |
| `onboarding/`    | Onboarding steps                                        |
| `notifications/` | Bell and notification list                              |

---

## 0. Site-wide decisions (decide these first)

These affect everything below.

| #   | Decision                   | Notes                                                                                            |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| G1  | **Colors / brand**         | The repo already has a rose/red primary and neutral greys in `globals.css`. Keep it or redo it?  |
| G2  | **Fonts**                  | Currently Anek Latin (sans) + Source Serif 4 (serif). Keep?                                      |
| G3  | **Base text size**         | Current standard: 18px minimum, for older users. Keep?                                           |
| G4  | **Logo**                   | Is there a LOVE logo, or just the word "LOVE"? A heart?                                          |
| G5  | **Dark mode**              | Tokens exist. Support it in the MVP or light only?                                               |
| G6  | **Icons**                  | Lucide icons are installed. Use those everywhere?                                                |
| G7  | **Overall feel**           | Social-app feel (like Instagram/Facebook cards) vs. clean "civic" feel.                          |
| G8  | **Mobile-width layout**    | Many users will open this on phones. How does each page collapse (sidebar → drawer? bottom nav?) |
| G9  | **Default event cover**    | What to show when an event has no cover photo (nonprofit logo? colored block with icon?)         |
| G10 | **Default nonprofit logo** | What to show when there's no logo (initials? icon?)                                              |

---

## 1. Global (`components/global/`)

### Navbar (logged out)

- **Used on:** every page when logged out.
- **Contains:** logo, Log in, Sign up.
- **Decisions needed:**
  - Is "Sign up" a filled button and "Log in" a plain link?
  - Sticky at the top when scrolling?

### Navbar (logged in)

- **Used on:** every page when logged in.
- **Contains:**
  - logo
  - Home, My sign-ups, Following
  - **+** button (create nonprofit)
  - 🔔 bell with unread count
  - profile menu
- **Decisions needed:**
  - Do the links show icons, text, or both?
  - Should the **+** have a label ("Add nonprofit"), since older users may not guess what a bare
    - means?
  - Profile menu: avatar (initials?) or name?
  - Phone layout: does everything move to a bottom bar or a ☰ menu?

### Profile menu (dropdown)

- **Used in:** the logged-in navbar.
- **Contains:** Settings, my nonprofits (→ dashboards), Log out.
- **Decisions needed:** none beyond styling.

### Footer

- **Used on:** every page.
- **Decisions needed:**
  - What goes in it? Ideas: "Built for Fannin County," contact email, privacy/terms links (do we
    have those pages?), and maybe a "Report a problem" link.

### Sidebar (search + filters)

- **Used on:** the feed, search results.
- **Contains:** search box, distance selector, cause and skill tag filters, "Clear filters."
- **Decisions needed:**
  - Left or right side?
  - On phones, does it become a "Filters" button that opens a drawer?
  - Distance control: buttons (5 / 15 / anywhere) or a slider?
  - How are tag filters shown (chips? checkboxes?), and how many before "Show more"?

### Page layout / container

- **Used on:** every page.
- **Decisions needed:**
  - Maximum content width?
  - Feed column width when the sidebar is shown?

---

## 2. Landing (logged out) (`components/landing/`)

### Hero section

- **Used on:** `/` (logged out).
- **Contains:** headline, one-sentence explanation, **large Sign up button**.
- **Decisions needed:**
  - Headline wording.
  - A photo or illustration? (Real Fannin County photos would be great; whose photos, with what
    permission?)

### About / how-it-works section

- **Used on:** `/` (logged out).
- **Decisions needed:**
  - 3 steps with icons, or a short paragraph?
  - Wording.

### Sign-up prompt banner

- **Used on:** the landing page (repeated), and the limited event page.
- **Decisions needed:**
  - Wording ("Sign up to see the address and volunteer").
  - Visual prominence.

---

## 3. Auth (`components/auth/`)

Draft versions already exist: `login-05`, `signup-05`.

### Sign-up form

- **Used on:** `/signup`.
- **Contains:**
  - full name, email, password
  - **"I am 18 or older"** checkbox
  - Create account button
  - Continue with Google
  - link to log in
- **Decisions needed:**
  - Show the password rules up front?
  - A show/hide password eye toggle? (Recommended for older users.)

### Log-in form

- **Used on:** `/login`.
- **Contains:** email, password, Log in, Continue with Google, link to sign up, the
  forgot-password note.
- **Decisions needed:** forgot-password note wording (no reset email exists in the MVP).

### Google button

- **Used on:** sign-up, log-in.
- **Decisions needed:** follow Google's official button style guidelines (recommended).

### 18+ confirmation step (for Google sign-ups)

- **Used on:** right after a first Google sign-in.
- **Decisions needed:** a separate small screen, or the first step of onboarding?

---

## 4. Onboarding (`components/onboarding/`)

### Step layout + progress indicator

- **Used on:** `/onboarding`.
- **Decisions needed:**
  - Dots, a bar, or "Step 2 of 4" text?
  - Back/Next button placement.

### Cause tile grid

- **Used on:** onboarding step 1, settings.
- **Decisions needed:**
  - An icon or emoji per cause?
  - How large are the tiles?
  - What does "selected" look like (checkmark? filled color?)

### Skill chips

- **Used on:** onboarding step 2, settings, sidebar filters, event form.
- **Decisions needed:** chip size and the selected style. Should it match the cause tiles or look
  different?

### Free-times grid

- **Used on:** onboarding step 3, settings.
- **Decisions needed:** a grid of buttons (mornings / afternoons / evenings × weekdays /
  weekends)?

### Distance picker

- **Used on:** onboarding step 3, settings, sidebar.
- **Decisions needed:** buttons or a slider? Which values?

### Address input

- **Used on:** onboarding step 4, settings.
- **Decisions needed:**
  - One line, or separate street/city/ZIP fields?
  - Address autocomplete? (Often a paid API; skip for the MVP?)

### "Skip this step →" link

- **Used on:** every onboarding step.
- **Decided:** light grey, at the bottom, with an arrow.

### Task-comfort picker (if Q1 is approved)

- **Used on:** onboarding, settings, the role editor.
- **Decisions needed:** icons and wording.

---

## 5. Feed (`components/feed/`)

### Feed list

- **Used on:** `/` (logged in).
- **Decisions needed:**
  - One column, or a grid?
  - Infinite scroll or a "Load more" button? (Load more is easier for older users.)

### Feed empty state

- **Used on:** the feed when nothing matches.
- **Decisions needed:** wording and an illustration.

### Loading skeleton

- **Used on:** the feed, event lists.
- **Decisions needed:** a skeleton card shape that matches the event card.

---

## 6. Events (`components/events/`)

### Event card (logged in)

- **Used on:** the feed, search, nonprofit page.
- **Contains:**
  - **nonprofit name (+ logo?) at the top**
  - cover photo
  - event name
  - date/time
  - location
  - cause tags
  - spots left
  - **❤️ love button with count**
- **Decisions needed:**
  - **Cover photo** size and shape.
  - Is the nonprofit logo shown next to its name?
  - How many tags are shown before "+2"?
  - Is the spots-left number shown as text or as a bar?
  - What appears when there are **few spots left** (e.g. "3 spots left" in color)?
  - Should the card hint why it was recommended ("Because you like Seniors")?

### Event preview card (logged out)

- **Used on:** the landing page.
- **Contains:** the same as above, but **city only** (no address), and the love count is shown
  but tapping it prompts sign-up.
- **Decisions needed:**
  - Should it look identical to the logged-in card, or simpler?
  - City only, or city + ZIP?

### Event card (past / greyed)

- **Used on:** nonprofit page (past events), My sign-ups (past).
- **Decisions needed:** how "greyed out" looks, and whether an "Ended" badge is shown.

### Love button ❤️

- **Used on:** event cards, the event page.
- **Decisions needed:**
  - Icon style when loved vs. not.
  - An animation on tap? (Keep it subtle; respect reduced-motion settings.)
  - Where the count sits.

### Event page header

- **Used on:** `/events/[eventId]`.
- **Contains:** cover photo, name, nonprofit (link + Follow), date, address, love button.
- **Decisions needed:**
  - Is the cover a full-width banner or a contained image?
  - Should there be a map? (Static map images may cost money, so maybe just an "Open in Google
    Maps" link.)

### Event details section

- **Used on:** the event page.
- **Contains:** description, cause tags, coordinator contact.
- **Decisions needed:** none beyond styling.

### Role block

- **Used on:** the event page (one per role).
- **Contains:** role name, short description, skill tags, spots left, **Learn more** button.
- **Decisions needed:**
  - Should shifts be listed directly on the block too, or only in the popup?

### Role details popup ("Learn more")

- **Used on:** the event page.
- **Contains:** full description, time needed, all shifts (time + spots left, "Full" if full),
  skill tags, **Sign up** button.
- **Decisions needed:**
  - Centered dialog, or a sheet sliding up from the bottom (better on phones)?

### Sign-up popup

- **Used on:** the event page.
- **Contains:**
  - **shift picker**
  - notes box
  - **"Share my phone number"** checkbox
  - Confirm button
- **Decisions needed:**
  - Shift picker style: radio list, or cards?
  - Wording for the phone consent.
  - Success state: a message inside the popup, or close it and show a toast?

### "You're signed up" box

- **Used on:** the event page.
- **Contains:** role, shift, **Cancel my sign-up**.
- **Decisions needed:** color and placement (top of the page? next to the roles?)

### Status badges

- **Used on:** cards and the event page.
- **Badges:** "Full," "Ended," "X spots left," "You're signed up."
- **Decisions needed:** colors and shapes for each.

### Limited event page box (logged out)

- **Used on:** `/events/[eventId]` (logged out).
- **Contains:** "Sign up or log in to see the address and volunteer" with buttons.
- **Decisions needed:** wording and how prominent it is.

### Event form (create/edit)

- **Used on:** create event and edit event.
- **Contains:**
  - event fields
  - cover photo upload
  - cause tag picker
  - **role editor**: repeatable; each role has name, description, skill tags, and a **shift
    editor** (repeatable: start, end, spots)
- **Decisions needed:**
  - One long page, or steps (Details → Roles → Review)?
  - Date and time picker style.
  - Image cropping for the cover?
  - Which fields are required ([Q11](mvp-requirements.md#10-open-questions))?

### Cover photo upload

- **Used on:** the event form.
- **Decisions needed:**
  - Aspect ratio.
  - Max file size.
  - Whether to show a preview.

### Sign-ups table (members)

- **Used on:** `/events/[eventId]/signups`.
- **Contains:** per role/shift: name, email, phone (if consented), notes, signed-up time.
- **Decisions needed:**
  - A table or cards?
  - What to show when there's no phone ("Not shared")?

### "Loved by" list (members)

- **Used on:** the sign-ups page.
- **Decisions needed:** names only, or with avatars/initials?

---

## 7. Nonprofits (`components/nonprofits/`)

### Nonprofit page header

- **Used on:** `/nonprofits/[nonprofitId]`.
- **Contains:**
  - logo
  - official name
  - **✓ verified badge**
  - Follow button
  - follower count
  - Manage / + New event (members only)
- **Decisions needed:**
  - Is there a banner image, or just the logo?
  - Is the follower count shown?
  - What the verified badge looks like.

### Nonprofit info section

- **Used on:** the nonprofit page.
- **Contains:** description, phone, email, website, city/state, "Causes and skills we need" tags.
- **Decisions needed:** layout (sidebar next to events, or stacked above them?)

### Nonprofit card

- **Used on:** Following page, search results.
- **Contains:** logo, name, upcoming event count, Follow/Unfollow.
- **Decisions needed:** size, and whether it's a list or a grid.

### Follow button

- **Used on:** nonprofit page, event page, nonprofit card.
- **Decisions needed:** the "Follow" vs. "Following" states (and does it show "Unfollow" on hover?)

### Create-nonprofit flow

- **Used on:** `/nonprofits/new`.
- **Contains:**
  - **EIN input + Check button**
  - result messages (not found / not 501(c)(3) / already exists)
  - **"Is this your nonprofit?" confirmation card** (official name + address)
  - details form (description, phone, email, website, logo upload)
- **Decisions needed:**
  - One page, or steps?
  - Helper text explaining what an EIN is and where to find it.

### Logo upload

- **Used on:** create nonprofit, dashboard.
- **Decisions needed:**
  - Square crop?
  - Max size.

### Nonprofit dashboard

- **Used on:** `/nonprofits/[nonprofitId]/manage`.
- **Contains:**
  - events list (with filled / total spots, love count, Edit, See sign-ups, Delete)
  - edit-info form
  - members section
- **Decisions needed:**
  - Tabs (Events / Info / Members) or one long page?

### Members list

- **Used on:** the dashboard.
- **Contains:** names, an "Owner" marker, Remove (owner only), Leave (others).
- **Decisions needed:** none beyond styling.

### Invite link box (owner)

- **Used on:** the dashboard.
- **Contains:** the link, a **Copy** button, and a short "Send this to people you want to add"
  explanation.
- **Decisions needed:**
  - Wording.
  - Can the link be reset (so an old link stops working)?
  - Pending [Q2](mvp-requirements.md#10-open-questions).

### Accept-invite card

- **Used on:** `/invite/[token]`.
- **Contains:** "Join [Nonprofit]?" with a Join button.
- **Decisions needed:** none beyond styling.

---

## 8. Notifications (`components/notifications/`)

### Notification bell + dropdown

- **Used on:** the logged-in navbar.
- **Contains:** bell, unread count, the latest ~5 notifications, "See all."
- **Decisions needed:**
  - Badge style (a number, or just a dot?)

### Notification list item

- **Used on:** the dropdown, `/notifications`.
- **Contains:** icon by type (changed / cancelled / volunteer cancelled), message, time ago,
  read/unread style.
- **Decisions needed:** how unread items look.

---

## 9. Account (`components/account/`)

### My sign-ups list item

- **Used on:** `/my-signups`.
- **Contains:** event, nonprofit, role, shift time, address, Cancel.
- **Decisions needed:** reuse the event card, or a compact row?

### Settings sections

- **Used on:** `/settings`.
- **Contains:** profile form, interests (reusing the onboarding pickers), my nonprofits, log out.
- **Decisions needed:** one page or tabs?

---

## 10. Shared feedback pieces (`components/ui/` or `global/`)

| Component                            | Used on                                                             | Decisions needed                                           |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Confirm dialog** ("Are you sure?") | cancel sign-up, delete event, remove member, leave/delete nonprofit | Should destructive buttons be red?                         |
| **Toast / snackbar**                 | after love, follow, sign-up, save                                   | Position, and how long it stays (older users need longer). |
| **Empty state**                      | feed, My sign-ups, Following, search, notifications                 | Illustration style or icon only.                           |
| **Error state / 404**                | errors, unknown pages                                               | Wording, illustration.                                     |
| **Loading spinner / skeletons**      | everywhere data loads                                               | Skeletons vs. spinners.                                    |
| **Tag chip (display only)**          | cards, event page, nonprofit page                                   | Colors per category, or all the same?                      |
| **Avatar / initials**                | profile menu, sign-ups, loved-by                                    | Color rules.                                               |

---

## Already decided (design)

- **"Skip this step →"** on onboarding: light grey, at the bottom, with an arrow.
- **Event cards:** the nonprofit name is at the top and links to the nonprofit page. Each card has
  a love button with a public count.
- **Events** can have a cover photo; **nonprofits** can have a logo.
- **Past events:** sign-up buttons are greyed out.
- **Logged-out cards** don't show the exact address, but do show the love count.

# LOVE: User Flows (for wireframing)

- **Last updated:** 2026-10-18
- **Related:** [Pages](pages.md) (the technical version) · [Design inventory](design-inventory.md) ·
  [MVP requirements](mvp-requirements.md)

This document walks through LOVE **the way a person experiences it**, from first visit onward, in
plain English. Use it to draw the wireframes: each **bold screen name** is a screen to draw, and
each → is someone tapping or clicking.

Things marked **(open)** haven't been decided yet. Draw them however makes sense and flag them.

---

## Part 1: A visitor who isn't signed in

### 1.1 Landing on the home page

Someone opens LOVE for the first time. They see the **Welcome page**:

- A top bar with the LOVE logo and two buttons: **Log in** and **Sign up**.
- A big, friendly headline about volunteering in their community, with a **large "Sign up to
  volunteer" button**. This is the most important thing on the page.
- A short "How LOVE works" section: find events you'll love → pick a time → show up and help.
- A set of **event preview cards** showing real upcoming events. Each card shows:
  - the event's photo and name
  - which nonprofit is running it
  - the date
  - the **town** (never the street address)
  - a few cause tags
  - how many people have ❤️ loved it
- Another sign-up prompt below the cards.
- A footer at the bottom.

**From here they can:**

- Tap **Sign up** → the **Sign-up screen** (1.4).
- Tap **Log in** → the **Log-in screen** (Part 2).
- Tap an **event card** → the **Event page, preview version** (1.2).
- Tap a **nonprofit's name** on a card → the **Nonprofit page** (1.3).
- Tap the **❤️** on a card → a small message: "Sign up to love events," with a Sign up button.

### 1.2 Looking at an event before signing in

They tapped an event card. They see the **Event page (preview version)**:

- The event's photo, name, nonprofit name, date, **town only**, description, tags, and love count.
- The **list of roles** (e.g. "Kitchen helper: 3 spots left," "Greeter: 1 spot left").
- A clear box: **"Sign up or log in to see the full address and volunteer,"** with **Sign up** and
  **Log in** buttons.

**What's hidden:**

- the exact address
- the buttons to pick a shift and volunteer
- the coordinator's contact info

**From here they can:**

- Tap **Sign up** or **Log in**. After they finish, LOVE **brings them back to this same event**,
  now showing the full version.
- Tap the **nonprofit name** → the **Nonprofit page**.
- Go back to the Welcome page.

### 1.3 Looking at a nonprofit before signing in

They see the **Nonprofit page**:

- The logo, the official name, and a **✓ verified** badge.
- A description, plus phone, email, website, and town.
- "Causes and skills we need" tags.
- **Upcoming events** as cards.
- **Past events** below, greyed out.

**From here they can:**

- Tap **Follow** → "Sign up to follow nonprofits."
- Tap an **event card** → the Event page (preview version).
- Tap the **website** → opens the nonprofit's own site in a new tab.

### 1.4 Signing up

They see the **Sign-up screen**:

- Full name
- Email
- Password
- A checkbox: **"I am 18 or older"** (required)
- A big **Create account** button
- **Continue with Google**
- "Already have an account? **Log in**"

**What can happen:**

| Situation                                             | What they see                                                                                                                                        |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **They fill it in correctly**                         | Their account is created → **Onboarding** (Part 3).                                                                                                  |
| **They forget a field, or the password is too short** | A plain-English message appears right under that field (e.g. "Password must be at least 12 characters"). Nothing else on the page changes.           |
| **They didn't tick 18+**                              | "You must be 18 or older to use LOVE."                                                                                                               |
| **The email is already registered**                   | "There's already an account with this email," with a link to Log in.                                                                                 |
| **They choose Google**                                | Google's sign-in window → back to LOVE → a quick **"Please confirm you're 18 or older"** screen (Google doesn't tell us their age) → **Onboarding**. |

---

## Part 2: Logging in (returning user)

They see the **Log-in screen**:

- Email
- Password
- **Log in**
- **Continue with Google**
- "New to LOVE? **Sign up**"
- A small **"Forgot your password?"** note. There's no reset email in the MVP, so this note says
  what to do instead; the exact wording is **(open)**.

**What can happen:**

| Situation                   | What they see                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Correct details**         | → their **Home feed** (Part 4). If they came from an event or an invite link, they go back there instead. |
| **Wrong email or password** | "That email and password don't match."                                                                    |

---

## Part 3: Onboarding (first time only)

Right after signing up, they go through a few short **Onboarding screens**:

- Only one question per screen.
- Big tap targets, and nothing to type except the optional address.
- A progress indicator ("Step 2 of 4").
- **Back** and **Next** buttons.
- A light-grey **"Skip this step →"** at the bottom of every screen.

**The screens:**

1. **"What do you care about?"** Big tiles to tap, any number: Food & hunger, Seniors, Kids &
   education, Animals, Outdoors, Housing & repair, Health, Arts & culture, Community events,
   Veterans, Disaster relief. Tapping a tile highlights it; tapping again un-highlights it.
2. **"What are you good at or happy to do?"** Smaller chips to tap: Cooking, Driving, Building &
   repair, Teaching, Office & computer, Setup & lifting, First aid, Spanish, Music & arts,
   Gardening, Fundraising, Photography, Just happy to help.
3. **"When are you usually free, and how far will you go?"**
   - Tap any of: weekday mornings, weekday afternoons, weekday evenings, weekends.
   - Then pick a distance: 5 miles, 15 miles, or anywhere.
4. **"What's your address? (optional)"** One field, with a note that it's only used to find
   nearby events and is never shown to anyone. Skip is fine. Without it, LOVE won't filter by
   distance.

**(Open)** A possible extra screen: "What kinds of tasks are you comfortable with?" (sitting,
standing, walking, lifting, outdoors).

**After the last screen:** **Finish** → their **Home feed**.

**If they skip every screen:** that's fine. The feed just shows the soonest and most-loved events.

They can change all of these answers any time in **Settings**.

---

## Part 4: The home feed (signed in)

They see the **Home feed**. The top bar now has:

- the LOVE logo
- **Home**
- **My sign-ups**
- **Following**
- a **+** button (to add a nonprofit)
- a **🔔 bell** with a number for unread notifications
- their **profile menu**

**Down the side, a filter panel:**

- a **search box**
- a **distance** choice
- **tag filters** (causes and skills)

On a phone, this panel probably hides behind a "Filters" button **(open)**.

**The middle is the feed:** a scrolling list of **event cards**, picked and ordered for them. Each
card shows:

- **the nonprofit's name at the top**, like who posted it
- the photo
- the event name
- date and time
- the **location**
- tags
- "X spots left"
- a **❤️ love button with the count**

**From here they can:**

| Action                             | What happens                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Tap the **❤️**                     | It fills in and the count goes up by one. Tap again to undo. The feed learns they like this kind of event. |
| Tap the **nonprofit name**         | → **Nonprofit page** (Part 7).                                                                             |
| Tap the **card**                   | → **Event page** (Part 5).                                                                                 |
| Type in **search** and press Enter | → **Search results** (Part 9).                                                                             |
| Change **distance or tags**        | The feed updates right away.                                                                               |
| Tap **+**                          | → **Add a nonprofit** (Part 10).                                                                           |
| Tap **🔔**                         | → a small dropdown of recent notifications (Part 8).                                                       |
| Open the **profile menu**          | Settings, the nonprofits they belong to, Log out.                                                          |

**If no events match the filters:** a friendly message, "No events match your filters," with a
**Clear filters** button.

---

## Part 5: Looking at an event and signing up (signed in)

### 5.1 The event page

They tapped an event. They see the **Event page (full version)**:

- The photo, name, **nonprofit name** with a **Follow** button, date, the **full address**,
  description, tags, coordinator contact (if any), and the **❤️ love button**.
- A **Roles** section with one box per role:
  - the role's name (e.g. "Kitchen helper")
  - a one-line description
  - skill tags
  - spots left
  - a **Learn more** button
- Further down, a **Sign up** button.

### 5.2 "Learn more" on a role

Tapping **Learn more** opens a **Role pop-up**:

- the full description of the role
- how much time it takes
- **every shift** for that role (e.g. "9:00–11:00 AM: 2 spots left," "11:00 AM–1:00 PM: Full")
- skill tags
- a **Sign up** button

**From here they can:**

- Close the pop-up → back to the event page.
- Tap **Sign up** → the **Sign-up pop-up**, with this role already chosen.

### 5.3 Signing up for a shift

The **Sign-up pop-up** asks three things:

1. **Which shift?** A list of open shifts to choose from. Full shifts are shown but can't be
   picked.
2. **"Anything the organizers should know?"** An optional notes box.
3. **"Share my phone number with this nonprofit"** A checkbox. If they don't have a phone number
   saved, it offers to add one.

Then a **Confirm sign-up** button.

**What can happen:**

| Situation                                        | What they see                                                                                                                                                                      |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **It works**                                     | A success message ("You're signed up!"). The pop-up closes. The event page now shows a **"You're signed up for Kitchen helper, 9–11 AM"** box with a **Cancel my sign-up** button. |
| **The shift filled up while they were deciding** | "Sorry, that shift just filled up. Please pick another."                                                                                                                           |
| **They're already signed up for this event**     | They never see the Sign up button. They see the "You're signed up" box instead (one shift per event).                                                                              |
| **The event has already happened**               | All sign-up buttons are greyed out, with "This event has ended."                                                                                                                   |
| **Every shift is full**                          | The Sign up button is greyed out with "All spots are filled." (No waitlist.)                                                                                                       |

### 5.4 Cancelling a sign-up

They tap **Cancel my sign-up**, either on the event page or on **My sign-ups**.

→ An **"Are you sure?"** box with "Yes, cancel" and "Keep my spot."

→ **"Yes, cancel"**: the spot opens up again, and the **nonprofit's members get a notification**.

---

## Part 6: My sign-ups and Following

### 6.1 My sign-ups

They tap **My sign-ups** in the top bar. They see the **My sign-ups page**:

- **Upcoming:** each one shows the event, nonprofit, role, shift time, address, and a **Cancel**
  button.
- **Past:** shown below, greyed out.
- **If they haven't signed up for anything:** "You haven't signed up for anything yet," with a
  button back to the feed.

**From here they can:**

- Tap an **event** → its page.
- Tap **Cancel** → the same "Are you sure?" flow as 5.4.

### 6.2 Following

They tap **Following** in the top bar. They see the **Following page**: cards for every nonprofit
they follow, each with the logo, name, how many upcoming events it has, and an **Unfollow** button.

**From here they can:**

- Tap a **card** → the Nonprofit page.
- Tap **Unfollow** → it disappears from the list.

**If they follow no one:** "You're not following any nonprofits yet."

**Following a nonprofit** makes its events show up higher in their feed.

---

## Part 7: Nonprofit page (signed in)

This is the same page as 1.3, plus:

- A working **Follow / Following** button.
- **If they're a member of this nonprofit:** **Manage** and **+ New event** buttons (→ Part 11).

---

## Part 8: Notifications

The **🔔 bell** shows a number when there's something new. Tapping it opens a **small dropdown**
with the latest few notifications and a **"See all"** link → the **Notifications page**.

**Notifications a volunteer gets:**

- "_Community Meals_ has changed. Check the new details."
- "_Food Drive_ has been cancelled."

**Notifications a nonprofit member gets:**

- "Jane Doe cancelled their sign-up for _Kitchen helper_ (9–11 AM)."

Tapping a notification → the event, and it's marked as read. There's also a **"Mark all as read"**
button.

There are **no emails or texts** in the MVP. Notifications only appear inside LOVE.

---

## Part 9: Search

They type into the **search box** and press Enter. They see the **Search results page**, with two
groups:

- **Events** matching the words, as event cards.
- **Nonprofits** matching the words, as nonprofit cards.

The distance and tag filters still apply.

**If nothing is found:** "No results for '…'."

---

## Part 10: Adding a nonprofit (the + button)

Anyone signed in can tap **+**. They see the **Add a nonprofit screen**. Only real, registered
501(c)(3) nonprofits are allowed, and the check is automatic.

**Step 1: enter the EIN.** One box, with help text: "Your nonprofit's 9-digit tax ID, like
12-3456789. You'll find it on your IRS paperwork." Then a **Check** button.

**Step 2: LOVE checks it against IRS records.**

| Situation                      | What they see                                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Not found**                  | "We couldn't find a nonprofit with this EIN." They can try again.                                                                                      |
| **Found, but not a 501(c)(3)** | "Only 501(c)(3) nonprofits can join LOVE."                                                                                                             |
| **Already on LOVE**            | "This nonprofit is already on LOVE," with a link to its page.                                                                                          |
| **Found and eligible**         | A confirmation card: "Is this your nonprofit?" showing the **official name and address** from IRS records, with **Yes, continue** and **No, go back**. |

**Step 3: fill in the details.**

- a description
- phone
- email
- website
- logo upload

The name and address are already filled in from the IRS record and can't be changed.

**Step 4: Create.**

→ The nonprofit's public page now exists.

→ The person becomes its **owner**.

→ They land on the **Nonprofit dashboard** (Part 11).

---

## Part 11: Running a nonprofit (members)

### 11.1 The dashboard

From the nonprofit page (**Manage**) or the profile menu, members reach the **Nonprofit
dashboard**:

- **Events:** every event, upcoming first. Each shows the date, spots filled ("12 of 20"), the
  love count, and **Edit**, **See sign-ups**, and **Delete** buttons.
- A **+ New event** button.
- **Nonprofit info:** edit the description, phone, email, website, and logo.
- **Members:** everyone in the nonprofit, with the owner marked.

### 11.2 Creating an event

They tap **+ New event**. They see the **Create event form**:

1. **The basics:**
   - event name
   - description
   - address
   - date
   - cover photo
   - cause tags (from the same list volunteers pick from)
   - coordinator contact (optional)
2. **Roles:** **+ Add role**. Each role gets a name, a description, and skill tags.
3. **Shifts for each role:** **+ Add shift**. Each shift gets a start time, end time, and number of
   spots.
4. **Publish.**

Every event needs at least one role, and every role needs at least one shift. If something's
missing, a message points to it.

→ After publishing: the event appears on the nonprofit's page and starts showing up in
volunteers' feeds.

### 11.3 Editing or cancelling an event

They tap **Edit**. They see the same form, already filled in.

**If people have signed up**, a warning: "8 people are signed up. They'll be notified of your
changes."

→ **Save**: the changes go live, and **everyone signed up gets a notification**.

**(Open)** What happens to people signed up for a shift or role that gets deleted.

They tap **Delete** → "Are you sure? Everyone signed up will be notified." → the event is removed
and everyone signed up is notified.

### 11.4 Seeing who signed up

They tap **See sign-ups**. They see the **Sign-ups page**:

- Every **role and shift**, with the volunteers in each. For each volunteer:
  - name and email
  - **phone number, only if the volunteer agreed to share it** (otherwise "Not shared")
  - their notes
  - when they signed up
- A **"Loved by"** list showing who loved the event.

### 11.5 Adding and removing members (owner only)

**Only the owner** can add or remove members. In the MVP, every member can do everything else:
post, edit, and delete events, and see sign-ups.

**Adding someone:**

1. In **Members**, the owner taps **Copy invite link**, then sends the link however they like
   (text message, their own email…). **(Open):** confirm this approach.
2. The invited person opens the link and sees the **Invite screen**: "You've been invited to join
   **Fannin Food Bank** on LOVE," with a **Join** button.
   - If they aren't signed in, they log in or sign up first, then come back to this screen.
3. They tap **Join** → they're a member, and land on the dashboard.

| Situation                     | What they see                                            |
| ----------------------------- | -------------------------------------------------------- |
| **The link is broken or old** | "This invite link isn't valid."                          |
| **They're already a member**  | "You're already a member," with a link to the dashboard. |

**Removing someone:** the owner taps **Remove** next to a member → "Are you sure?" → they're
removed.

**Leaving:** any member except the owner can tap **Leave nonprofit** → "Are you sure?" → they're
removed.

**Deleting the nonprofit (owner only):**

1. The owner taps **Delete nonprofit**.
2. A serious warning appears, possibly asking them to type the name to confirm **(open)**.
3. The nonprofit and its events are removed.

The owner **can't hand over ownership** in the MVP.

---

## Part 12: Settings and logging out

From the profile menu → the **Settings page**:

- **Profile:** name, phone, address. All editable.
- **My interests:** the same pickers as onboarding (causes, skills, free times, distance). All
  editable.
- **My nonprofits:** each one they belong to, with a link to its dashboard and a **Leave** button.
- **Log out.**
- **(Open)** Delete my account.

**Log out** → back to the **Welcome page** (Part 1).

---

## Part 13: Situations that can happen anywhere

| Situation                                                       | What the user sees                                                     |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **A page that doesn't exist** (or a deleted event or nonprofit) | A friendly "We couldn't find that page," with a button home.           |
| **A non-member opens a dashboard or sign-ups page**             | "You don't have access to this page."                                  |
| **Logged out, opens a signed-in page** (My sign-ups, Settings…) | → Log-in screen, then straight back to that page after logging in.     |
| **Something goes wrong** (no internet, server error)            | "Something went wrong. Please try again," with a **Try again** button. |
| **Waiting for something to load**                               | Grey placeholder shapes where the content will appear.                 |

---

## The whole journey at a glance

```
VISITOR
Welcome page ──► Event (preview) ──► Sign up / Log in ──► (back to that event)
     │                                     │
     └──► Sign up ──► 18+ check ──► Onboarding (4 skippable steps) ──► Home feed

SIGNED IN
Home feed ──► Event page ──► Role "Learn more" ──► Sign-up pop-up ──► "You're signed up"
    │             │                                                       │
    │             └──► Nonprofit page ──► Follow                         └──► Cancel ──► nonprofit notified
    ├──► My sign-ups ──► Cancel
    ├──► Following ──► Nonprofit page
    ├──► 🔔 Notifications ──► Event
    ├──► Search ──► Events / Nonprofits
    ├──► + ──► EIN check ──► Confirm ──► Details ──► Nonprofit dashboard
    └──► Settings ──► Log out ──► Welcome page

NONPROFIT MEMBER
Dashboard ──► + New event ──► Roles ──► Shifts ──► Publish ──► appears in feeds
    ├──► Edit / Delete event ──► volunteers notified
    ├──► See sign-ups (phone only if shared) + Loved by
    └──► Members (owner): Copy invite link ──► person opens link ──► Join
```

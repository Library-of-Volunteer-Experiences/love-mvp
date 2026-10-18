# LOVE: MVP Requirements

- **Last updated:** 2026-10-18
- **Related:** [Vision](vision.md) · [Pages](pages.md) · [Design inventory](design-inventory.md)

This file has five parts:

1. What the first version must do (§1–§7)
2. What it deliberately will **not** do (§8)
3. Every decision made so far (§9)
4. What is still open (§10)

**Keep it current.** When something is decided, add it to §9 and remove it from §10.

---

## 1. Accounts

| #   | Requirement                                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | **One account type.** No "volunteer vs. nonprofit" choice at sign-up.                                                                                                                                                       |
| A2  | Sign up / log in with **email + password**, or with **Google**.                                                                                                                                                             |
| A3  | **No emails are sent**: no email verification and no "forgot password" email. The log-in page shows a short note on what to do if you forget your password (wording TBD), and Google sign-in is offered as the easy option. |
| A4  | Sign-up requires ticking **"I am 18 or older."** No date of birth is collected.                                                                                                                                             |
| A5  | **Profile fields:** full name, email, phone (optional), address (optional; used only for distance).                                                                                                                         |
| A6  | After first sign-up, the user goes to **onboarding** (§3).                                                                                                                                                                  |

## 2. Nonprofits (organizations)

| #   | Requirement                                                                                                                                                                                                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1  | Any signed-in user can create a nonprofit with the **+** button in the navbar.                                                                                                                                                                  |
| N2  | **Only registered 501(c)(3) nonprofits, with no exceptions.**                                                                                                                                                                                   |
| N3  | **Automatic EIN verification.** The user enters an EIN and the server looks it up in ProPublica's free Nonprofit Explorer data (built from IRS records). It must exist and be a 501(c)(3). No human review.                                     |
| N4  | The nonprofit's **name and address come from the IRS record** (official name). The creator adds a description, phone, email, website, and logo.                                                                                                 |
| N5  | If the EIN is already registered on LOVE, show **"This nonprofit already exists"** (with a link to its page).                                                                                                                                   |
| N6  | Unverified nonprofits **cannot exist**: no draft or pending state.                                                                                                                                                                              |
| N7  | The **creator is the owner**. Ownership **cannot be transferred** in the MVP.                                                                                                                                                                   |
| N8  | **Only the owner** can add members (via an invite link; see §10) and remove members.                                                                                                                                                            |
| N9  | Members can **leave** a nonprofit themselves. A person can belong to many nonprofits.                                                                                                                                                           |
| N10 | **Every member has full powers** except member management and deleting the nonprofit: create, edit, and delete events; see sign-ups and volunteer contact info; see who loved their events. There are no "admin" or "member" labels in the MVP. |
| N11 | Only the owner can **delete** the nonprofit.                                                                                                                                                                                                    |
| N12 | Every nonprofit has a **public page** (§6, [pages.md](pages.md)) showing its info and events. Past events are shown greyed out.                                                                                                                 |

## 3. Onboarding

| #   | Requirement                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| O1  | A short, **tap-only** series of screens: nothing to type except the optional address.                                                                  |
| O2  | **Screen 1, Causes:** "What do you care about?" Pick any from the shared cause tag list.                                                               |
| O3  | **Screen 2, Skills:** "What are you good at or happy to do?" Pick any from the shared skill tag list.                                                  |
| O4  | **Screen 3, Practical:** usual free times (weekday mornings, afternoons, evenings; weekends) and how far they'll travel.                               |
| O5  | **Screen 4, Location (optional):** address, used only for distance. With no address, there's no distance filtering.                                    |
| O6  | **Every screen is skippable** via a light-grey **"Skip this step →"** link at the bottom.                                                              |
| O7  | All answers can be changed later in **Settings**.                                                                                                      |
| O8  | The tag lists (causes, skills) are owned by the team. Starter lists are in §11.                                                                        |
| O9  | Whether onboarding also asks **"what kinds of tasks are you comfortable with?"** (sitting, standing, walking, lifting, outdoors) is **open**: see §10. |

## 4. Feed and matching

| #   | Requirement                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | **Signed-in home page = personal feed** of event cards.                                                                                                                 |
| F2  | **Removed from the feed:** events that are past, completely full, already signed up for by this user, or beyond the user's travel distance (when they gave an address). |
| F3  | **Scoring (starting weights, to be tuned):**                                                                                                                            |
|     | +3 per matching cause tag                                                                                                                                               |
|     | +2 per matching skill tag (compared against the event's roles)                                                                                                          |
|     | +2 if a shift falls in the user's usual free times                                                                                                                      |
|     | +2 if the user follows the nonprofit                                                                                                                                    |
|     | +1 if the user has loved this nonprofit's events before                                                                                                                 |
|     | +1 if within the user's distance                                                                                                                                        |
|     | small bonus for happening soon, and for popularity (love count)                                                                                                         |
| F4  | **Variety:** avoid showing many events from the same nonprofit in a row.                                                                                                |
| F5  | **No onboarding data** (skipped): show the soonest and most-loved events.                                                                                               |
| F6  | **No AI and no free-text matching** in the MVP.                                                                                                                         |
| F7  | A **sidebar** lets users **search** (events and nonprofits), set **distance**, and filter by **tags**.                                                                  |

## 5. Events, roles, shifts, sign-ups

| #   | Requirement                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1  | **Event fields:** name, description, address, city, date(s), cover photo, cause tags, optional coordinator contact.                                             |
| E2  | An event has **one or more roles**. Each role has a name, description, skill tags, and one or more **shifts**.                                                  |
| E3  | Each **shift** has a start time, end time, and number of **spots**.                                                                                             |
| E4  | A volunteer may sign up for **one shift per event** in the MVP.                                                                                                 |
| E5  | **Sign-up popup** asks for: which shift, **extra notes** for the organizers (optional), and **"Share my phone number with this nonprofit"** (consent checkbox). |
| E6  | When a shift is full it **closes**. There is no waitlist.                                                                                                       |
| E7  | After an event has passed, its sign-up buttons are **greyed out**.                                                                                              |
| E8  | Volunteers can **cancel** their sign-up. The nonprofit's members get an in-app notification.                                                                    |
| E9  | When a nonprofit **edits or cancels** an event, everyone signed up gets an in-app notification.                                                                 |
| E10 | **Loves:** every event shows a **public love count**. Loving boosts the feed (§4). Nonprofit members can see **who** loved their events.                        |
| E11 | Volunteers can **follow** nonprofits.                                                                                                                           |

## 6. Visibility and privacy

| #   | Requirement                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------- |
| V1  | **Logged-out visitors** see the landing page with **preview cards**: no exact address, but they do show the love count.     |
| V2  | Clicking a preview card opens a **limited event page** with a clear prompt to sign up / log in.                             |
| V3  | **Signed-in users** see the full event page, **including the address**. Signing up for the event is not required to see it. |
| V4  | A volunteer's profile is visible **only to members of nonprofits they signed up with**, and **never to other volunteers**.  |
| V5  | A volunteer's **phone number** is shown to a nonprofit **only if they ticked the consent box** for that sign-up.            |
| V6  | Volunteers' addresses are **never shown to anyone**; they're used only to compute distance.                                 |

## 7. Notifications

| #   | Requirement                                                                                         |
| --- | --------------------------------------------------------------------------------------------------- |
| T1  | **In-app only:** a bell icon in the navbar with an unread count and a list. Free; stored in Convex. |
| T2  | **Volunteers are notified when:** an event they signed up for is edited or cancelled.               |
| T3  | **Nonprofit members are notified when:** a volunteer cancels a sign-up.                             |
| T4  | **No email, SMS, or push** in the MVP.                                                              |

---

## 8. NOT in the MVP

These are deliberately excluded. Several are planned for later; see [vision.md §8](vision.md#8-roadmap-after-the-mvp).

**Social**

- ❌ **Posts** from nonprofits (planned later, definitely)
- ❌ **Comments** on events, and any **chat** or messaging
- ❌ Volunteers seeing other volunteers, following other volunteers, or public volunteer profiles

**Matching**

- ❌ **AI matching** and free-text "describe yourself" onboarding

**Events**

- ❌ **Waitlists**
- ❌ **Recurring** events
- ❌ **Urgent / short-notice** flags
- ❌ Signing up for **more than one shift** of the same event
- ❌ **Cancellation cutoff** rules
- ❌ **Hours tracking**

**Email, SMS, push**

- ❌ **Any email sending:** verification, password reset, invite emails, reminders
- ❌ **SMS and push notifications**
- ❌ Anything that costs money to run

**Nonprofits**

- ❌ **Admin vs. member** roles (every member has full powers except owner-only actions)
- ❌ **Ownership transfer**
- ❌ **Email-domain verification** of nonprofits
- ❌ Churches, clubs, or anything that isn't a verified 501(c)(3)

**Platform**

- ❌ **Superadmin** pages and manual review. Problems are fixed directly in the Convex dashboard.
- ❌ **Mobile app.** The code folder stays in the repo, but nothing is built.
- ❌ Minors (under 18)
- ❌ First-time **tutorial**, **about** page, and **2FA** (unless decided otherwise; see §10)

---

## 9. Decisions log

| Date       | Decision                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-17 | One account type. Nonprofits are GitHub-org-like entities that people create and join.                                                                        |
| 2026-10-17 | Web first. The mobile folder is kept because it doesn't interfere; mobile is built later.                                                                     |
| 2026-10-17 | Onboarding uses a **shared fixed tag list** (tap to pick); no free-text/AI in the MVP.                                                                        |
| 2026-10-17 | Matching uses **both interests (causes) and skills**.                                                                                                         |
| 2026-10-17 | No posts in the MVP (definitely later). No comments.                                                                                                          |
| 2026-10-17 | Loves: public count + feed boost.                                                                                                                             |
| 2026-10-17 | Volunteer profiles are visible only to nonprofits they signed up with. The sign-up popup asks for notes and phone-sharing consent.                            |
| 2026-10-17 | Logged out: preview cards only. Logged in: address visible without signing up.                                                                                |
| 2026-10-17 | Events have roles → shifts. One shift per event per volunteer.                                                                                                |
| 2026-10-17 | No waitlist, no recurring events, no urgent flag in the MVP.                                                                                                  |
| 2026-10-17 | Edits/cancellations notify sign-ups. Volunteers can cancel.                                                                                                   |
| 2026-10-17 | Address is optional. With no address there's no distance filtering.                                                                                           |
| 2026-10-17 | 18+ only. No hours tracking in the MVP.                                                                                                                       |
| 2026-10-18 | Onboarding is skippable via a light-grey "Skip this step →".                                                                                                  |
| 2026-10-18 | Choosing a shift replaces "how long are you staying"; extra notes stay.                                                                                       |
| 2026-10-18 | No paid notifications → **in-app notifications only**. The admin is notified when a volunteer cancels.                                                        |
| 2026-10-18 | "I am 18 or older" checkbox instead of a date of birth.                                                                                                       |
| 2026-10-18 | Logged-out card → **limited event page** (dynamic route) with a sign-up prompt. Cards show the love count.                                                    |
| 2026-10-18 | Pages include **My sign-ups** and **Following**.                                                                                                              |
| 2026-10-18 | **Only 501(c)(3) nonprofits, no exceptions.** **Automatic** EIN verification; no manual/superadmin review.                                                    |
| 2026-10-18 | The nonprofit uses its **official IRS name**. No location restriction on nonprofits.                                                                          |
| 2026-10-18 | MVP: only the **owner** adds/removes members. Members can leave. No ownership transfer. Owner can delete the nonprofit.                                       |
| 2026-10-18 | MVP: **no admin/member split.** Every member has full powers (unlabeled). Members see who loved their events.                                                 |
| 2026-10-18 | Sidebar has search, distance, and tag filters.                                                                                                                |
| 2026-10-18 | Events can have a cover photo; nonprofits can have a logo.                                                                                                    |
| 2026-10-18 | Login: **email + password and Google sign-in.** **No Resend / no email service** in the MVP.                                                                  |
| 2026-10-18 | Backend: **Convex**. Hosting: **Vercel** (the project owner's account).                                                                                       |
| 2026-10-18 | Repo: private `Apurva-26/love-mvp`, separate from upstream `KirillMcQ/love-app`, to be merged back eventually.                                                |
| 2026-10-18 | Workflow: collaborators + branches + PRs (no forks). `main` is protected: PR required, 0 approvals, automatic Copilot review.                                 |
| 2026-10-18 | Git hooks: keep `pre-commit` (auto-format). Drop `pre-push` and commit-message rules (commitlint). Remove the paid-only CodeQL and dependency-review CI jobs. |
| 2026-10-18 | Web structure follows the AP-Students repo: a single `apps/web/src/components` folder (`ui/`, `auth/`, `global/`, per-feature folders).                       |

## 10. Open questions

Product details are raised when the feature is being built.

| #   | Question                                                                                                             | Notes                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Should onboarding ask **"what kinds of tasks are you comfortable with?"**                                            | Proposed multi-select: 🪑 Sitting tasks · 🧍 Standing for a while · 🚶 Walking around · 📦 Lifting and carrying · 🌳 Outdoor work. Roles would be tagged the same way. |
| Q2  | **How does the owner invite members** without email?                                                                 | Proposed: the owner copies an **invite link** and sends it however they like (text, their own email). The person opens it, logs in, and joins.                         |
| Q3  | Is there a **"Loved events"** page in the MVP?                                                                       | Not yet decided.                                                                                                                                                       |
| Q4  | **First-time tutorial**, **about page**, **2FA**: MVP or later?                                                      | From the client notes. Currently assumed later.                                                                                                                        |
| Q5  | **Dependabot:** pause it (set `open-pull-requests-limit: 0`) or keep it?                                             |                                                                                                                                                                        |
| Q6  | **Route names:** rename `/sign_up` → `/signup`, `/log_in` → `/login`, and make `/homepage` the real `/`?             | [pages.md](pages.md) uses the proposed names.                                                                                                                          |
| Q7  | When a nonprofit **edits a shift time or deletes a role** that people signed up for, what happens to those sign-ups? | Cancel them and notify? Keep them and notify?                                                                                                                          |
| Q8  | Can nonprofit members **sign up as volunteers** for their own nonprofit's events?                                    |                                                                                                                                                                        |
| Q9  | Can a volunteer sign up for two events whose **times overlap**?                                                      |                                                                                                                                                                        |
| Q10 | **Account deletion** in the MVP?                                                                                     |                                                                                                                                                                        |
| Q11 | **Required fields** when creating an event (is a cover photo required? coordinator contact?)                         |                                                                                                                                                                        |
| Q12 | What should the **forgot-password note** say, given no reset email?                                                  |                                                                                                                                                                        |
| Q13 | What exactly do **logged-out preview cards** show?                                                                   | The client notes say city + ZIP, no street address. See [design-inventory.md](design-inventory.md).                                                                    |

## 11. Starter tag lists (owned by the team; edit freely)

**Causes:**

- Food & hunger
- Seniors
- Kids & education
- Animals
- Outdoors & environment
- Housing & repair
- Health
- Arts & culture
- Community events
- Veterans
- Disaster relief

**Skills:**

- Cooking
- Driving
- Building & repair
- Teaching / tutoring
- Office & computer
- Setup & lifting
- First aid / medical
- Spanish
- Music & arts
- Gardening
- Fundraising
- Photography
- Just happy to help

**Free times:**

- Weekday mornings
- Weekday afternoons
- Weekday evenings
- Weekends

**Travel distance:**

- 5 miles
- 15 miles
- Anywhere

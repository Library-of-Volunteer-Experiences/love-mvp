# LOVE: Product Vision

> **LOVE (Library of Volunteer Experiences)** is a social platform where volunteers discover, love, and
> sign up for events posted by verified nonprofits, and where nonprofits find the help they need,
> including on short notice.

- **Client:** Fannin County, Georgia
- **Last updated:** 2026-10-18
- **Related:** [MVP requirements](mvp-requirements.md) · [Pages](pages.md) · [Design inventory](design-inventory.md)

This document describes the **whole product**, including features planned after the MVP. What is
in the first version is defined in [mvp-requirements.md](mvp-requirements.md).

---

## 1. The problem

**Volunteers**

- Don't know where to find opportunities.
- Existing tools are hard for ordinary people, and especially older people, to use.

**Nonprofits**

- Have no budget for recruiting.
- Can't find people on short notice.
- Have nothing that connects many nonprofits to many volunteers in one place.

**Existing services**

- Are "glorified calendars."
- Don't take people's skills into account.
- Don't send notifications.

## 2. The idea

LOVE works like a **social media app for volunteering**:

- **Volunteers** get a personal **feed** of events that match their **interests and skills**. They can
  ❤️ love events, follow nonprofits, and sign up for a specific role and shift in a couple of taps.
- **Nonprofits** have a public **page** and post **events**. Each event has **roles**, each role has
  **shifts**, and each shift has a number of open spots. Nonprofits see who signed up and how to
  reach them.
- **Anyone can browse** a preview of what's happening. Signing in unlocks the full details (such as
  the exact address) and the ability to sign up.

## 3. Who uses it

| Person                         | What they want                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Volunteer** (any adult, 18+) | Find meaningful things to do nearby that fit their interests, skills, and schedule, without fighting the website |
| **Nonprofit member**           | Post events, fill roles, see who's coming, and update people when plans change                                   |
| **Visitor** (not signed in)    | Get a feel for what's available and be clearly invited to sign up                                                |

**The user base skews older**, so ease of use is a core requirement, not polish: large text, large
buttons, few steps, plain language. See
[accessibility standards](../architecture/accessibility.md).

## 4. Core concepts

| Concept        | Meaning                                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Account**    | There is **one kind of account**. Every account is a person. Nobody signs up "as a nonprofit."                                                                                                           |
| **Nonprofit**  | A separate entity, like a GitHub organization. Any person can create one (with the **+** button) if it passes verification. The creator is the **owner**.                                                |
| **Membership** | A person's link to a nonprofit. Members act on the nonprofit's behalf.                                                                                                                                   |
| **Event**      | Something a nonprofit is running: name, description, location, date, cover photo, tags.                                                                                                                  |
| **Role**       | A job within an event (e.g. "Kitchen helper"), with its own description and tags.                                                                                                                        |
| **Shift**      | A time block for a role (e.g. 9–11 AM) with its own number of spots.                                                                                                                                     |
| **Sign-up**    | A volunteer taking a spot in one shift, with optional notes and optional phone sharing.                                                                                                                  |
| **Love** ❤️    | A public "I like this" on an event. It also teaches the feed what the user likes.                                                                                                                        |
| **Follow**     | A volunteer subscribing to a nonprofit. That nonprofit's events rank higher in their feed.                                                                                                               |
| **Tags**       | One shared list of **causes** (what you care about) and **skills** (what you can do). Volunteers pick tags about themselves; nonprofits tag their events and roles the same way. Matching compares them. |

## 5. Who can be on LOVE

- **Volunteers:** adults only (18+). No minors.
- **Nonprofits:** **registered 501(c)(3) nonprofits only, with no exceptions.** Verification is
  **automatic**: the EIN is checked against IRS tax-exempt records. There is no human review queue.
- **Location:** built for Fannin County, but nothing restricts it to one place. It could be used
  anywhere.

## 6. How matching works

### MVP: tag-based, no AI

Each user's feed is ranked by a points formula:

- **Points for:** matching causes, matching skills, fitting the user's usual free times, following
  the nonprofit, having loved its events before, being nearby, happening soon, and popularity.
- **Excluded first:** events that are past, full, too far away, or already signed up for.

Details are in [mvp-requirements.md §4](mvp-requirements.md#4-feed-and-matching).

### Later: AI on top of the tags

- Users describe themselves in free text, and AI turns that text into the same tags.
- Event descriptions get tagged the same way.
- Matches can carry a plain-language reason ("You mentioned baking; this role is kitchen prep").

The original design for this is in [ai-matching.md](../architecture/ai-matching.md).

## 7. Principles

1. **Easy for older adults.** If a 75-year-old can't do it on the first try, it isn't done.
2. **Privacy by default.**
   - Volunteers' details are only seen by the nonprofits they signed up with.
   - Phone numbers are shared only with consent.
   - Exact event addresses are shown only to signed-in users.
3. **Trust.** Only verified nonprofits can post.
4. **Free to run.** The MVP uses only free tiers (Convex, Vercel). Nothing that costs per message.
5. **Social, but not a chat app.** The client is not keen on chat features.

## 8. Roadmap after the MVP

Features planned for after the MVP, roughly grouped. Order is not decided.

**Social**

- **Posts** from nonprofits (updates, photos, thank-yous), mixed into the feed. Members can see
  who liked them.
- Loves feeding more strongly into the algorithm (e.g. showing more from nonprofits you love).

**Events**

- **Urgent / short-notice** events, flagged and boosted.
- **Recurring** events ("every Tuesday").
- **Waitlists** when a shift is full.
- Signing up for **more than one shift** of the same event.
- A **cancellation cutoff** (e.g. no cancelling within 24 hours).

**Nonprofits**

- **Admin and member roles**, separated (in the MVP every member has full powers).
- **Ownership transfer.**
- **Email-domain verification** (proving the person belongs to the nonprofit) on top of the EIN
  check.

**Matching**

- **AI matching** from free-text descriptions.

**Communication**

- **Email notifications.** Needs a sending domain (~$10–15/year) and an email service such as
  Resend.
- Password reset, email verification, and invite emails.
- **SMS** for urgent needs (costs money per message).

**Tracking**

- **Volunteer hours tracking.**

**Platform**

- **Superadmin tools:** a page for site operators to remove bad content or accounts.
- **Mobile app** (Expo). The web app is built so mobile can reuse the same backend.
- **First-time tutorial** and an **about page**.
- 2FA (nonprofits).

## 9. Technology

| Area           | Choice                                                           |
| -------------- | ---------------------------------------------------------------- |
| Web            | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend        | **Convex** (database, server functions, file storage, auth)      |
| Login          | Email + password, and Google sign-in                             |
| Hosting        | Vercel                                                           |
| Mobile (later) | Expo / React Native, calling the same Convex backend             |
| Repo           | Monorepo (`apps/web`, `apps/mobile`, `packages/*`)               |

The web app's folder layout is modeled on the AP-Students website repo: one `src/components` folder
with `ui/`, `global/`, and per-feature folders.

# AI-ready skill matching

**Status:** designed, not implemented. No AI code or AI vendor SDK exists in the repository. This
page describes where it will go so that early decisions don't block it.

## Goal

Let volunteers describe themselves in plain language, and find good opportunities without filling
out long checkbox forms — which matters for older users.

| Volunteer writes                  | System understands                          |
| --------------------------------- | ------------------------------------------- |
| "I teach kids math."              | tutoring, mathematics, working with youth   |
| "I have construction experience." | construction, carpentry, physical labor     |
| "I can use Excel."                | spreadsheets, data entry, office/admin      |
| "I speak Spanish."                | Spanish language, translation, interpreting |

## Pipeline

```
Volunteer.skillDescription ──► SkillExtractionProvider.extractSkills()
                                     │  ExtractedSkill[] (category, confidence)
                                     ▼
                               EmbeddingProvider.embed()
                                     │  number[][]
                                     ▼
                               VectorIndexProvider.upsert('volunteer-skills')
                                     │
Event.requiredSkills/desiredSkills ──┴─► (same steps) ─► upsert('event-requirements')
                                     │
                                     ▼
                               MatchingEngine.findMatchesForVolunteer()
                                     │  similarity × distance × availability
                                     ▼
                               OpportunityMatch { matchScore 0–100, matchReason }
```

## Where each piece lives

| Piece                                                                  | Location                                                                                                                  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Interfaces                                                             | `packages/backend/src/interfaces/AIProvider.ts`                                                                           |
| Vendor implementations (OpenAI, Anthropic, Azure OpenAI, local models) | `packages/backend/src/providers/<vendor>/` (only place AI SDKs may be imported)                                           |
| Vector storage                                                         | The backend provider (Convex vector index, Supabase pgvector, Firestore vector search) implementing `VectorIndexProvider` |
| Matching logic (vendor-neutral)                                        | `packages/backend/src/matching/` (future) implementing `MatchingEngine`                                                   |
| Derived data model                                                     | `VolunteerSkillProfile` in `@love/shared`; `skillProfiles` collection                                                     |
| Weights and thresholds                                                 | `MatchingConfig` / `DEFAULT_MATCHING_CONFIG` in `@love/shared`                                                            |
| Selection and kill switch                                              | `AI_PROVIDER`, `AI_*_MODEL` env vars; `aiMatching` feature flag (off by default; also off whenever `AI_PROVIDER=none`)    |
| Triggering                                                             | Background job after a volunteer/event is created or updated — never inline in a request the user is waiting on           |

## Design rules

1. **The user's words are the source of truth.** `skillDescription` is never rewritten. AI output
   is stored separately (`VolunteerSkillProfile`) with `extractorVersion` / `embeddingModel`, so it
   can be regenerated when models change and deleted on request.
2. **Explainable matches.** Every `OpportunityMatch` carries a plain-language `matchReason`.
   Volunteers and nonprofits should understand why a match was suggested.
3. **Works without AI.** A deterministic fallback (keyword overlap + distance + availability) must
   implement `MatchingEngine` too, so the platform functions when `AI_PROVIDER=none`, during an
   outage, or if the county decides not to use AI.
4. **Humans decide.** Matches are suggestions (`status: 'pending'`). AI never auto-assigns anyone
   to an event.
5. **Fairness.** Matching must not use age, date of birth, or protected characteristics as inputs.
   Distance and availability are the only non-skill factors.

## Privacy and security

- Send the **minimum** to an AI vendor: the skill text only — never names, emails, phone numbers,
  addresses, or dates of birth. Strip obvious PII from free text before sending.
- Use vendors/contracts that do not train on submitted data; record the choice in an ADR.
- Treat model output as **untrusted input**: validate it with Zod (`ExtractedSkill` shape,
  confidence 0–1, bounded lengths) before storing. Never execute or render it as HTML.
- Prompt-injection resistance: the extraction prompt treats the volunteer's text as data only; the
  model has no tools and no access to other records.
- AI API keys live only in server env (`AI_API_KEY`), are read through `@love/config`, and are
  required at startup when `AI_PROVIDER` is not `none`.
- Log extraction failures by volunteer ID only, never the text.

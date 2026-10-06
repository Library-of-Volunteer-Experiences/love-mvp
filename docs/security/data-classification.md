# Data classification

Every field LOVE stores falls into one class. The class decides how it is stored, who can see it,
and whether it may ever appear in logs. When you add a field to `@love/shared`, add it here in the
same PR.

| Class          | Meaning                                   | At rest                                                                      | In logs                           |
| -------------- | ----------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| **Public**     | Intended for anyone who uses the platform | Provider encryption                                                          | Allowed                           |
| **Internal**   | Identifiers and operational data          | Provider encryption                                                          | Allowed (IDs only)                |
| **PII**        | Identifies or contacts a person           | Provider encryption; access via guards                                       | **Never** (unless approved below) |
| **Restricted** | Harmful if leaked; or a credential        | Field-level encryption or hashed; never returned to clients unless essential | **Never**                         |

## Field inventory

| Model / field                                                                            | Class      | Notes                                                                                     |
| ---------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| `*.id`, `createdAt`, `updatedAt`                                                         | Internal   | Log freely                                                                                |
| `Volunteer.fullName`, `email`, `phone`, `address`                                        | PII        | Visible to the volunteer, admins, and nonprofits only after the volunteer accepts a match |
| `Volunteer.dob`                                                                          | Restricted | Needed only for age eligibility; never shown to nonprofits; never used in matching        |
| `Volunteer.availability`, `matchRadius`                                                  | PII        | Reveals routine/location                                                                  |
| `Volunteer.skillDescription`                                                             | PII        | Free text may contain personal details                                                    |
| `VolunteerSkillProfile.*`                                                                | PII        | Derived from free text                                                                    |
| `Nonprofit.name`, `description`, `website`, `logoUrl`, `officeAddress`, `phone`, `email` | Public     | Organizational contact info                                                               |
| `Event.*` (except `coordinatorContact`)                                                  | Public     |                                                                                           |
| `Event.coordinatorContact`                                                               | PII        | Shown to matched volunteers                                                               |
| `OpportunityMatch.matchScore`, `status`                                                  | Internal   |                                                                                           |
| `OpportunityMatch.matchReason`                                                           | PII        | May quote skill text                                                                      |
| `OrganizationMembership.*`                                                               | Internal   |                                                                                           |
| Passwords                                                                                | Restricted | Never stored by LOVE code; hashed by the auth provider                                    |
| Session / magic-link / reset tokens                                                      | Restricted | HttpOnly cookie or SecureStore only                                                       |
| MFA secrets, recovery codes                                                              | Restricted | Encrypted (secrets) / hashed (recovery codes) by the auth provider                        |
| API keys, provider credentials                                                           | Restricted | Server env vars only                                                                      |

## Approved exceptions for logging PII

_None._ Exceptions require a PR to this table with a reason, retention period, and reviewer
approval.

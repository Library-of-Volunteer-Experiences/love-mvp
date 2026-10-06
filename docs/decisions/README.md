# Architecture Decision Records

Short documents that capture **why** a significant decision was made, so future maintainers don't
have to guess. Format: [MADR](https://adr.github.io/madr/)-lite (see `0000-template.md`).

| #    | Decision                                                                                         | Status   |
| ---- | ------------------------------------------------------------------------------------------------ | -------- |
| 0001 | [Monorepo with npm workspaces + Turborepo](0001-monorepo-turborepo.md)                           | Accepted |
| 0002 | [Provider-agnostic backend behind interfaces](0002-backend-provider-abstraction.md)              | Accepted |
| 0003 | [Convex as the initial backend provider](0003-convex-initial-provider.md)                        | Proposed |
| 0004 | [Next.js web as primary platform and API; Expo as API client](0004-web-primary-mobile-client.md) | Accepted |
| 0005 | [Explicit RBAC permission matrix with organization memberships](0005-rbac-permission-matrix.md)  | Accepted |
| 0006 | [Single React version pinned to the Expo SDK](0006-single-react-version.md)                      | Accepted |

## When to write one

- Choosing or replacing a provider, framework, or major library.
- Changing a package boundary or dependency rule.
- Any exception to SECURITY.md or the accessibility standards.
- Anything a future maintainer might reasonably ask "why was it done this way?"

Copy `0000-template.md`, take the next number, and open a PR. Superseded ADRs are kept and marked
`Superseded by NNNN`.

## Summary

<!-- What does this change and why? Link the issue if there is one. -->

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor / chore
- [ ] Docs
- [ ] Security fix

## Security checklist (required — see SECURITY.md)

- [ ] No secrets, tokens, or real personal data committed
- [ ] All new inputs validated with a Zod schema from `@love/validation`
- [ ] Every new secure endpoint / server action calls an `@love/auth` guard
- [ ] No direct provider SDK or database access outside `packages/backend/src/providers`
- [ ] No `process.env` reads outside `@love/config`
- [ ] No passwords, tokens, or PII written to logs
- [ ] No security middleware, headers, or lint rules disabled
- [ ] New dependencies reviewed (maintained, license OK, `npm audit` clean)

## Accessibility checklist (UI changes — see docs/architecture/accessibility.md)

- [ ] Keyboard-only walkthrough works; focus is visible
- [ ] Interactive targets ≥ 44×44 px; body text ≥ 18px
- [ ] Labels on all form fields; errors announced to screen readers
- [ ] Contrast checked (AA minimum)

## Verification

- [ ] `npm run verify` passes locally
- [ ] Screenshots / recordings attached for UI changes

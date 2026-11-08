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
- [ ] Every new Convex function has an `args` validator (`v.*`)
- [ ] Every new Convex function that reads private data or changes anything gets the caller on the
      server (never from an argument) and checks ownership/membership
- [ ] Functions only the backend calls are `internalQuery` / `internalMutation` / `internalAction`
- [ ] No new data store or SDK besides Convex; no use of legacy `@love/backend` / `getBackend()`
- [ ] No `process.env` reads outside `@love/config` (Convex functions excepted)
- [ ] No passwords, tokens, or PII written to logs
- [ ] No security middleware, headers, or lint rules disabled
- [ ] New dependencies reviewed (maintained, license OK, `npm audit` clean)

## Accessibility checklist (UI changes — see docs/architecture/accessibility.md)

- [ ] Keyboard-only walkthrough works; focus is visible
- [ ] Interactive targets ≥ 44×44 px; body text ≥ 18px
- [ ] Labels on all form fields; errors announced to screen readers
- [ ] Contrast checked (AA minimum)

## Verification

- [ ] `npm run lint`, type-check, and `npm run build:web` pass locally
- [ ] Screenshots / recordings attached for UI changes

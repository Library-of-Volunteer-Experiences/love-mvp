# Accessibility standards

**Status: MANDATORY.** Accessibility is a first-class requirement. Many LOVE users are older adults,
who may have reduced vision, hearing, dexterity, or familiarity with technology. A feature that
isn't accessible isn't finished.

## Targets

- **WCAG 2.2 Level AA** conformance for web, and the equivalent for mobile.
- Where cheap, go beyond AA (several AAA criteria below) because of our audience.

## Requirements

### Large click/tap targets

- Interactive elements are at least **44 × 44 CSS px** (WCAG 2.5.5 AAA; 2.5.8 AA is 24px). All
  `@love/ui` button sizes, the dialog close button, and inputs (48px) meet this.
- At least 8px spacing between adjacent targets.
- Mobile: minimum 48 × 48 dp.

### Readable text

- Base font size **18px** (`html { font-size: 112.5% }`); body text never below 16px.
- Use `rem` units so browser/OS font-size settings scale everything. Never disable pinch-zoom.
- Line height ≥ 1.5; line length ≤ ~80 characters.
- Mobile: never set `allowFontScaling={false}`; layouts must survive 200% system font size.

### High contrast

- Text contrast ≥ **4.5:1** (AA); our tokens target ~7:1 (AAA) for body and muted text.
- UI component boundaries and focus indicators ≥ 3:1.
- `prefers-contrast: more` and an opt-in `.high-contrast` class strengthen text and borders
  (`packages/ui/src/styles/globals.css`). Dark mode tokens are provided.
- Never convey information by colour alone — pair with text or an icon.

### Keyboard navigation

- Everything works with keyboard only, in a logical tab order.
- Focus is always visible (3px ring, global `:focus-visible` fallback).
- A "Skip to main content" link is the first focusable element (root layout).
- Dialogs trap focus, close with Escape, and return focus to the trigger (Radix provides this).
- No keyboard traps; no positive `tabIndex`.

### Screen reader compatibility

- Semantic HTML first (`<button>`, `<nav>`, `<main>`, headings in order); ARIA only when needed.
- Every form field has a visible `<label>`; placeholders are never labels.
- Errors are linked with `aria-describedby` and `aria-invalid`, and announced (`role="alert"` or a
  live region). Inputs style `aria-invalid` automatically.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get an accessible name.
- Every dialog has a `DialogTitle`.
- Mobile: `accessibilityRole`, `accessibilityLabel`, and `accessibilityHint` on custom controls.

### Older-user-friendly design

- **Plain language.** Short sentences, everyday words ("Sign in", not "Authenticate").
- **One primary action per screen**; avoid crowded layouts.
- **Forgiving forms:** accept common formats (phone numbers with spaces/dashes), validate on blur
  not on every keystroke, keep user input after errors, explain how to fix each error.
- **Generous time:** 30-minute idle session timeout; warn before signing out; never use
  auto-advancing carousels or timed interactions.
- **Predictable navigation:** consistent placement, visible labels on icons, clear back paths.
- **Confirm destructive actions** in a dialog with explicit wording ("Delete event").
- **Passwordless options** (magic links) for users who struggle with passwords.
- **Reduced motion** respected (`prefers-reduced-motion` disables animation).
- Phone support contact visible for people who'd rather call.

## Testing (required for UI changes)

1. Keyboard-only walkthrough of the changed flow.
2. Screen reader spot check (NVDA or VoiceOver on web; VoiceOver/TalkBack on mobile).
3. Zoom to 200% — no loss of content or horizontal scrolling at 320px width.
4. Automated checks: `eslint-plugin-jsx-a11y` (in lint); add axe-based tests with the first real
   pages.
5. Contrast check for any new colour.

Record results in the PR's accessibility checklist.

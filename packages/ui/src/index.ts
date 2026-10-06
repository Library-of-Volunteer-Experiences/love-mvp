// ─────────────────────────────────────────────────────────────
// LOVE — Shared UI Components (shadcn/ui, new-york style)
// ─────────────────────────────────────────────────────────────
// Add components with the shadcn CLI from apps/web:
//   npx shadcn@latest add <component>
// The monorepo-aware CLI writes them into packages/ui/src/components.
//
// Only generic primitives belong here. Business-specific
// components (VolunteerCard, EventForm, ...) live in the apps.
// ─────────────────────────────────────────────────────────────

export * from './components/badge';
export * from './components/button';
export * from './components/card';
export * from './components/dialog';
export * from './components/input';
export * from './components/textarea';
export { cn } from './lib/utils';

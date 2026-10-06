# 0006. Pin one React version, chosen by the Expo SDK

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The initial scaffold paired Expo SDK 51 (React 18.2) with Next.js (React 19) in the same npm
workspace. Two React copies in one hoisted `node_modules` cause "invalid hook call" errors and type
conflicts that are painful to diagnose.

## Decision

- Expo SDK 57 pins React 19.2.3; Next.js 16 accepts any React 19.
- React and React DOM are pinned to that exact version in both apps and in the root `overrides`.
- Upgrade path: upgrade Expo first (`npx expo install expo@^<sdk> --fix` in `apps/mobile`), then
  align React everywhere. Dependabot ignores React / React Native minor and major bumps for this
  reason.

## Consequences

- Web cannot adopt a newer React minor until Expo supports it. That is acceptable, because Expo
  tracks React closely.

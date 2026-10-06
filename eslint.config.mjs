// ─────────────────────────────────────────────────────────────
// LOVE — Root ESLint flat config (applies to the whole monorepo)
// ─────────────────────────────────────────────────────────────
// Each workspace runs `eslint .`; ESLint resolves this file by
// walking up from the workspace directory.
//
// Several rules here ENFORCE architecture and security rules from
// SECURITY.md and ARCHITECTURE.md. Do not disable them without an
// approved ADR in docs/decisions/.
// ─────────────────────────────────────────────────────────────

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

const WEB_FILES = ['apps/web/**/*.{js,jsx,mjs,ts,tsx}'];
const REACT_NON_WEB_FILES = ['apps/mobile/**/*.{js,jsx,ts,tsx}', 'packages/ui/**/*.{ts,tsx}'];

/**
 * Provider SDKs may only be imported inside packages/backend/src/providers/**.
 * Everything else must talk to the backend through @love/backend interfaces.
 */
// Anchored regexes so relative paths like './providers/convex' are not matched.
const PROVIDER_SDK_PATTERNS = [
  {
    regex: '^(convex|@convex-dev/[^/]+)(/.*)?$',
    message: 'Provider SDKs are only allowed in packages/backend/src/providers. Use @love/backend.',
  },
  {
    regex: '^@supabase/',
    message: 'Provider SDKs are only allowed in packages/backend/src/providers. Use @love/backend.',
  },
  {
    regex: '^(firebase|firebase-admin|@firebase/[^/]+)(/.*)?$',
    message: 'Provider SDKs are only allowed in packages/backend/src/providers. Use @love/backend.',
  },
  {
    regex: '^(@aws-sdk/|@azure/|@prisma/|(pg|postgres|mysql2|mongodb|prisma)(/.*)?$)',
    message:
      'Data-store SDKs are only allowed in packages/backend/src/providers. Use @love/backend.',
  },
  {
    regex: '^(twilio|nodemailer|openai|@sendgrid/[^/]+|@anthropic-ai/[^/]+)(/.*)?$',
    message:
      'Notification/AI SDKs are only allowed in packages/backend/src/providers. Use @love/backend.',
  },
  {
    regex: '^@love/[^/]+/src(/.*)?$',
    message: 'Import workspace packages through their public entry point, not deep src paths.',
  },
];

const SECURITY_RULES = {
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.expo/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/next-env.d.ts',
      '**/expo-env.d.ts',
      'apps/mobile/ios/**',
      'apps/mobile/android/**',
    ],
  },

  // ── Base: all JS/TS ──────────────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      ...SECURITY_RULES,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': ['error', { patterns: PROVIDER_SDK_PATTERNS }],
    },
  },

  // ── Provider implementations: the ONLY place SDKs are allowed ─
  {
    files: ['packages/backend/src/providers/**/*.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },

  // ── process.env is read ONLY in @love/config (and tool config) ─
  {
    files: ['apps/web/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
    ignores: ['packages/config/src/**'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: 'Read configuration through @love/config, never process.env directly.',
        },
      ],
    },
  },

  // ── Web (Next.js) ────────────────────────────────────────────
  ...nextVitals.map((config) => ({ ...config, files: WEB_FILES })),
  {
    files: WEB_FILES,
    settings: { react: { version: '19.2' } },
    rules: {
      'react/no-danger': 'error',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  // ── React outside Next (mobile + shared UI) ──────────────────
  {
    files: REACT_NON_WEB_FILES,
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    settings: { react: { version: '19.2' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/no-danger': 'error',
    },
  },
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    rules: { ...jsxA11y.flatConfigs.recommended.rules },
  },

  // ── Mobile must not bundle server-only packages ──────────────
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...PROVIDER_SDK_PATTERNS,
            {
              regex: '^@love/(backend|config|auth|ui)(/.*)?$',
              message:
                'Server-only / web-only package. Mobile talks to the web API via @love/api-contracts.',
            },
          ],
        },
      ],
    },
  },

  // ── CommonJS config files (babel, metro) ─────────────────────
  {
    files: ['**/*.cjs', 'apps/mobile/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  // Must be last: turn off stylistic rules that conflict with Prettier.
  prettier
);

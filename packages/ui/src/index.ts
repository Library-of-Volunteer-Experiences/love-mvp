// ─────────────────────────────────────────────────────────────
// LOVE — UI Components
// ─────────────────────────────────────────────────────────────
// Shared UI components (shadcn/ui based)
// ─────────────────────────────────────────────────────────────

import * as React from 'react';

// Stubs for components that will be populated by shadcn/ui
export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
export const Card = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />;
export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />;
export const Dialog = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const Badge = (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />;

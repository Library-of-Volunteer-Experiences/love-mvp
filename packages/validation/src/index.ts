// ─────────────────────────────────────────────────────────────
// LOVE — Zod Validation Schemas
// ─────────────────────────────────────────────────────────────
// All input validation schemas for the LOVE platform.
// These schemas are shared between web and mobile apps
// and must be used for ALL API input validation.
//
// SECURITY: Every API endpoint, server action, and form must
// validate its input using these schemas. See SECURITY.md.
//
// Conventions:
// - Every string has an explicit max length (request size limits).
// - Objects are `.strict()` so unknown keys are rejected rather than
//   silently passed to the provider layer (mass-assignment defense).
// - Never accept `id`, `createdAt`, `updatedAt`, `role`, or ownership
//   fields from clients unless the endpoint explicitly needs them.
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';
import { NONPROFIT_MEMBER_ROLES } from '@love/shared';

// ─────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────

/** Opaque identifier issued by the backend provider. */
export const idSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid identifier');

export const emailSchema = z.email('Invalid email address').max(254);

export const phoneSchema = z
  .string()
  .trim()
  .max(32)
  .regex(/^\+?[\d\s\-().]{10,}$/, 'Invalid phone number');

export const zipCodeSchema = z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code');

/** http(s) only — rejects javascript:, data:, etc. (XSS defense). */
export const httpUrlSchema = z.url({ protocol: /^https?$/, error: 'Invalid URL' }).max(2048);

const timeOfDaySchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm format');

// ─────────────────────────────────────────────────────────────
// Common Schemas
// ─────────────────────────────────────────────────────────────

export const addressSchema = z
  .object({
    street: z.string().trim().min(1, 'Street is required').max(200),
    city: z.string().trim().min(1, 'City is required').max(100),
    state: z.string().trim().min(2, 'State is required').max(50),
    zipCode: zipCodeSchema,
    country: z.string().trim().length(2).default('US'),
  })
  .strict();

export const contactInfoSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: emailSchema,
    phone: phoneSchema,
  })
  .strict();

export const availabilitySchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: timeOfDaySchema,
    endTime: timeOfDaySchema,
  })
  .strict()
  .refine((a) => a.endTime > a.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

export const paginationSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

// ─────────────────────────────────────────────────────────────
// Volunteer Schemas
// ─────────────────────────────────────────────────────────────

export const createVolunteerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: emailSchema,
    phone: phoneSchema,
    dob: z.iso.date('Use YYYY-MM-DD format'),
    address: addressSchema,
    availability: z.array(availabilitySchema).max(50).default([]),
    skillDescription: z.string().trim().max(2000, 'Skill description too long').default(''),
    matchRadius: z.number().positive('Match radius must be positive').max(500).default(25),
  })
  .strict();

export const updateVolunteerSchema = createVolunteerSchema.partial();

// ─────────────────────────────────────────────────────────────
// Nonprofit Schemas
// ─────────────────────────────────────────────────────────────

export const createNonprofitSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(200),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
    phone: phoneSchema,
    email: emailSchema,
    website: httpUrlSchema.or(z.literal('')).default(''),
    officeAddress: addressSchema,
    logoUrl: httpUrlSchema.or(z.literal('')).default(''),
  })
  .strict();

export const updateNonprofitSchema = createNonprofitSchema.partial();

export const organizationMembershipSchema = z
  .object({
    nonprofitId: idSchema,
    userId: idSchema,
    memberRole: z.enum(NONPROFIT_MEMBER_ROLES),
  })
  .strict();

// ─────────────────────────────────────────────────────────────
// Event Schemas
// ─────────────────────────────────────────────────────────────

/**
 * Base object without cross-field refinements. Zod forbids `.partial()`
 * / `.omit()` on refined object schemas, so derive variants from this.
 */
const eventBaseSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(200),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
    location: z.string().trim().min(1, 'Location is required').max(300),
    city: z.string().trim().min(1, 'City is required').max(100),
    zipCode: zipCodeSchema,
    startTime: z.iso.datetime({ offset: true, error: 'Invalid date/time' }),
    endTime: z.iso.datetime({ offset: true, error: 'Invalid date/time' }),
    capacity: z.number().int().positive('Capacity must be positive').max(10000),
    desiredSkills: z.array(z.string().trim().min(1).max(200)).max(50).default([]),
    requiredSkills: z.array(z.string().trim().min(1).max(200)).max(50).default([]),
    coordinatorContact: contactInfoSchema,
    nonprofitId: idSchema,
  })
  .strict();

const endAfterStart = (data: { startTime?: string; endTime?: string }) =>
  !data.startTime || !data.endTime || new Date(data.endTime) > new Date(data.startTime);

const endAfterStartIssue = { message: 'End time must be after start time', path: ['endTime'] };

export const createEventSchema = eventBaseSchema.refine(endAfterStart, endAfterStartIssue);

/** The owning nonprofit of an event cannot be changed after creation. */
export const updateEventSchema = eventBaseSchema
  .omit({ nonprofitId: true })
  .partial()
  .refine(endAfterStart, endAfterStartIssue);

// ─────────────────────────────────────────────────────────────
// Shift sign-up (the event page's sign-up popup)
// ─────────────────────────────────────────────────────────────

/**
 * What the volunteer enters in the sign-up popup. `newPhone` is only filled
 * when they have no saved phone and want to share one ('' otherwise).
 * The Convex mutation must re-check everything (spots, one shift per event).
 */
export const shiftSignupSchema = z
  .object({
    shiftId: z.string().min(1, 'Please pick a shift').pipe(idSchema),
    notes: z.string().trim().max(500, 'Please keep notes under 500 characters'),
    sharePhone: z.boolean(),
    newPhone: z
      .string()
      .trim()
      .max(32)
      .refine(
        (value) => value === '' || phoneSchema.safeParse(value).success,
        'Enter a phone number with area code, like 706-555-0100'
      ),
  })
  .strict();

// ─────────────────────────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────────────────────────

/**
 * Password policy follows NIST SP 800-63B: length over composition.
 * A passphrase of 12+ characters is easier for older users to remember
 * than a short string of mixed symbols, and is stronger.
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be at most 128 characters');

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    fullName: z.string().trim().min(2).max(100),
    /** Self-service sign-up can never grant admin/superadmin. */
    role: z.enum(['volunteer', 'nonprofit']),
  })
  .strict();

export const signInSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required').max(128),
  })
  .strict();

export const magicLinkRequestSchema = z.object({ email: emailSchema }).strict();

export const resetPasswordSchema = z.object({ email: emailSchema }).strict();

export const mfaCodeSchema = z
  .object({ code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code') })
  .strict();

// ─────────────────────────────────────────────────────────────
// Type exports (inferred from schemas)
// ─────────────────────────────────────────────────────────────

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>;
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>;
export type CreateNonprofitInput = z.infer<typeof createNonprofitSchema>;
export type UpdateNonprofitInput = z.infer<typeof updateNonprofitSchema>;
export type OrganizationMembershipInput = z.infer<typeof organizationMembershipSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ShiftSignupInput = z.infer<typeof shiftSignupSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type MagicLinkRequestInput = z.infer<typeof magicLinkRequestSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type MfaCodeInput = z.infer<typeof mfaCodeSchema>;

export { z };

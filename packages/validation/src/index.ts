// ─────────────────────────────────────────────────────────────
// LOVE — Zod Validation Schemas
// ─────────────────────────────────────────────────────────────
// All input validation schemas for the LOVE platform.
// These schemas are shared between web and mobile apps
// and must be used for ALL API input validation.
//
// SECURITY: Every API endpoint must validate its input
// using these schemas. See SECURITY.md for details.
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Common Schemas
// ─────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('US'),
});

export const contactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number'),
});

export const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
});

// ─────────────────────────────────────────────────────────────
// Volunteer Schemas
// ─────────────────────────────────────────────────────────────

export const createVolunteerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number'),
  dob: z.string().datetime({ message: 'Invalid date format' }),
  address: addressSchema,
  availability: z.array(availabilitySchema).default([]),
  skillDescription: z.string().max(2000, 'Skill description too long').default(''),
  matchRadius: z.number().positive('Match radius must be positive').max(500).default(25),
});

export const updateVolunteerSchema = createVolunteerSchema.partial();

// ─────────────────────────────────────────────────────────────
// Nonprofit Schemas
// ─────────────────────────────────────────────────────────────

export const createNonprofitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid URL').or(z.literal('')).default(''),
  officeAddress: addressSchema,
  logoUrl: z.string().url('Invalid URL').or(z.literal('')).default(''),
});

export const updateNonprofitSchema = createNonprofitSchema.partial();

// ─────────────────────────────────────────────────────────────
// Event Schemas
// ─────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  location: z.string().min(1, 'Location is required').max(300),
  city: z.string().min(1, 'City is required').max(100),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  startTime: z.string().datetime({ message: 'Invalid date format' }),
  endTime: z.string().datetime({ message: 'Invalid date format' }),
  capacity: z.number().int().positive('Capacity must be positive').max(10000),
  desiredSkills: z.array(z.string().max(200)).default([]),
  requiredSkills: z.array(z.string().max(200)).default([]),
  coordinatorContact: contactInfoSchema,
  nonprofitId: z.string().min(1, 'Nonprofit ID is required'),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  { message: 'End time must be after start time', path: ['endTime'] }
);

export const updateEventSchema = createEventSchema.partial().omit({ nonprofitId: true });

// ─────────────────────────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────────────────────────

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  fullName: z.string().min(2).max(100),
  role: z.enum(['volunteer', 'nonprofit']),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ─────────────────────────────────────────────────────────────
// Type exports (inferred from schemas)
// ─────────────────────────────────────────────────────────────

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>;
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>;
export type CreateNonprofitInput = z.infer<typeof createNonprofitSchema>;
export type UpdateNonprofitInput = z.infer<typeof updateNonprofitSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["PROFESSIONAL", "CUSTOMER"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createSlotSchema = z.object({
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const createRecurringSchema = z.object({
  // days: JS Date.getDay() values — 0=Sun, 1=Mon … 6=Sat
  days: z.array(z.number().int().min(0).max(6)).min(1, "Select at least one day"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time (expected HH:MM)"),
  endTime:   z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time (expected HH:MM)"),
  durationMinutes: z.number().int().positive("Duration must be positive"),
  weeksAhead: z.number().int().min(1).max(12, "Maximum 12 weeks"),
}).refine((d) => d.endTime > d.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;

export const updateProfileSchema = z.object({
  name:       z.string().min(2, "Name must be at least 2 characters").max(80),
  speciality: z.string().max(60, "Title too long").optional().or(z.literal("")),
  tagline:    z.string().max(100, "Tagline must be 100 characters or fewer").optional().or(z.literal("")),
  bio:        z.string().max(600, "Bio must be 600 characters or fewer").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createBookingSchema = z.object({
  slotId: z.string().min(1, "Slot ID is required"),
  notes: z.string().max(500, "Notes too long").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateSlotInput = z.infer<typeof createSlotSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

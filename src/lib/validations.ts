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

export const createBookingSchema = z.object({
  slotId: z.string().min(1, "Slot ID is required"),
  notes: z.string().max(500, "Notes too long").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateSlotInput = z.infer<typeof createSlotSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

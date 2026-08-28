import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Valid email is required")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required")
    .max(50, "Password cannot exceed 50 characters"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters"),

  email: z
    .email("Valid email is required")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

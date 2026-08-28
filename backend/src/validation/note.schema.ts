import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .max(200, "Title cannot exceed 200 characters")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(1000, "Content cannot exceed 1000 characters"),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .max(200, "Title cannot exceed 200 characters")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(1000, "Content cannot exceed 1000 characters")
    .optional(),
});


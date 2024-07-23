import { z } from "zod";

export const createCategoryInput = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateCategoryInput = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
});

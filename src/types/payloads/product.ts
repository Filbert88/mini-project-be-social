import { z } from "zod";

export const createProductInput = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.number(),
});

export const updateProductInput = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.number(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.number(),
});

export const updateProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.number(),
});

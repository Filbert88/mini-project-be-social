import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import {
  createCategoryInput,
  updateCategoryInput,
} from "~/types/payloads/categories";

export const categoryRouter = createTRPCRouter({
  createCategory: publicProcedure
    .input(createCategoryInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .insert(categories)
          .values(input)
          .returning();
        return result[0];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }
    }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(categories);
  }),

  getCategoryById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const category = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input))
        .limit(1);
      if (!category.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      return category[0];
    }),

  updateCategory: publicProcedure
    .input(updateCategoryInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const result = await ctx.db
          .update(categories)
          .set(data)
          .where(eq(categories.id, id))
          .returning();
        return result[0];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update category",
        });
      }
    }),

  deleteCategory: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.delete(categories).where(eq(categories.id, input));
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete category",
        });
      }
    }),
});

import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import {
  createProductInput,
  updateProductInput,
} from "~/types/payloads/product";

export const productRouter = createTRPCRouter({
  createProduct: publicProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.insert(products).values(input).returning();
        return result[0];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
        });
      }
    }),

  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(products);
  }),

  getProductById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const product = await ctx.db
        .select()
        .from(products)
        .where(eq(products.id, input))
        .limit(1);
      if (!product.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return product[0];
    }),

  updateProduct: publicProcedure
    .input(updateProductInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const result = await ctx.db
          .update(products)
          .set(data)
          .where(eq(products.id, id))
          .returning();
        return result[0];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product",
        });
      }
    }),

  deleteProduct: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.delete(products).where(eq(products.id, input));
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product",
        });
      }
    }),
});

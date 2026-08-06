import { z } from "zod";
import { PRODUCT_TAGS, SIZES, SPORTS } from "@jerseyflow/config";

export const createProductSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 chars").max(10, "Code max 10 chars"),
  name: z.string().min(3, "Name must be at least 3 chars"),
  slug: z.string().min(3, "Slug required"),
  sport: z.enum(SPORTS).default("Football"),
  club: z.string().optional().nullable(),
  season: z.string().optional().nullable(),
  tags: z.array(z.enum(PRODUCT_TAGS)).default([]),
  description: z.string().optional().nullable(),
  basePrice: z.number().positive("Base price must be positive"),
  discountPrice: z.number().positive().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const inventoryStockSchema = z.object({
  productId: z.string().uuid(),
  variantName: z.string().default("Standard"),
  size: z.enum(SIZES),
  sku: z.string(),
  availableStock: z.number().int().min(0),
});

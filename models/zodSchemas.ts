// Global Imports
import { z } from "zod";

export const StoreSchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Store name is required" }),
});

export const BillboardSchema = z.object({
  label: z
    .string().trim()
    .min(1, { message: "Billboard name is required" }),
  imageUrl: z
    .string().trim()
    .min(1, { message: "Image is required" }),
});

export const CategorySchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Category name is required" }),
  billboardId: z
    .string().trim()
    .min(1, { message: "Billboard ID is required" }),
});

export const SizeSchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Size name is required" }),
  value: z
    .string().trim()
    .min(1, { message: "Size value is required" }),
});

export const ColorSchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Color name is required" }),
  value: z
    .string().trim()
    .min(4, { message: "Color value is required" })
    .regex(/^#/, { message: "Color value must be a valid hex code" }),
});
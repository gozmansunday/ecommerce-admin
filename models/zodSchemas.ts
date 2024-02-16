// Global Imports
import { z } from "zod";

export const createStoreSchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Store name is required" }),
});

export const editStoreSchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Store name is required" }),
});

export const createBillboardSchema = z.object({
  label: z
    .string().trim()
    .min(1, { message: "Store name is required" }),
  imageUrl: z
    .string().trim()
    .min(1, { message: "Image is required" }),
});

export const createCategorySchema = z.object({
  name: z
    .string().trim()
    .min(1, { message: "Store name is required" }),
  billboardId: z
    .string().trim()
    .min(1, { message: "Billboard ID is required" }),
});
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
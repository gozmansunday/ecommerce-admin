"use server";

// Global Imports
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Local Imports
import { createStoreSchema } from "@/models/zodSchemas";
import db from "../db/prisma";

export const createStoreFxn = async (values: z.infer<typeof createStoreSchema>) => {
  const { userId } = auth();
  const { name } = values;

  if (!userId || !name) {
    return;
  }

  const store = await db.store.create({
    data: {
      name: name,
      userId: userId,
    },
  });

  revalidatePath("/");
  return store;
};
"use server";

// Global Imports
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Local Imports
import { createStoreSchema, editStoreSchema } from "@/models/zodSchemas";
import db from "../db/prisma";

// Create Store
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

// Edit Store
export const editStoreFxn = async (
  values: z.infer<typeof editStoreSchema>,
  storeId: string
) => {
  const { userId } = auth();
  const { name } = values;

  if (!userId || !name || !storeId) {
    return;
  }

  const store = await db.store.updateMany({
    where: {
      id: storeId,
      userId: userId
    },
    data: {
      name: name,
    }
  });

  revalidatePath(`/${storeId}/settings`);
  revalidatePath(`/${storeId}`);
  revalidatePath(`/`);
};

// Delete Store
export const deleteStoreFxn = async (
  storeId: string
) => {
  const { userId } = auth();

  if (!userId || !storeId) {
    return;
  }

  const store = await db.store.deleteMany({
    where: {
      id: storeId,
      userId: userId
    },
  });

  revalidatePath("/");
};
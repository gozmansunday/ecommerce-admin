"use server";

// Global Imports
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

// Local Imports
import { createStoreSchema } from "@/models/zodSchemas";
import db from "../db/prisma";

export const createStoreFxn = async (values: z.infer<typeof createStoreSchema>) => {
  try {
    const { userId } = auth();
    const { name } = values;

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Store name is required!", { status: 400 });
    }

    const store = await db.store.create({
      data: {
        name: name,
        userId: userId,
      },
    });

    revalidatePath("/");
    return store;
  } catch (error) {
    console.log("Create Store Error: ", error);
    return new NextResponse("Internal error!", { status: 500 });
  }
};
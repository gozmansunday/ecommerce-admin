// Global Imports
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Local Imports
import db from "@/lib/db/prisma";

export async function PATCH(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required!", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required!", { status: 400 });
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

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required!", { status: 400 });
    }

    const store = await db.store.deleteMany({
      where: {
        id: storeId,
        userId: userId
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}
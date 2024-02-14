// Global Imports
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Local Imports
import db from "@/lib/db/prisma";

// GET Request
export async function GET(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    if (!storeId) {
      return new NextResponse("Store ID is required!", { status: 400 });
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

// POST Request
export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required!", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required!", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required!", { status: 400 });
    }

    const storeByUserId = db.store.findFirst({
      where: {
        id: storeId,
        userId
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized!", { status: 403 });
    }

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

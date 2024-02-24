// Global Imports
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Local Imports
import db from "@/lib/db/prisma";

// GET Request
export async function GET(
  req: Request,
  { params: { productId } }: { params: { productId: string } },
) {
  try {
    if (!productId) {
      return new NextResponse("Product ID is required!", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

// PATCH Request
export async function PATCH(
  req: Request,
  { params: { productId, storeId } }: { params: { productId: string, storeId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      images,
      price,
      categoryId,
      sizeId,
      colorId,
      isArchived,
      isFeatured,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required!", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("At least one image is required!", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required!", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required!", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required!", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required!", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required!", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required!", { status: 400 });
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

    await db.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        storeId,
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {}
        },
      },
    });

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)]
          }
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}

// DELETE Request
export async function DELETE(
  req: Request,
  { params: { productId, storeId } }: { params: { productId: string, storeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated!", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required!", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product ID is required!", { status: 400 });
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

    const product = await db.product.deleteMany({
      where: {
        id: productId,
        storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error.", { status: 500 });
  }
}
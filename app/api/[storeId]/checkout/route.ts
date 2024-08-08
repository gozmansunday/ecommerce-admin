// External Imports
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Local Imports
import db from "@/lib/db/prisma";
import { stripe } from "@/lib/utils/stripe";

const corHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corHeaders });
};

// GET Request
export async function POST(
  req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || !productIds.length) {
    return new NextResponse("Product IDs are required!", { status: 400 });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: Number(product.price) * 100,
      },
    });
  });

  const order = await db.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true
    },
    success_url: `${process.env.FRONTEND_STORE_URL}?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corHeaders,
  });
}

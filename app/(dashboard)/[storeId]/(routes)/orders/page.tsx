// Global Imports
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Local Imports
import { OrdersClient } from "@/components/orders/orders-client";
import { OrderColumn } from "@/components/orders/orders-column";
import db from "@/lib/db/prisma";
import { moneyFormatter } from "@/lib/utils/money";

interface Props {
  params: {
    storeId: string;
  };
};

const OrdersPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await db.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    totalPrice: moneyFormatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main className="flex flex-col py-6">
      <div>
        <OrdersClient
          orders={formattedOrders}
        />
      </div>
    </main>
  );
};

export default OrdersPage;
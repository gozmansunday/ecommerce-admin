// Local Imports
import db from "@/lib/db/prisma";

export const getSalesDetails = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((revenueTotal, order) => {
    const orderTotal = order.orderItems.reduce((orderTotal, orderItem) => {
      return orderTotal + Number(orderItem.product.price);
    }, 0);

    return revenueTotal + orderTotal;
  }, 0);

  const salesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  const productsInStock = await db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return {
    totalRevenue,
    sales: salesCount,
    products: productsInStock
  };
};
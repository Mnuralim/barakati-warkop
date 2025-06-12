"use server";

import prisma from "@/lib/prisma";
import { generateInvoicePDF, generateUniqueCode } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "./session";
import { invoiceDoc } from "@/lib/invoice";
import { imagekit } from "@/lib/imagekit";

interface OrderState {
  error: string | null;
}

export async function getOrders(
  searchQuery?: string,
  status?: OrderStatus,
  sortBy?: string,
  sortOrder?: string,
  startDate?: string,
  endDate?: string,
  code?: string
) {
  const where: OrderWhereInput = {
    AND: [],
  };

  if (searchQuery) {
    where.AND?.push({
      OR: [
        {
          code: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          customer_name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (status !== undefined) {
    where.AND?.push({
      status: {
        equals: status,
      },
    });
  }

  if (startDate && endDate) {
    where.AND?.push({
      created_at: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    });
  }

  if (code) {
    where.AND?.push({
      code: {
        contains: code,
        mode: "insensitive",
      },
    });
  }

  return await prisma.order.findMany({
    where,
    include: {
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
    orderBy: {
      [sortBy || "created_at"]: sortOrder || "desc",
    },
  });
}

export async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
  });
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({
    where: {
      id,
    },
  });
}

export async function createOrder(
  prevState: OrderState,
  formData: FormData
): Promise<OrderState> {
  const customerName = formData.get("name") as string;
  const generalNote = formData.get("generalNote") as string;
  const cart = formData.get("cart") as string;

  if (!customerName) {
    return { error: "Nama pemesan harus diisi" };
  }

  if (!cart) {
    return { error: "Data keranjang tidak ditemukan" };
  }

  const parsedCart = JSON.parse(cart);
  const menuIds = Object.keys(parsedCart);

  const menus = await prisma.menu.findMany({
    where: {
      id: {
        in: menuIds,
      },
    },
  });

  const orderItems = menuIds.map((menuId) => {
    const menu = menus.find((m) => m.id === menuId);
    const quantity = parsedCart[menuId];
    const itemNote = formData.get(`note-${menuId}`) as string;
    if (!menu) {
      throw new Error(`Menu dengan ID ${menuId} tidak ditemukan`);
    }
    return {
      menuId: menu.id,
      quantity,
      price: menu.price,
      note: itemNote || null,
    };
  });

  const totalPrice = orderItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  let uniqueCode = generateUniqueCode();

  const existingOrder = await prisma.order.findFirst({
    where: {
      code: uniqueCode,
    },
  });

  if (existingOrder) {
    uniqueCode = generateUniqueCode();
  }

  if (!uniqueCode) {
    return { error: "Gagal membuat kode unik" };
  }

  const createdOrder = await prisma.order.create({
    data: {
      code: uniqueCode,
      customer_name: customerName,
      note: generalNote,
      total_price: totalPrice,
      orderItems: {
        create: orderItems.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          note: item.note,
          menu_id: item.menuId,
        })),
      },
    },
  });

  revalidatePath("/admin/order");
  redirect(`/admin/order/${createdOrder.id}`);
}

export async function updateOrder(
  prevState: OrderState,
  formData: FormData
): Promise<OrderState> {
  const id = formData.get("id") as string;
  const orderStatus = formData.get("orderStatus") as OrderStatus;

  if (!id) {
    return { error: "ID order tidak ditemukan" };
  }

  if (!orderStatus) {
    return { error: "Status order tidak ditemukan" };
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });
  if (!order) {
    return { error: "Order tidak ditemukan" };
  }

  if (order.status === "COMPLETED") {
    return { error: "Pesanan sudah selesai" };
  }

  if (order.status === "CANCELLED") {
    return { error: "Pesanan sudah dibatalkan" };
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: orderStatus,
    },
    include: {
      orderItems: true,
    },
  });

  if (updatedOrder.status === "COMPLETED") {
    const orderDate = new Date(updatedOrder.created_at);
    orderDate.setHours(0, 0, 0, 0);

    const session = await verifySession();
    const report = await prisma.salesReport.findFirst({
      where: {
        date: orderDate,
        admin_id: session.userId,
      },
    });

    const totalItems = updatedOrder.orderItems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    if (report) {
      await prisma.salesReport.update({
        where: {
          id: report.id,
        },
        data: {
          total_items_sold: {
            increment: totalItems,
          },
          income: {
            increment: updatedOrder.total_price,
          },
          orders: {
            connect: {
              id,
            },
          },
        },
      });
    } else {
      await prisma.salesReport.create({
        data: {
          date: orderDate,
          total_items_sold: totalItems,
          income: updatedOrder.total_price,
          admin_id: session.userId as string,
          orders: {
            connect: {
              id,
            },
          },
        },
      });
    }
  }

  revalidatePath(`/admin/order/${id}`);
  redirect(`/admin/order/${id}`);
}

export async function createInvoice(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order dengan ID ${orderId} tidak ditemukan`);
    }

    if (order.status === "CANCELLED") {
      throw new Error(`Order dengan ID ${orderId} telah dibatalkan`);
    }

    if (order.status === "PROCESSING") {
      throw new Error(`Order dengan ID ${orderId} sedang diproses`);
    }

    if (order.invoice) {
      throw new Error(`Invoice untuk order dengan ID ${orderId} sudah dibuat`);
    }

    const doc = invoiceDoc(order);
    const pdfBuffer = await generateInvoicePDF(doc);

    const uploadResponse = await imagekit.upload({
      file: pdfBuffer,
      fileName: `invoice-${order.id}.pdf`,
      folder: "pemesanan/invoice",
      useUniqueFileName: true,
    });

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        invoice: uploadResponse.url,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Gagal membuat invoice");
  }
  revalidatePath(`/admin/order/${orderId}`);
}

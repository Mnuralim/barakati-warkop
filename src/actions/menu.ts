"use server";

import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { verifySession } from "./session";
import { revalidatePath } from "next/cache";
import { MenuType } from "@prisma/client";
import { redirect } from "next/navigation";

interface MenuState {
  error: string | null;
}

export async function getAllMenu(
  take: number,
  skip: number,
  category?: string,
  search?: string,
  menuType?: MenuType,
  sortBy?: string,
  sortMenu?: string
) {
  const whereCondition: MenuWhereInput = {};
  whereCondition.AND = [];

  if (search) {
    whereCondition.AND.push({
      name: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  if (category) {
    whereCondition.AND.push({
      categories: {
        some: {
          id: {
            equals: category,
          },
        },
      },
    });
  }

  if (menuType) {
    whereCondition.AND.push({
      menuType: {
        equals: menuType,
      },
    });
  }

  return await prisma.menu.findMany({
    where: whereCondition,
    take,
    skip,
    include: {
      categories: true,
    },
    orderBy: {
      [sortBy || "name"]: sortMenu || "asc",
    },
  });
}

export async function addMenu(
  prevState: MenuState,
  formData: FormData
): Promise<MenuState> {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const menuType = formData.get("menuType") as MenuType;
  const image = formData.get("image") as File;
  const categories = formData.getAll("category") as string[];
  const stock = formData.get("stock") as string;

  if (
    !name ||
    !price ||
    !image ||
    image.size === 0 ||
    !categories ||
    categories.length === 0 ||
    !stock
  ) {
    return { error: "Semua field harus diisi" };
  }

  let photoUrl = null;

  if (image && image.size > 0) {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const uploadFile = await imagekit.upload({
      file: imageBuffer,
      fileName: `${name}-${Date.now()}`,
      folder: `pemesanan/menu`,
    });
    photoUrl = uploadFile.url;
  }

  const session = await verifySession();

  await prisma.menu.create({
    data: {
      name,
      price: Number(price),
      status: stock === "Tersedia" ? true : false,
      admin_id: session.userId as string,
      menuType:
        menuType === "FOOD"
          ? "FOOD"
          : menuType === "BEVERAGE"
          ? "BEVERAGE"
          : "OTHER",
      categories: {
        connect: categories.map((category) => ({
          id: category,
        })),
      },
      image: photoUrl,
    },
  });

  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function deleteMenu(id: string) {
  await prisma.menu.delete({
    where: {
      id,
    },
  });
  revalidatePath("/admin/menu");
}

export async function updateMenu(
  prevState: MenuState,
  formData: FormData
): Promise<MenuState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const menuType = formData.get("menuType") as MenuType;
  const image = formData.get("image") as File;
  const categories = formData.getAll("category") as string[];
  const stock = formData.get("stock") as string;

  if (
    !name ||
    !price ||
    !image ||
    !categories ||
    categories.length === 0 ||
    !stock
  ) {
    return { error: "Semua field harus diisi" };
  }

  const currentMenu = await prisma.menu.findUnique({
    where: {
      id: id,
    },
    select: {
      image: true,
    },
  });

  if (!currentMenu) {
    return { error: "Menu tidak ditemukan" };
  }

  let photoUrl = currentMenu.image || null;

  if (image && image.size > 0) {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const uploadFile = await imagekit.upload({
      file: imageBuffer,
      fileName: `${name}-${Date.now()}`,
      folder: `pemesanan/menu`,
    });
    photoUrl = uploadFile.url;
  }

  await prisma.menu.update({
    where: {
      id: id,
    },
    data: {
      name,
      price: Number(price),
      status: stock === "Tersedia" ? true : false,
      menuType:
        menuType === "FOOD"
          ? "FOOD"
          : menuType === "BEVERAGE"
          ? "BEVERAGE"
          : "OTHER",
      categories: {
        connect: categories.map((category) => ({
          id: category,
        })),
      },
      image: photoUrl,
    },
  });

  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

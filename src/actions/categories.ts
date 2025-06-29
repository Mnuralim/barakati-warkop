import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getAllCategories = unstable_cache(
  async function getAllCategories() {
    return await prisma.category.findMany();
  }
);

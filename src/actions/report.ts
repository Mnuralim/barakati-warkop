"use server";
import prisma from "@/lib/prisma";

export async function getReports(
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortReport?: string
) {
  const where: ReportWhereInput = {
    AND: [],
  };

  if (startDate && endDate) {
    where.AND?.push({
      created_at: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    });
  }

  return await prisma.salesReport.findMany({
    where,
    orderBy: {
      [sortBy || "created_at"]: sortReport || "desc",
    },
    include: {
      orders: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
  });
}

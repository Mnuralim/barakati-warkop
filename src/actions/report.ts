"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface ReportWhereInput {
  AND?: Prisma.SalesReportWhereInput[];
  created_at?: {
    gte?: Date;
    lte?: Date;
  };
}

export async function getReports(
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortReport?: string,
  reportType?: string
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

  if (reportType === "monthly") {
    const reports = await prisma.salesReport.findMany({
      where,
      orderBy: {
        [sortBy || "date"]: sortReport || "desc",
      },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                menu: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        admin: {
          select: {
            username: true,
          },
        },
      },
    });
    return reports;
  }

  if (reportType === "yearly") {
    const rawReports = await prisma.salesReport.findMany({
      where,
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                menu: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        admin: {
          select: {
            username: true,
          },
        },
      },
    });

    const monthlyAggregation = new Map();

    rawReports.forEach((report) => {
      const date = new Date(report.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyAggregation.has(monthKey)) {
        monthlyAggregation.set(monthKey, {
          id: `yearly-${monthKey}`,
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          income: 0,
          total_items_sold: 0,
          orders: [],
          admin: report.admin,
          created_at: new Date(),
          updated_at: new Date(),
          admin_id: report.admin_id,
        });
      }

      const monthData = monthlyAggregation.get(monthKey);
      monthData.income += report.income;
      monthData.total_items_sold += report.total_items_sold;
      monthData.orders.push(...report.orders);
    });

    const aggregatedReports = Array.from(monthlyAggregation.values());

    aggregatedReports.sort((a, b) => {
      const sortField = sortBy || "date";
      const sortOrder = sortReport || "desc";
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      if (sortField === "date") {
        aValue = new Date(aValue as string | Date).getTime();
        bValue = new Date(bValue as string | Date).getTime();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return aggregatedReports;
  }

  const reports = await prisma.salesReport.findMany({
    where,
    orderBy: {
      [sortBy || "created_at"]: sortReport || "desc",
    },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              menu: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      admin: {
        select: {
          username: true,
        },
      },
    },
  });

  return reports;
}

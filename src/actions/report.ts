"use server";
import prisma from "@/lib/prisma";
import { Prisma, type SalesReport } from "@prisma/client";

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
  if (reportType === "monthly") {
    return await getMonthlyAggregatedReports(
      startDate,
      endDate,
      sortBy,
      sortReport
    );
  }

  if (reportType === "daily") {
    return await getDailyAggregatedReports(
      startDate,
      endDate,
      sortBy,
      sortReport
    );
  }

  if (reportType === "yearly") {
    return await getYearlyAggregatedReports(
      startDate,
      endDate,
      sortBy,
      sortReport
    );
  }

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

  const reports = await prisma.salesReport.findMany({
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

  return reports;
}

async function getYearlyAggregatedReports(
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortReport?: string
) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Determine year range
  const yearStart = startDate
    ? new Date(startDate).getFullYear()
    : currentYear - 5; // Default to last 5 years
  const yearEnd = endDate ? new Date(endDate).getFullYear() : currentYear;

  const results = [];

  for (let year = yearStart; year <= yearEnd; year++) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    // Skip future years
    if (startOfYear > now) break;

    // Apply date filters
    if (startDate && endOfYear < new Date(startDate)) continue;
    if (endDate && startOfYear > new Date(endDate)) continue;

    const yearlyReports = await prisma.salesReport.findMany({
      where: {
        created_at: {
          gte: startOfYear,
          lte: endOfYear,
        },
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

    if (yearlyReports.length > 0) {
      const totalIncome = yearlyReports.reduce(
        (sum, report) => sum + report.income,
        0
      );
      const totalItemsSold = yearlyReports.reduce(
        (sum, report) => sum + report.total_items_sold,
        0
      );
      const totalOrders = yearlyReports.reduce(
        (sum, report) => sum + report.orders.length,
        0
      );

      const uniqueAdmins = [
        ...new Set(yearlyReports.map((r) => r.admin?.username).filter(Boolean)),
      ];

      results.push({
        id: `${year}`,
        date: startOfYear,
        income: totalIncome,
        total_items_sold: totalItemsSold,
        orders: Array(totalOrders).fill({}),
        admin: {
          username:
            uniqueAdmins.length === 1
              ? uniqueAdmins[0]
              : `${uniqueAdmins.length} Kasir`,
        },
        created_at: startOfYear,
        updated_at: startOfYear,
        admin_id: "",
        displayName: `Tahun ${year}`,
      });
    }
  }

  const sortField = sortBy === "income" ? "income" : "date";
  results.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortReport === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  return results;
}

async function getMonthlyAggregatedReports(
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortReport?: string
) {
  const now = new Date();
  const currentYear = now.getFullYear();

  const yearStart = startDate ? new Date(startDate).getFullYear() : currentYear;
  const yearEnd = endDate ? new Date(endDate).getFullYear() : currentYear;

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const results = [];

  for (let year = yearStart; year <= yearEnd; year++) {
    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);

      if (startOfMonth > now) break;

      if (startDate && endOfMonth < new Date(startDate)) continue;
      if (endDate && startOfMonth > new Date(endDate)) continue;

      const monthlyReports = await prisma.salesReport.findMany({
        where: {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
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

      if (monthlyReports.length > 0) {
        const totalIncome = monthlyReports.reduce(
          (sum, report) => sum + report.income,
          0
        );
        const totalItemsSold = monthlyReports.reduce(
          (sum, report) => sum + report.total_items_sold,
          0
        );
        const totalOrders = monthlyReports.reduce(
          (sum, report) => sum + report.orders.length,
          0
        );

        const uniqueAdmins = [
          ...new Set(
            monthlyReports.map((r) => r.admin?.username).filter(Boolean)
          ),
        ];

        results.push({
          id: `${year}-${month}`,
          date: startOfMonth,
          income: totalIncome,
          total_items_sold: totalItemsSold,
          orders: Array(totalOrders).fill({}),
          admin: {
            username:
              uniqueAdmins.length === 1
                ? uniqueAdmins[0]
                : `${uniqueAdmins.length} Kasir`,
          },
          created_at: startOfMonth,
          updated_at: startOfMonth,
          admin_id: "",
          displayName: `${monthNames[month]} ${year}`,
        });
      }
    }
  }

  const sortField = sortBy === "income" ? "income" : "date";
  results.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortReport === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  return results;
}

async function getDailyAggregatedReports(
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortReport?: string
) {
  const where: Prisma.SalesReportWhereInput = {};

  if (startDate && endDate) {
    where.created_at = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const allReports = await prisma.salesReport.findMany({
    where,
    include: {
      orders: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const dailyGroups: Record<
    string,
    Prisma.SalesReportGetPayload<{
      include: {
        orders: true;
        admin: {
          select: {
            username: true;
          };
        };
      };
    }>[]
  > = {};

  allReports.forEach((report) => {
    const reportDate = new Date(report.created_at);
    const dayKey = `${reportDate.getFullYear()}-${reportDate.getMonth()}-${reportDate.getDate()}`;

    if (!dailyGroups[dayKey]) {
      dailyGroups[dayKey] = [];
    }
    dailyGroups[dayKey].push(report);
  });

  const results = Object.keys(dailyGroups).map((dayKey) => {
    const dailyReports = dailyGroups[dayKey];
    const firstReport = dailyReports[0];
    const reportDate = new Date(firstReport.created_at);

    const startOfDay = new Date(
      reportDate.getFullYear(),
      reportDate.getMonth(),
      reportDate.getDate()
    );

    const totalIncome = dailyReports.reduce(
      (sum, report) => sum + report.income,
      0
    );
    const totalItemsSold = dailyReports.reduce(
      (sum, report) => sum + report.total_items_sold,
      0
    );
    const totalOrders = dailyReports.reduce(
      (sum, report) => sum + report.orders.length,
      0
    );

    const uniqueAdmins = [
      ...new Set(dailyReports.map((r) => r.admin?.username).filter(Boolean)),
    ];

    return {
      id: `${startOfDay.getTime()}`,
      date: startOfDay,
      income: totalIncome,
      total_items_sold: totalItemsSold,
      orders: Array(totalOrders).fill({}),
      admin: {
        username:
          uniqueAdmins.length === 1
            ? uniqueAdmins[0]
            : `${uniqueAdmins.length} Kasir`,
      },
      created_at: startOfDay,
      updated_at: startOfDay,
      admin_id: "",
    };
  });

  const sortField = sortBy === "income" ? "income" : "date";
  results.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortReport === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  return results;
}

export async function getAggregatedReports(
  startDate?: string,
  endDate?: string,
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

  if (reportType && reportType !== "all") {
    const now = new Date();

    if (reportType === "daily") {
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      where.AND?.push({
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      });
    } else if (reportType === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      where.AND?.push({
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      });
    } else if (reportType === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);

      where.AND?.push({
        created_at: {
          gte: startOfYear,
          lte: endOfYear,
        },
      });
    }
  }

  const aggregated = await prisma.salesReport.aggregate({
    where,
    _sum: {
      income: true,
      total_items_sold: true,
    },
    _count: {
      id: true,
    },
  });

  const ordersCount = await prisma.order.count({
    where: {
      salesReport: where,
    },
  });

  return {
    totalIncome: aggregated._sum.income || 0,
    totalItemsSold: aggregated._sum.total_items_sold || 0,
    totalReports: aggregated._count.id || 0,
    totalOrders: ordersCount,
  };
}

export async function getDailyReportsForMonth(year?: number, month?: number) {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = month !== undefined ? month : now.getMonth();

  const startOfMonth = new Date(targetYear, targetMonth, 1);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

  const reports = await prisma.salesReport.findMany({
    where: {
      created_at: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      orders: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const dailyReports = reports.reduce((acc, report) => {
    const day = report.created_at.getDate();
    if (!acc[day]) {
      acc[day] = {
        date: new Date(targetYear, targetMonth, day),
        reports: [],
        totalIncome: 0,
        totalItemsSold: 0,
        totalOrders: 0,
      };
    }

    acc[day].reports.push(report);
    acc[day].totalIncome += report.income;
    acc[day].totalItemsSold += report.total_items_sold;
    acc[day].totalOrders += report.orders.length;

    return acc;
  }, {} as Record<number, { date: Date; reports: SalesReport[]; totalIncome: number; totalItemsSold: number; totalOrders: number }>);

  return Object.values(dailyReports);
}

export async function getMonthlyReportsForYear(year?: number) {
  const targetYear = year || new Date().getFullYear();

  const reports = await prisma.salesReport.findMany({
    where: {
      created_at: {
        gte: new Date(targetYear, 0, 1),
        lte: new Date(targetYear, 11, 31),
      },
    },
    include: {
      orders: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const monthlyReports = reports.reduce((acc, report) => {
    const month = report.created_at.getMonth();
    if (!acc[month]) {
      acc[month] = {
        date: new Date(targetYear, month, 1),
        reports: [],
        totalIncome: 0,
        totalItemsSold: 0,
        totalOrders: 0,
      };
    }

    acc[month].reports.push(report);
    acc[month].totalIncome += report.income;
    acc[month].totalItemsSold += report.total_items_sold;
    acc[month].totalOrders += report.orders.length;

    return acc;
  }, {} as Record<number, { date: Date; reports: SalesReport[]; totalIncome: number; totalItemsSold: number; totalOrders: number }>);

  return Object.values(monthlyReports);
}

export async function getYearlyReportsForRange(
  startYear?: number,
  endYear?: number
) {
  const now = new Date();
  const targetStartYear = startYear || now.getFullYear() - 5;
  const targetEndYear = endYear || now.getFullYear();

  const reports = await prisma.salesReport.findMany({
    where: {
      created_at: {
        gte: new Date(targetStartYear, 0, 1),
        lte: new Date(targetEndYear, 11, 31),
      },
    },
    include: {
      orders: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const yearlyReports = reports.reduce((acc, report) => {
    const year = report.created_at.getFullYear();
    if (!acc[year]) {
      acc[year] = {
        date: new Date(year, 0, 1),
        reports: [],
        totalIncome: 0,
        totalItemsSold: 0,
        totalOrders: 0,
      };
    }

    acc[year].reports.push(report);
    acc[year].totalIncome += report.income;
    acc[year].totalItemsSold += report.total_items_sold;
    acc[year].totalOrders += report.orders.length;

    return acc;
  }, {} as Record<number, { date: Date; reports: SalesReport[]; totalIncome: number; totalItemsSold: number; totalOrders: number }>);

  return Object.values(yearlyReports);
}

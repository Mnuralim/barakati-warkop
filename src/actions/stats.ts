"use server";

import prisma from "@/lib/prisma";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { id } from "date-fns/locale";

export async function getStats() {
  const today = new Date();
  const yesterday = subDays(today, 1);

  const processingOrders = await prisma.order.count({
    where: {
      status: "PROCESSING",
    },
  });

  const totalSalesReport = await prisma.salesReport.aggregate({
    _sum: {
      income: true,
      total_items_sold: true,
    },
  });

  const totalOrdersCount = await prisma.order.count({
    where: {
      salesReport_id: { not: null },
    },
  });

  const completedOrders = await prisma.order.count({
    where: {
      status: "COMPLETED",
    },
  });

  const todaySalesReport = await prisma.salesReport.findFirst({
    where: {
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
    select: {
      income: true,
      total_items_sold: true,
    },
  });

  const yesterdaySalesReport = await prisma.salesReport.findFirst({
    where: {
      date: {
        gte: startOfDay(yesterday),
        lte: endOfDay(yesterday),
      },
    },
    select: {
      income: true,
      total_items_sold: true,
    },
  });

  const salesChangePercentage =
    yesterdaySalesReport?.income && todaySalesReport?.income
      ? (
          ((todaySalesReport.income - yesterdaySalesReport.income) /
            yesterdaySalesReport.income) *
          100
        ).toFixed(1)
      : 0;

  const todayOrders = await prisma.order.count({
    where: {
      created_at: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
  });

  const yesterdayOrders = await prisma.order.count({
    where: {
      created_at: {
        gte: startOfDay(yesterday),
        lte: endOfDay(yesterday),
      },
    },
  });

  const ordersChangePercentage =
    yesterdayOrders && todayOrders
      ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(1)
      : 0;

  const todayCompletedOrders = await prisma.order.count({
    where: {
      status: "COMPLETED",
      created_at: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
  });

  const yesterdayCompletedOrders = await prisma.order.count({
    where: {
      status: "COMPLETED",
      created_at: {
        gte: startOfDay(yesterday),
        lte: endOfDay(yesterday),
      },
    },
  });

  const completedOrdersChangePercentage = yesterdayCompletedOrders
    ? (
        ((todayCompletedOrders - yesterdayCompletedOrders) /
          yesterdayCompletedOrders) *
        100
      ).toFixed(1)
    : 0;

  return {
    totalSales: totalSalesReport._sum.income || 0,
    salesChangePercentage,
    totalOrders: totalOrdersCount,
    ordersChangePercentage,
    completedOrders,
    completedOrdersChangePercentage,
    processingOrders,
  };
}

export async function weeklySales() {
  const today = new Date();
  const weeklyData = [];

  const dailyTranslate = {
    Sun: "Min",
    Mon: "Sen",
    Tue: "Sel",
    Wed: "Rab",
    Thu: "Kam",
    Fri: "Jum",
    Sat: "Sab",
  };

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const salesReport = await prisma.salesReport.findFirst({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        income: true,
      },
    });

    const dayName = format(date, "EEE", {
      locale: id,
    });

    const localedDayName =
      dailyTranslate[dayName as keyof typeof dailyTranslate] || dayName;

    weeklyData.push({
      day: localedDayName,
      sales: salesReport?.income || 0,
    });
  }

  return weeklyData;
}

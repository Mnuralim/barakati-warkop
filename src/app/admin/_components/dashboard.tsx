"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  stats: {
    totalSales: number;
    salesChangePercentage: number | string;
    totalOrders: number;
    ordersChangePercentage: string | number;
    completedOrders: number;
    completedOrdersChangePercentage: string | number;
    processingOrders: number;
  };
  sales: {
    day: string;
    sales: number;
  }[];
}

export const Dashboard = ({ stats, sales }: Props) => {
  return (
    <div className="bg-neutral-100 min-h-screen p-6">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-indigo-500 pb-2 text-neutral-800">
            Dashboard Admin
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-bold">
                  Total Penjualan
                </p>
                <h3 className="text-2xl font-black mt-2">
                  {formatCurrency(stats.totalSales)}
                </h3>
                <p
                  className={`font-bold text-sm mt-2 flex items-center ${
                    parseFloat(stats.salesChangePercentage.toString()) >= 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  <ArrowUpRight size={14} className="mr-1" />
                  {stats.salesChangePercentage}% dari kemarin
                </p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
                <DollarSign size={24} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-bold">
                  Total Pesanan
                </p>
                <h3 className="text-2xl font-black mt-2">
                  {stats.totalOrders}
                </h3>
                <p
                  className={`font-bold text-sm mt-2 flex items-center ${
                    parseFloat(stats.ordersChangePercentage.toString()) >= 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  <ArrowUpRight size={14} className="mr-1" />
                  {stats.ordersChangePercentage}% dari kemarin
                </p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
                <ShoppingCart size={24} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-bold">
                  Pesanan Selesai
                </p>
                <h3 className="text-2xl font-black mt-2">
                  {stats.completedOrders}
                </h3>
                <p
                  className={`font-bold text-sm mt-2 flex items-center ${
                    parseFloat(
                      stats.completedOrdersChangePercentage.toString()
                    ) >= 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  <ArrowUpRight size={14} className="mr-1" />
                  {stats.completedOrdersChangePercentage}% dari kemarin
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-neutral-500 font-bold">
                  Pesanan Diproses
                </p>
                <h3 className="text-2xl font-black mt-2">
                  {stats.processingOrders}
                </h3>
                <p className="text-yellow-500 font-bold text-sm mt-2 flex items-center">
                  <Clock size={14} className="mr-1" /> Perlu perhatian
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-none flex items-center justify-center border-2 border-neutral-700">
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border-4 border-neutral-700 p-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
            <h3 className="text-xl font-black mb-4 border-b-4 border-indigo-500 pb-2 inline-block">
              Penjualan Mingguan
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sales}>
                  <XAxis dataKey="day" stroke="#374151" fontWeight="bold" />
                  <YAxis
                    stroke="#374151"
                    fontWeight="bold"
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(parseFloat(value.toString()))
                    }
                    contentStyle={{
                      borderRadius: 0,
                      border: "2px solid #1f2937",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#4f46e5"
                    stroke="#1f2937"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  SortAsc,
  SortDesc,
  FileText,
  DollarSign,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

interface Props {
  currentSortReport?: string;
  reports?: Prisma.SalesReportGetPayload<{
    include: {
      orders: true;
      admin: {
        select: {
          username: true;
        };
      };
    };
  }>[];
}

export const FilterControl = ({ currentSortReport, reports = [] }: Props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "date", label: "Tanggal" },
    { value: "income", label: "Pendapatan" },
  ];

  const reportTypeOptions = [
    { value: "all", label: "Semua Data" },
    { value: "daily", label: "Agregat Harian" },
    { value: "monthly", label: "Agregat Bulanan" },
    { value: "yearly", label: "Agregat Tahunan" },
  ];

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", e.target.value);
    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleReportType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("reportType", e.target.value);
    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortReport = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortReport", currentSortReport === "asc" ? "desc" : "asc");
    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleDateFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("startDate", startDate);
    newParams.set("endDate", endDate);
    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleReset = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("startDate");
    newParams.delete("endDate");
    newParams.delete("reportType");
    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

  // Calculate totals from reports
  const totalIncome = reports.reduce((sum, report) => sum + report.income, 0);
  const totalTransactions = reports.reduce(
    (sum, report) => sum + report.orders.length,
    0
  );
  const totalItemsSold = reports.reduce(
    (sum, report) => sum + report.total_items_sold,
    0
  );

  return (
    <div className="mb-6 space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Total Pemasukan
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-100" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Transaksi
              </p>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-100" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Menu Terjual
              </p>
              <p className="text-2xl font-bold">{totalItemsSold}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-100" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Date Range Filter */}
        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 mr-2" />
            <h3 className="font-bold">Rentang Tanggal</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-2 border-neutral-700 p-2 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-2 border-neutral-700 p-2 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="self-end flex items-center gap-2">
              <button
                onClick={handleDateFilter}
                className="bg-indigo-600 text-white border-4 border-neutral-700 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
              >
                Terapkan
              </button>
              <button
                onClick={handleReset}
                className="bg-red-600 text-white border-4 border-neutral-700 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Report Type Filter */}
        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1 md:flex-initial md:w-72">
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="font-bold">Jenis Laporan</h3>
          </div>
          <div className="relative">
            <select
              onChange={handleReportType}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {reportTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Sort Control */}
        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1 md:flex-initial md:w-72">
          <div className="flex items-center mb-2">
            {currentSortReport === "asc" ? (
              <SortAsc className="w-5 h-5 mr-2" />
            ) : (
              <SortDesc className="w-5 h-5 mr-2" />
            )}
            <h3 className="font-bold">Urutkan</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                onChange={handleSortBy}
                className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
            <button
              onClick={handleSortReport}
              className="bg-neutral-200 border-2 border-neutral-700 p-2 rounded-none hover:bg-neutral-300 transition-colors"
            >
              {currentSortReport === "asc" ? (
                <SortAsc className="w-5 h-5" />
              ) : (
                <SortDesc className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

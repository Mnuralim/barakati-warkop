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
  currentReportType?: string;
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

export const FilterControl = ({
  currentSortReport,
  reports = [],
  currentReportType,
}: Props) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "date", label: "Tanggal" },
    { value: "income", label: "Pendapatan" },
  ];

  const reportTypeOptions = [
    { value: "all", label: "Semua Data" },
    { value: "monthly", label: "Laporan Bulanan" },
    { value: "yearly", label: "Laporan Tahunan" },
  ];

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Generate years (current year and previous 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

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
    newParams.delete("startDate");
    newParams.delete("endDate");
    setSelectedMonth("");
    setSelectedYear("");

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
    if (currentReportType === "monthly" && (!selectedMonth || !selectedYear)) {
      alert("Silakan pilih bulan dan tahun");
      return;
    }

    if (currentReportType === "yearly" && !selectedYear) {
      alert("Silakan pilih tahun");
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (currentReportType === "monthly") {
      const startDate = `${selectedYear}-${selectedMonth}-01`;
      const endDate = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        0
      )
        .toISOString()
        .split("T")[0];
      newParams.set("startDate", startDate);
      newParams.set("endDate", endDate);
    } else if (currentReportType === "yearly") {
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;
      newParams.set("startDate", startDate);
      newParams.set("endDate", endDate);
    }

    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleReset = () => {
    setSelectedMonth("");
    setSelectedYear("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("startDate");
    newParams.delete("endDate");
    newParams.delete("reportType");
    replace(`/admin/report?${newParams.toString()}`, {
      scroll: false,
    });
  };

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
        {(currentReportType === "monthly" ||
          currentReportType === "yearly") && (
          <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <h3 className="font-bold">
                {currentReportType === "monthly"
                  ? "Filter Bulan & Tahun"
                  : "Filter Tahun"}
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {currentReportType === "monthly" && (
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">Bulan</label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Pilih Bulan</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              )}
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium mb-1">Tahun</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Pilih Tahun</option>
                    {years.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                </div>
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
        )}

        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1 md:flex-initial md:w-72">
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="font-bold">Jenis Laporan</h3>
          </div>
          <div className="relative">
            <select
              value={currentReportType}
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

import React, { useState } from "react";
import { Calendar, ChevronDown, Search, SortAsc, SortDesc } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterControlProps {
  currentSortOrder?: string;
}

export const FilterControl = ({ currentSortOrder }: FilterControlProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "created_at", label: "Waktu" },
    { value: "code", label: "Kode Pesanan" },
    { value: "customer_name", label: "Pemesan" },
    { value: "total_price", label: "Total Harga" },
  ];

  const statusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "PROCESSING", label: "Diproses" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("searchQuery", e.target.value);
      replace(`/admin/order?${newParams.toString()}`, {
        scroll: false,
      });
    },
    500
  );

  const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === "ALL") {
      newParams.delete("status");
    } else {
      newParams.set("status", e.target.value);
    }
    replace(`/admin/order?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", e.target.value);
    replace(`/admin/order?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    replace(`/admin/order?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleDateFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("startDate", startDate);
    newParams.set("endDate", endDate);
    replace(`/admin/order?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleReset = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("startDate");
    newParams.delete("endDate");
    replace(`/admin/order?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4">
        <div className="flex items-center mb-2">
          <Search className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Pencarian & Filter Status</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Cari kode pesanan atau nama pemesan..."
              className="w-full border-2 border-neutral-700 p-2 pl-10 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          <div className="relative w-full sm:w-64">
            <select
              onChange={handleFilterStatus}
              className="w-full appearance-none border-2 border-neutral-700 p-2 pr-10 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
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

        <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] rounded-none p-4 flex-1 md:flex-initial md:w-72">
          <div className="flex items-center mb-2">
            {currentSortOrder === "asc" ? (
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
              onClick={handleSortOrder}
              className="bg-neutral-200 border-2 border-neutral-700 p-2 rounded-none hover:bg-neutral-300 transition-colors"
            >
              {currentSortOrder === "asc" ? (
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

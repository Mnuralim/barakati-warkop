"use client";

import type { Order } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface Props {
  orders: Order[];
  currentCode?: string;
}

export const SearchInput = ({ orders, currentCode }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("code", searchQuery);
    replace(`?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-8 rounded-none">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Masukkan kode pesanan..."
            className="flex-grow bg-white border-4 border-neutral-700 px-4 py-3 font-bold text-lg focus:outline-none focus:ring-0 focus:border-indigo-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="bg-indigo-600 cursor-pointer text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center justify-center disabled:opacity-50"
          >
            <>
              <Search className="mr-2 w-5 h-5" strokeWidth={2.5} />
              Cari Pesanan
            </>
          </button>
        </div>
        {currentCode && orders.length === 0 && (
          <div className="mt-4 bg-red-100 border-4 border-red-700 text-red-700 p-4 font-bold">
            Pesanan tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
};

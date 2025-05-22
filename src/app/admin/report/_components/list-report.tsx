"use client";

import React, { useRef } from "react";
import { type Prisma } from "@prisma/client";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FilterControl } from "./filter-control";
import { useReactToPrint } from "react-to-print";
import PrintableReport from "./pdf-report";

type SalesReportWithAdminOrders = Prisma.SalesReportGetPayload<{
  include: {
    orders: true;
    admin: {
      select: {
        username: true;
      };
    };
  };
}>;

interface Props {
  reports: SalesReportWithAdminOrders[];
  currentSortReport?: string;
}

export const ListReport = ({ reports, currentSortReport }: Props) => {
  const columns: TabelColumn<SalesReportWithAdminOrders>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Tanggal",
      accessor: (item) =>
        formatDate(item.date.toString()).split(" ").slice(0, 3).join(" "),
    },
    {
      header: "Total Transaksi",
      accessor: (item) => item.orders.length,
    },
    {
      header: "Menu Terjual",
      accessor: "total_items_sold",
    },
    {
      header: "Pendapatan",
      accessor: (item) => formatCurrency(item.income),
    },
    {
      header: "Kasir",
      accessor: (item) => item.admin?.username,
    },
  ];

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Laporan-Penjualan",
  });

  return (
    <div className="w-full pb-10">
      <FilterControl currentSortReport={currentSortReport} />

      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-indigo-600 text-white border-4 border-neutral-700 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all mb-5 cursor-pointer"
        >
          Cetak Laporan
        </button>
      </div>

      <div style={{ display: "none" }}>
        <PrintableReport ref={printRef} reports={reports} />
      </div>
      <div className="hidden md:block bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <Tabel columns={columns} data={reports} />
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-4 rounded-none"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">
                {formatDate(report.date.toString())
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}
              </span>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-sm text-sm">
                {report.admin?.username}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Total Transaksi</p>
                <p className="font-semibold">{report.orders.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Menu Terjual</p>
                <p className="font-semibold">{report.total_items_sold}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Pendapatan</p>
                <p className="font-bold text-lg">
                  {formatCurrency(report.income)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

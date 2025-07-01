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
    orders: {
      include: {
        orderItems: {
          include: {
            menu: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
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
  currentReportType?: string;
  reportType?: string;
  startDate?: string;
  endDate?: string;
}

export const ListReport = ({
  reports,
  currentSortReport,
  reportType,
  startDate,
  endDate,
  currentReportType,
}: Props) => {
  const formatPeriodeColumn = (item: SalesReportWithAdminOrders) => {
    const date = new Date(item.date);

    if (reportType === "monthly") {
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
      return `${date.getDate()} ${
        monthNames[date.getMonth()]
      } ${date.getFullYear()}`;
    } else if (reportType === "yearly") {
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
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    } else {
      const formattedDate = formatDate(item.date.toString());
      return formattedDate.split(" ").slice(0, 3).join(" ");
    }
  };

  const getMenuSold = (item: SalesReportWithAdminOrders) => {
    const menuCounts = new Map<string, number>();

    item.orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        const menuName = orderItem.menu.name;
        const quantity = orderItem.quantity;
        menuCounts.set(menuName, (menuCounts.get(menuName) || 0) + quantity);
      });
    });

    return Array.from(menuCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${name} (${count})`)
      .join(", ");
  };

  const columns: TabelColumn<SalesReportWithAdminOrders>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Periode",
      accessor: formatPeriodeColumn,
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
      header: "Detail Menu",
      accessor: getMenuSold,
      render: (item) => {
        const menuText = getMenuSold(item);
        return (
          <div className="max-w-xs">
            <div className="" title={menuText}>
              {menuText || "-"}
            </div>
          </div>
        );
      },
    },
    {
      header: "Pendapatan",
      accessor: (item) => formatCurrency(item.income),
    },
    {
      header: "Kasir",
      accessor: (item) => item.admin?.username || "-",
    },
  ];

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Laporan-Penjualan-${reportType || "semua"}`,
  });

  const getReportTypeLabel = () => {
    switch (reportType) {
      case "monthly":
        return "Bulanan";
      case "yearly":
        return "Tahunan";
      default:
        return "Semua";
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case "monthly":
        return "Laporan penjualan harian dalam bulan dan tahun yang dipilih";
      case "yearly":
        return "Laporan penjualan dikelompokkan per bulan dalam tahun yang dipilih";
      default:
        return "Laporan penjualan keseluruhan";
    }
  };

  const formatPeriodeForMobile = (report: SalesReportWithAdminOrders) => {
    return formatPeriodeColumn(report);
  };

  return (
    <div className="w-full pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Laporan Penjualan {getReportTypeLabel()}
        </h1>
        <p className="text-gray-600">{getReportDescription()}</p>
        {startDate && endDate && (
          <p className="text-sm text-indigo-600 font-medium mt-1">
            Periode: {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        )}
      </div>
      <FilterControl
        currentSortReport={currentSortReport}
        reports={reports}
        currentReportType={currentReportType}
        startDate={startDate}
        endDate={endDate}
      />
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-gray-600">
          Menampilkan {reports.length} laporan
        </div>
        <button
          onClick={handlePrint}
          className="bg-indigo-600 text-white border-4 border-neutral-700 px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all cursor-pointer"
        >
          Cetak Laporan
        </button>
      </div>

      <div style={{ display: "none" }}>
        <PrintableReport
          ref={printRef}
          reports={reports}
          reportType={reportType}
          startDate={startDate || undefined}
          endDate={endDate || undefined}
        />
      </div>

      <div className="hidden md:block bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <Tabel columns={columns} data={reports} />
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {reports.length === 0 ? (
          <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-8 rounded-none text-center">
            <p className="text-gray-500 text-lg">
              Tidak ada data laporan ditemukan
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {reportType === "monthly"
                ? "Coba pilih bulan dan tahun yang berbeda"
                : reportType === "yearly"
                ? "Coba pilih tahun yang berbeda"
                : "Coba ubah filter atau rentang tanggal"}
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-4 rounded-none"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">
                  {formatPeriodeForMobile(report)}
                </span>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-sm text-sm">
                  {report.admin?.username || "Sistem"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-600">Total Transaksi</p>
                  <p className="font-semibold">{report.orders.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Menu Terjual</p>
                  <p className="font-semibold">{report.total_items_sold}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-gray-600 text-sm mb-1">Detail Menu:</p>
                <div className="bg-white border-2 border-gray-300 p-2 rounded-sm text-xs">
                  {getMenuSold(report) || "Tidak ada menu terjual"}
                </div>
              </div>

              <div>
                <p className="text-gray-600">Pendapatan</p>
                <p className="font-bold text-lg">
                  {formatCurrency(report.income)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

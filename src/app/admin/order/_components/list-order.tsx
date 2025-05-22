"use client";

import React, { useState } from "react";
import { Eye, Plus } from "lucide-react";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import type { OrderStatus, Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FilterControl } from "./filter-control";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: true;
  };
}>;

interface Props {
  orders: OrderWithItems[];
  currentSortOrder?: string;
}

const getStatusColorClasses = (status: OrderStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-500 text-white border-black";
    case "CANCELLED":
      return "bg-red-500 text-white border-black";
    default:
      return "bg-indigo-500 text-white border-black";
  }
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "COMPLETED":
      return "Selesai";
    case "PROCESSING":
      return "Diproses";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return "Diterima";
  }
};

export const ListOrder = ({ orders, currentSortOrder }: Props) => {
  useState<OrderWithItems[]>(orders);

  const columns: TabelColumn<OrderWithItems>[] = [
    {
      header: "Order ID",
      accessor: (item) => item.id.substring(0, 8),
    },
    {
      header: "Kode Pesanan",
      accessor: "code",
    },
    {
      header: "Pemesan",
      accessor: "customer_name",
    },
    {
      header: "Total Harga",
      accessor: (item) => formatCurrency(item.total_price),
    },
    {
      header: "Waktu",
      accessor: "created_at",
      render: (item) => formatDate(item.created_at.toString()),
    },
    {
      header: "Jumlah Pesanan",
      accessor: "orderItems",
      render: (item) => item.orderItems.length,
    },
    {
      header: "Status",
      accessor: "orderItems",
      render: (item) => (
        <span
          className={`px-4 py-2 text-sm font-black border-2 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]  border-neutral-700 ${getStatusColorClasses(
            item.status
          )}`}
        >
          {getStatusLabel(item.status)}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/order/${item.id}`}
            className="bg-yellow-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
          >
            <Eye className="mr-1 w-4 h-4" strokeWidth={2.5} /> Lihat
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-indigo-500 pb-2 text-neutral-800">
          Daftar Pesanan
        </h1>
        <Link
          href={"/admin/order/add"}
          className="bg-indigo-600 text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all w-full sm:w-auto flex items-center justify-center"
        >
          <Plus className="mr-2 w-5 h-5" strokeWidth={2.5} />
          Tambah Pesanan
        </Link>
      </div>

      <FilterControl currentSortOrder={currentSortOrder} />

      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-neutral-50 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-4 rounded-none"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{order.code}</span>
              <span
                className={`px-2 py-0.5 text-xs font-bold border-2 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] border-neutral-700 ${getStatusColorClasses(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-gray-600">Pemesan</p>
                <p className="font-semibold">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Waktu</p>
                <p className="font-semibold">
                  {formatDate(order.created_at.toString())}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Jumlah Item</p>
                <p className="font-semibold">{order.orderItems.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Harga</p>
                <p className="font-bold">{formatCurrency(order.total_price)}</p>
              </div>
            </div>
            <Link
              href={`/admin/order/${order.id}`}
              className="bg-yellow-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center w-full"
            >
              <Eye className="mr-1 w-4 h-4" strokeWidth={2.5} /> Lihat Detail
            </Link>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <Tabel columns={columns} data={orders} />
        </div>
      </div>
    </div>
  );
};

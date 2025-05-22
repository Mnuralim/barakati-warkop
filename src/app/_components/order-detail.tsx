"use client";

import { useState } from "react";
import { StatusTracker } from "./status-tracker";
import { OrderItem } from "./order-item";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { OrderStatus, Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        menu: true;
      };
    };
  };
}>;

interface Props {
  order: OrderWithItems;
}

export const OrderDetail = ({ order }: Props) => {
  const [expandItems, setExpandItems] = useState(true);
  const { replace } = useRouter();

  const handleReset = () => {
    replace("/", {
      scroll: false,
    });
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

  return (
    <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6 rounded-none">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black border-b-8 border-indigo-500 pb-2 inline-block">
            Detail Pesanan
          </h2>
          <p className="text-lg font-bold mt-2">Kode: {order.code}</p>
        </div>
        <span
          className={`px-4 py-2 text-sm font-black border-2 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] border-neutral-700 ${getStatusColorClasses(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      <StatusTracker status={order.status} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border-4 border-neutral-700 p-4 bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <h3 className="font-black text-lg mb-3 border-b-4 border-neutral-700 pb-2">
            Informasi Pesanan
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-bold">Nama Pemesan:</span>{" "}
              {order.customer_name}
            </p>
            <p>
              <span className="font-bold">Tanggal Pesan:</span>{" "}
              {formatDate(order.created_at.toString())}
            </p>

            {order.note && (
              <p>
                <span className="font-bold">Catatan:</span> {order.note}
              </p>
            )}
          </div>
        </div>

        <div className="border-4 border-neutral-700 p-4 bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <h3 className="font-black text-lg mb-3 border-b-4 border-neutral-700 pb-2">
            Ringkasan Pembayaran
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-bold">Jumlah Item:</span>{" "}
              {order.orderItems.length}
            </p>
            <p>
              <span className="font-bold">Total Pesanan:</span>{" "}
              <span className="font-black text-xl">
                {formatCurrency(order.total_price)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex justify-between items-center bg-indigo-600 text-white border-4 border-neutral-700 p-4 mb-4 cursor-pointer"
        onClick={() => setExpandItems(!expandItems)}
      >
        <h3 className="font-black text-lg">Daftar Item Pesanan</h3>
        {expandItems ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expandItems && (
        <div className="mb-8">
          {order.orderItems.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="bg-red-600 cursor-pointer text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center"
        >
          <X className="mr-2 w-5 h-5" strokeWidth={2.5} />
          Tutup Detail
        </button>
      </div>
    </div>
  );
};

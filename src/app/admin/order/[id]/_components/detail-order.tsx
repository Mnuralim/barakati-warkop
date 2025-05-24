"use client";
import React, { useState } from "react";
import { ArrowLeft, Check, Edit, Printer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "@/app/admin/_components/modal";
import type { OrderStatus, Prisma } from "@prisma/client";
import { useFormState } from "react-dom";
import { updateOrder } from "@/actions/order";
import { ErrorMessage } from "@/app/admin/_components/error-message";

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

const orderStatus = [
  {
    status: "PROCESSING",
    label: "Sedang Diproses",
  },
  {
    status: "COMPLETED",
    label: "Pesanan Selesai",
  },
  {
    status: "CANCELLED",
    label: "Pesanan Dibatalkan",
  },
];

export const DetailOrder = ({ order }: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(order.total_price);
  const [updateState, updateAction] = useFormState(updateOrder, {
    error: null,
  });

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

  const handlePaymentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setPaymentAmount(value ? parseInt(value) : 0);
  };

  // Check if order status is final (cannot be edited)
  const isOrderStatusFinal =
    order.status === "COMPLETED" || order.status === "CANCELLED";

  // Get tooltip message for disabled edit button
  const getDisabledTooltipMessage = () => {
    if (order.status === "COMPLETED") {
      return "Pesanan sudah selesai, status tidak dapat diubah lagi";
    } else if (order.status === "CANCELLED") {
      return "Pesanan sudah dibatalkan, status tidak dapat diubah lagi";
    }
    return "";
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center">
            <Link
              href="/admin/order"
              className="mr-4 bg-black text-white p-3 rounded-md hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-3xl font-black text-indigo-600 tracking-tight">
              Pesanan #{order.id.substring(0, 8)}
            </h1>
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-initial">
              <button
                onClick={() => !isOrderStatusFinal && setIsEditModalOpen(true)}
                disabled={isOrderStatusFinal}
                className={`${
                  isOrderStatusFinal
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 shadow-[4px_4px_0px_0px_rgba(156,163,175,1)]"
                    : "bg-indigo-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                } px-5 py-3 rounded-md border-4 transition-all font-bold flex items-center justify-center w-full`}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Status
              </button>

              {/* Tooltip for disabled button */}
              {isOrderStatusFinal && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {getDisabledTooltipMessage()}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>

            <button className="bg-amber-400 text-black px-5 py-3 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold flex items-center justify-center flex-1 md:flex-initial">
              <Printer className="w-5 h-5 mr-2" />
              Cetak
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-indigo-600 mb-4 tracking-tight border-b-4 border-black pb-2">
              Informasi Pesanan
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">ID Pesanan</span>
                <span className="font-bold bg-gray-100 px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {order.id.substring(0, 8)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">Kode Pesanan</span>
                <span className="font-bold bg-gray-100 px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {order.code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">Nama</span>
                <span className="font-bold">{order.customer_name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">Tanggal</span>
                <span className="font-bold">
                  {formatDate(order.created_at.toString())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">Catatan</span>
                <span className="font-bold">{order.note || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-indigo-600 mb-4 tracking-tight border-b-4 border-black pb-2">
              Status Pesanan
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-bold">Status</span>
                <span
                  className={`px-4 py-2 rounded-md text-sm font-black border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusColorClasses(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-gray-800 font-bold mb-4">Status Progres</h3>
                <div className="space-y-4">
                  {orderStatus.map((status) => (
                    <div key={status.status} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          order.status === status.status
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {order.status === status.status && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span
                        className={`ml-3 text-base ${
                          order.status === status.status
                            ? "font-black text-indigo-600"
                            : "font-bold text-gray-800"
                        }`}
                      >
                        {status.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black text-indigo-600 mb-4 tracking-tight border-b-4 border-black pb-2">
              Ringkasan Pembayaran
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-800 font-bold">Subtotal</span>
                <span className="font-bold">
                  {formatCurrency(order.total_price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-bold">Pajak (0%)</span>
                <span className="font-bold">
                  {formatCurrency(order.total_price * 0)}
                </span>
              </div>
              <div className="border-t-4 border-black my-4 pt-3"></div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-black text-lg">Total</span>
                <span className="text-indigo-600 font-black text-lg">
                  {formatCurrency(order.total_price * 1)}
                </span>
              </div>
              <div className="border-t-4 border-black my-4 pt-3"></div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-bold">
                  Metode Pembayaran
                </span>
                <span className="font-bold bg-teal-100 px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Tunai
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
          <div className="px-6 py-4 bg-indigo-600 border-b-4 border-black">
            <h2 className="text-xl font-black text-white tracking-tight">
              Detail Item Pesanan
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-4 border-black">
                    <th className="px-6 py-4 text-left font-black text-gray-800 uppercase">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left font-black text-gray-800 uppercase">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left font-black text-gray-800 uppercase">
                      Jumlah
                    </th>
                    <th className="px-6 py-4 text-left font-black text-gray-800 uppercase">
                      Catatan
                    </th>
                    <th className="px-6 py-4 text-left font-black text-gray-800 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 ${
                        index !== order.orderItems.length - 1
                          ? "border-b-2 border-dashed border-gray-300"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-20 w-20 min-w-20 relative rounded-md overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Image
                              width={400}
                              height={400}
                              src={item.menu.image!}
                              alt={item.menu.name}
                              className="object-fill w-full h-full object-center"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-bold text-gray-900">
                              {item.menu.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base font-bold text-gray-800">
                        {formatCurrency(item.menu.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-amber-100 text-base font-bold text-gray-800 px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-base font-bold text-gray-800">
                        {item.note || "-"}
                      </td>
                      <td className="px-6 py-4 text-base font-bold text-gray-900">
                        {formatCurrency(item.menu.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-4 border-black bg-gray-100">
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-base font-bold text-gray-800 text-right"
                    >
                      Subtotal
                    </td>
                    <td className="px-6 py-4 text-base font-bold text-gray-800">
                      {formatCurrency(order.total_price)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-dashed border-gray-300 bg-gray-100">
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-base font-bold text-gray-800 text-right"
                    >
                      Pajak (0%)
                    </td>
                    <td className="px-6 py-4 text-base font-bold text-gray-800">
                      {formatCurrency(order.total_price * 0)}
                    </td>
                  </tr>
                  <tr className="border-t-4 border-black bg-gray-100">
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-lg font-black text-gray-800 text-right"
                    >
                      Total
                    </td>
                    <td className="px-6 py-4 text-lg font-black text-indigo-600">
                      {formatCurrency(order.total_price * 1)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form
          action={updateAction}
          className="p-6 bg-white rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <input type="hidden" hidden name="id" value={order.id} />
          {updateState.error ? (
            <ErrorMessage message={updateState.error} />
          ) : null}
          <h2 className="text-2xl font-black text-indigo-600 mb-6 tracking-tight border-b-4 border-black pb-3">
            Edit Status Pesanan
          </h2>
          <div className="mb-6">
            <label
              htmlFor="orderStatus"
              className="block text-gray-800 font-bold mb-2"
            >
              Status
            </label>
            <select
              id="orderStatus"
              name="orderStatus"
              className="w-full px-4 py-3 border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 focus:border-indigo-600"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as OrderStatus);
              }}
            >
              {orderStatus.map((status) => (
                <option key={status.status} value={status.status}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {selectedStatus === "COMPLETED" && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-md">
              <h3 className="text-lg font-bold text-emerald-700 mb-4 border-b-2 border-emerald-300 pb-2">
                Detail Pembayaran
              </h3>

              <div className="mb-4">
                <div className="flex justify-between font-bold text-gray-800 mb-2">
                  <span>Total Tagihan:</span>
                  <span>{formatCurrency(order.total_price)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="paymentAmount"
                  className="block text-gray-800 font-bold mb-2"
                >
                  Jumlah Uang Diterima
                </label>
                <input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  min={order.total_price}
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                  className="w-full px-4 py-3 border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 focus:border-emerald-500"
                />
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Kembalian:</span>
                  <span className="font-bold text-emerald-600 text-lg bg-emerald-100 px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {formatCurrency(
                      order.total_price > paymentAmount
                        ? 0
                        : paymentAmount - order.total_price
                    )}
                  </span>
                </div>
              </div>

              {paymentAmount < order.total_price && (
                <div className="mt-2 text-red-600 font-bold text-sm">
                  Uang yang diterima kurang dari total tagihan!
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-200 text-black px-5 py-3 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={
                selectedStatus === "COMPLETED" &&
                paymentAmount < order.total_price
              }
              className={`${
                selectedStatus === "COMPLETED" &&
                paymentAmount < order.total_price
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              } text-white px-5 py-3 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold`}
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

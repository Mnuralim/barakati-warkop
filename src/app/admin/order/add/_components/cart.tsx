import React, { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { MenuWithCategory } from "./list-menu";
import { Modal } from "@/app/admin/_components/modal";
import { useFormState } from "react-dom";
import { createOrder } from "@/actions/order";
import { ErrorMessage } from "@/app/admin/_components/error-message";

interface Props {
  cart: { [key: string]: number };
  menus: MenuWithCategory[];
}

export const CartSummary = ({ cart, menus }: Props) => {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [generalNote, setGeneralNote] = useState("");

  const [createState, createAction] = useFormState(createOrder, {
    error: null,
  });

  const cartSummary = useMemo(() => {
    return Object.entries(cart).reduce(
      (acc, [itemId, quantity]) => {
        const item = menus.find((m) => m.id === itemId);
        return {
          totalItems: acc.totalItems + quantity,
          totalPrice: acc.totalPrice + (item?.price || 0) * quantity,
        };
      },
      { totalItems: 0, totalPrice: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([itemId, quantity]) => {
        const item = menus.find((m) => m.id === itemId);
        if (!item) return null;
        return {
          id: itemId,
          name: item.name,
          price: item.price,
          quantity,
          totalPrice: item.price * quantity,
        };
      })
      .filter(Boolean);
  }, [cart, menus]);

  const handleGeneralNoteChange = (note: string) => {
    setGeneralNote(note);
  };

  return (
    <div>
      <Modal
        isOpen={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
      >
        <div className="bg-white border-3 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">
              Detail Pesanan
            </h2>
          </div>

          {cartItems.length > 0 ? (
            <form action={createAction} className="space-y-6">
              {createState.error ? (
                <ErrorMessage message={createState.error} />
              ) : null}
              <input type="hidden" name="cart" value={JSON.stringify(cart)} />
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block text-neutral-800 mb-2 font-bold"
                >
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Masukkan nama pemesan"
                  className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-indigo-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
                  required
                />
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item?.id}
                    className="border-3 border-neutral-300 rounded-none shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-bold text-neutral-800">
                          {item?.name}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {item?.quantity} x Rp {item?.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-bold text-indigo-700">
                        Rp {item?.totalPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3">
                      <label
                        htmlFor={`note-${item?.id}`}
                        className="block text-neutral-800 mb-2 font-bold"
                      >
                        Catatan untuk item ini:
                      </label>
                      <textarea
                        id={`note-${item?.id}`}
                        name={`note-${item?.id}`}
                        placeholder="Tambahkan catatan khusus (opsional)"
                        className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-indigo-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-3 border-neutral-300 pt-4">
                <label
                  htmlFor="generalNote"
                  className="block text-neutral-800 mb-2 font-bold"
                >
                  Catatan Umum:
                </label>
                <textarea
                  id="generalNote"
                  name="generalNote"
                  value={generalNote}
                  onChange={(e) => handleGeneralNoteChange(e.target.value)}
                  placeholder="Tambahkan catatan umum untuk pesanan (opsional)"
                  className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-indigo-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
                  rows={3}
                />
              </div>

              <div className="bg-neutral-100 p-4 border-3 border-neutral-300 rounded-none shadow-[3px_3px_0px_0px_rgba(230,230,230,1)]">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-neutral-700">
                    Total Item:
                  </span>
                  <span className="font-bold text-neutral-800">
                    {cartSummary.totalItems}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-700">
                    Total Harga:
                  </span>
                  <span className="font-bold text-indigo-800">
                    Rp {cartSummary.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-indigo-600 text-white 
                  py-3 rounded-none border-3 border-neutral-800 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
                  hover:bg-indigo-700 
                  transition-all transform 
                  hover:translate-y-1 hover:translate-x-1
                  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
                  font-bold"
              >
                Tambah Pesanan
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12">
              <ShoppingCart className="w-16 h-16 text-neutral-400 mb-4" />
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-neutral-600">
                Anda belum menambahkan item apapun ke keranjang.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {cartSummary.totalItems > 0 && !showOrderDetails ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md z-40">
          <div
            className="bg-white border-3 border-neutral-800 rounded-none 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-neutral-800">
                Total Item: {cartSummary.totalItems}
              </p>
              <p className="text-lg font-bold text-indigo-800">
                Rp {cartSummary.totalPrice.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setShowOrderDetails(true)}
              className="bg-indigo-600 text-white 
              px-6 py-3 rounded-none border-3 border-neutral-800 
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
              hover:bg-indigo-700
              transition-all transform 
              hover:translate-y-1 hover:translate-x-1
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
              font-bold"
            >
              Tambah
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

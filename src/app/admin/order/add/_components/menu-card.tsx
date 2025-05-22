import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React from "react";
import type { MenuWithCategory } from "./list-menu";

interface Props {
  item: MenuWithCategory;
  cart: { [key: string]: number };
  addToCart: (item: MenuWithCategory) => void;
  removeFromCart: (itemId: string) => void;
}

export const MenuCard = ({ item, cart, addToCart, removeFromCart }: Props) => {
  return (
    <div
      key={item.id}
      className="bg-white border-2 border-black rounded-xl 
                  shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] 
                  overflow-hidden transition-all 
                  hover:translate-x-1 hover:translate-y-1 
                  hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
    >
      <div className="relative w-full h-48 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image!}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
        )}
        {!item.status && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="bg-red-600 text-white font-bold py-1 px-3 rounded-sm transform rotate-12 text-sm">
              Habis
            </p>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 bg-gradient-to-br from-[#f9faff] h-full to-[#f0f1f5]">
        <h3 className="font-bold text-sm md:text-lg text-indigo-800">
          {item.name}
        </h3>
        <p className="text-gray-700 text-sm md:text-base font-semibold">
          Rp {item.price.toLocaleString()}
        </p>

        <div className="flex items-center justify-between mt-2">
          {cart[item.id] ? (
            <div className="flex items-center border-2 border-black rounded-md bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
              <button
                disabled={!item.status}
                onClick={() => removeFromCart(item.id)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-700" />
              </button>
              <span className="px-3 font-bold text-indigo-800">
                {cart[item.id] || 0}
              </span>
              <button
                disabled={!item.status}
                onClick={() => addToCart(item)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="p-2 text-indigo-600 bg-indigo-100 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all w-full flex items-center justify-center"
              disabled={!item.status}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              <span className="text-sm font-bold">Tambah</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

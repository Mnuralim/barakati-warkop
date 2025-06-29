"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import type { Category, Menu, Prisma } from "@prisma/client";
import { Filters } from "./filter";
import { CartSummary } from "./cart";
import { EmptyMenu } from "./empty-menu";
import { MenuCard } from "./menu-card";
import { Toast } from "@/app/admin/_components/toast";
import { useRouter } from "next/navigation";

export type MenuWithCategory = Prisma.MenuGetPayload<{
  include: {
    categories: true;
  };
}>;

interface Props {
  menus: MenuWithCategory[];
  categories: Category[];
  selectedCategory?: string;
  selectedSearch?: string;
  selectedMenuType?: string;
  toastType?: "success" | "error";
  message?: string;
}

export const ListMenu = ({
  menus,
  categories,
  selectedCategory,
  selectedMenuType,
  selectedSearch,
  message,
  toastType,
}: Props) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const addToCart = (item: Menu) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const handleCloseToast = () => {
    router.replace("/admin/menu", { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <div
        className={`lg:hidden fixed  right-4 z-50 ${
          isMobileFilterOpen ? "top-4" : "translate-y-1/2 transform bottom-1/2"
        }`}
      >
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-indigo-700 transition-all"
        >
          {isMobileFilterOpen ? <X /> : <Filter />}
        </button>
      </div>

      {!isDesktop && isMobileFilterOpen && (
        <div className="fixed inset-0 bg-white z-40 overflow-y-auto p-6 pt-20">
          <Filters
            selectedMenuType={selectedMenuType}
            selectedSearch={selectedSearch}
            categories={categories}
            selectedCategory={selectedCategory}
          />
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md 
            border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
            hover:bg-indigo-700 transition-all"
          >
            Terapkan Filter
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <Filters
              categories={categories}
              selectedCategory={selectedCategory}
              selectedMenuType={selectedMenuType}
              selectedSearch={selectedSearch}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          {menus.length === 0 ? (
            <EmptyMenu />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {menus.map((item) => (
                <MenuCard
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  key={item.id}
                  item={item}
                  cart={cart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CartSummary cart={cart} menus={menus} />
      <Toast
        isVisible={message !== undefined}
        message={(message as string) || ""}
        onClose={handleCloseToast}
        type={(toastType as "success" | "error") || "success"}
        autoClose
      />
    </div>
  );
};

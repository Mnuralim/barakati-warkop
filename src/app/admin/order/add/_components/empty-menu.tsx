import { ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const EmptyMenu = () => {
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleResetFilter = () => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("category");
    newParams.delete("search");
    newParams.delete("menuType");
    replace(`${pathName}?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
      <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Tidak Ada Menu Tersedia
      </h2>
      <p className="text-gray-600 mb-6">
        Saat ini tidak ada menu yang cocok dengan filter yang dipilih. Coba
        sesuaikan filter atau periksa kembali nanti.
      </p>
      <button
        onClick={handleResetFilter}
        className="bg-indigo-600 text-white px-6 py-3 rounded-md 
                  border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
                  hover:bg-indigo-700 transition-all"
      >
        Reset Filter
      </button>
    </div>
  );
};

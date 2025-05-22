import type { Prisma } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

type MenuWithCategory = Prisma.MenuGetPayload<{
  include: { categories: true };
}>;

interface Props {
  item: MenuWithCategory;
  index: number;
  onEditClick?: (item: MenuWithCategory) => void;
  onDeleteClick?: (id: string) => void;
}

export const MobileMenuCard = ({
  item,
  index,
  onDeleteClick,
  onEditClick,
}: Props) => (
  <div
    key={item.id}
    className="bg-neutral-800 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4 mb-6 rounded-none transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
  >
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-black text-lg text-white">{item.name}</h3>
      <span className="text-black text-sm bg-yellow-500 py-1 px-3 border-2 border-neutral-700 font-bold">
        #{index + 1}
      </span>
    </div>

    <div className="flex items-center space-x-4 mb-4">
      <div className="border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <Image
          src={item.image!}
          alt={item.name}
          width={400}
          height={400}
          className="w-20 h-20 object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-gray-300 font-bold mb-1">
          <span className="font-black text-white">Tipe:</span>{" "}
          {item.menuType === "FOOD"
            ? "Makanan"
            : item.menuType === "BEVERAGE"
            ? "Minuman"
            : "Lainnya"}
        </p>
        <p className="text-gray-300 font-bold mb-1">
          <span className="font-black text-white">Kategori:</span>{" "}
          {item.categories.map((category) => category.name).join(", ")}
        </p>
        <p className="text-gray-300 font-bold mb-1">
          <span className="font-black text-white">Harga:</span> Rp{" "}
          {item.price.toLocaleString("id-ID")}
        </p>
        <p className="text-gray-300 font-bold mb-1">
          <span className="font-black text-white">Status:</span>
          <span
            className={`ml-2 px-2 py-0.5 border-2 border-neutral-700 text-sm ${
              item.status ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {item.status ? "Tersedia" : "Tidak Tersedia"}
          </span>
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onEditClick!(item)}
        className="bg-yellow-600 text-white border-4 border-neutral-700 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all disabled:opacity-50 flex-1 flex items-center justify-center"
        // disabled={isSubmitting || deletingId !== null}
      >
        <Edit className="mr-2 w-5 h-5" strokeWidth={2.5} /> Edit
      </button>
      <button
        onClick={() => onDeleteClick!(item.id)}
        className="bg-red-600 text-white border-4 border-neutral-700 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all disabled:opacity-50 flex-1 flex items-center justify-center"
      >
        <Trash2 className="mr-2 w-5 h-5" strokeWidth={2.5} /> Hapus
      </button>
    </div>
  </div>
);

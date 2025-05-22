import type { Category } from "@prisma/client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const menuTypes = [
  {
    name: "Makanan",
    value: "FOOD",
  },
  {
    name: "Minuman",
    value: "BEVERAGE",
  },
  {
    name: "Lainnya",
    value: "OTHER",
  },
];

interface Props {
  categories: Category[];
  selectedCategory?: string;
  selectedSearch?: string;
  selectedMenuType?: string;
}

export const Filters = ({
  categories,
  selectedCategory,
  selectedMenuType,
  selectedSearch,
}: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathName = usePathname();

  const handleSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", e.target.value);
      replace(`${pathName}?${newParams.toString()}`);
    },
    500
  );

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "semua") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }

    replace(`${pathName}?${newParams.toString()}`);
  };

  const handleMenuTypeChange = (menuType: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (menuType === "") {
      newParams.delete("menuType");
    } else {
      newParams.set("menuType", menuType);
    }

    replace(`${pathName}?${newParams.toString()}`);
  };

  const categoriesWithAll = [{ id: "semua", name: "Semua" }, ...categories];
  const menuTypesWithAll = [{ name: "Semua", value: undefined }, ...menuTypes];

  return (
    <div className="space-y-6 bg-gradient-to-br from-[#f0f4ff] to-[#e6eaf4] p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
      <div className="relative">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Cari menu..."
          className="w-full p-3 pl-10 border-2 border-black rounded-md 
          bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] 
          focus:outline-none focus:ring-2 focus:ring-teal-500 
          transition-all hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
          defaultValue={selectedSearch}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center text-indigo-800">
          <Search className="mr-2" /> Kategori
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {categoriesWithAll.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`py-2 px-3 rounded-md border-2 capitalize border-black transition-all 
              ${
                (selectedCategory === undefined && category.id === "semua") ||
                selectedCategory === category.id
                  ? "bg-teal-100 text-teal-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                  : "bg-white hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3 text-indigo-800">Jenis Menu</h3>
        <div className="grid grid-cols-2 gap-2">
          {menuTypesWithAll.map((type, index) => (
            <button
              key={index}
              onClick={() => handleMenuTypeChange(type.value || "")}
              className={`py-2 px-3 rounded-md border-2 border-black transition-all 
              ${
                (selectedMenuType === undefined && type.value === undefined) ||
                selectedMenuType === type.value
                  ? "bg-purple-100 text-purple-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                  : "bg-white hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

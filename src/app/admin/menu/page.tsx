import { getAllMenu } from "@/actions/menu";
import { ListMenu } from "./_components/list-menu";
import { getAllCategories } from "@/actions/categories";
import type { MenuType } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function MenuPage({ searchParams }: Props) {
  const { modal, category, search, menuType, sortBy, sortMenu } =
    await searchParams;
  const [menus, categories] = await Promise.all([
    getAllMenu(
      1000000,
      0,
      category,
      search,
      menuType as MenuType,
      sortBy,
      sortMenu
    ),
    getAllCategories(),
  ]);

  return (
    <main className="w-full px-3 sm:px-3 md:px-8 py-8 min-h-screen bg-neutral-50">
      <div className="mx-auto">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 rounded-none">
          <div className="mb-6 border-b-4 border-indigo-600 pb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
              Menu Management
            </h1>
            <p className="text-gray-700 font-bold mt-2">
              Kelola menu dan kategori produk Anda dengan mudah.
            </p>
          </div>

          <ListMenu
            menuData={menus}
            categories={categories}
            modal={modal}
            currentSortMenu={sortMenu}
          />
        </div>
      </div>
    </main>
  );
}

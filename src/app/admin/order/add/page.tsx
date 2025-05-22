import { getAllMenu } from "@/actions/menu";
import { ListMenu } from "./_components/list-menu";
import { getAllCategories } from "@/actions/categories";
import type { MenuType } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function AddOrderPage({ searchParams }: Props) {
  const { category, search, menuType } = await searchParams;
  const [menus, categories] = await Promise.all([
    getAllMenu(1000, 0, category, search, menuType as MenuType),
    getAllCategories(),
  ]);
  return (
    <div>
      <ListMenu
        menus={menus}
        categories={categories}
        selectedCategory={category}
        selectedMenuType={menuType}
        selectedSearch={search}
      />
    </div>
  );
}

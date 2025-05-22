import { getOrders } from "@/actions/order";
import { OrderDetail } from "./_components/order-detail";
import { SearchInput } from "./_components/search-input";
import type { OrderStatus } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}
export default async function OrderTracking({ searchParams }: Props) {
  const { searchQuery, startDate, endDate, status, sortBy, sortOrder, code } =
    await searchParams;
  await searchParams;
  const orders = await getOrders(
    searchQuery,
    status as OrderStatus,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    code
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black border-b-8 border-indigo-500 pb-2 inline-block mb-4">
          Lacak Pesanan
        </h1>
        <p className="text-lg">
          Masukkan kode pesanan Anda untuk melihat status dan detail pesanan.
        </p>
      </div>

      {!orders.length || orders.length > 1 ? (
        <SearchInput orders={orders} currentCode={code} />
      ) : (
        <OrderDetail order={orders[0]} />
      )}
    </div>
  );
}

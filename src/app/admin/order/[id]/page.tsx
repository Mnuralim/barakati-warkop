import { getOrder } from "@/actions/order";
import { DetailOrder } from "./_components/detail-order";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id = "" } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          Order tidak ditemukan
        </h1>
      </div>
    );
  }

  return (
    <div>
      <DetailOrder order={order} />
    </div>
  );
}

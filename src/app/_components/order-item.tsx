import { formatCurrency } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import Image from "next/image";

type OrderItemWithMenu = Prisma.OrderItemGetPayload<{
  include: {
    menu: true;
  };
}>;

interface Props {
  item: OrderItemWithMenu;
}

export const OrderItem = ({ item }: Props) => {
  return (
    <div className="border-4 border-neutral-700 p-4 mb-3 bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-2/5 mb-2 md:mb-0 flex">
          <div className="w-24 h-24 mr-4 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex-shrink-0 overflow-hidden">
            <Image
              src={item.menu.image!}
              alt={item.menu.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-black text-lg">{item.menu.name}</h3>
            {item.note && (
              <p className="text-gray-600 mt-1">
                <span className="font-bold">Catatan:</span> {item.note}
              </p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/5 mb-2 md:mb-0">
          <p className="text-gray-600">Jumlah:</p>
          <p className="font-bold text-black text-lg">{item.quantity}x</p>
        </div>
        <div className="w-full md:w-1/5 text-right">
          <p className="text-gray-600">Harga:</p>
          <p className="font-black text-black text-lg">
            {formatCurrency(item.menu.price)}
          </p>
        </div>
      </div>
    </div>
  );
};

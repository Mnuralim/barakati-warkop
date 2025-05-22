interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: {
    id: string;
    name: string;
  };
}
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

type OrderWhereInput = {
  AND?: Array<{
    OR?: Array<{
      code?: {
        contains: string;
        mode: "insensitive";
      };
      customer_name?: {
        contains: string;
        mode: "insensitive";
      };
    }>;
    status?: {
      equals?: "COMPLETED" | "PROCESSING" | "CANCELLED";
    };
    code?: {
      contains: string;
      mode: "insensitive";
    };
    created_at?: {
      gte?: Date;
      lte?: Date;
    };
  }>;
};

type ReportWhereInput = {
  AND?: Array<{
    created_at?: {
      gte?: Date;
      lte?: Date;
    };
  }>;
};

interface SessionPayload {
  userId: string | number;
  expiresAt: Date;
}

type MenuWhereInput = {
  AND?: Array<{
    name?: {
      contains: string;
      mode: "insensitive";
    };
    categories?: {
      some: {
        id: {
          equals: string;
        };
      };
    };
    menuType?: {
      equals: MenuType;
    };
  }>;
  price?: {
    gte?: number;
    lte?: number;
  };
};

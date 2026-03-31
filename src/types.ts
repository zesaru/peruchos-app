export type Category = string;
export type AppLanguage = "es" | "en" | "ja";
export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export type FoodItem = {
  id: string;
  title: string;
  description: string;
  macroCategory: string;
  category: string;
  price: number;
  prepTime: string;
  image?: string;
  mostOrdered?: boolean;
  promo?: boolean;
};

export type CartEntry = FoodItem & {
  lineId: string;
  quantity: number;
  note: string;
  selectedOptions: string[];
};

export type ConfiguredCartItemInput = {
  note: string;
  product: FoodItem;
  quantity: number;
  selectedOptions: string[];
};

export type OrderType = "Dine In" | "Pickup";

export type CheckoutDraft = {
  tableNumber: string;
  customerName: string;
  orderType: OrderType;
};

export type AssignedTable = {
  id: number;
  tableNumber: string;
};

export type SubmittedOrder = {
  id: string;
  createdAt: string;
  items: CartEntry[];
  summary: {
    itemCount: number;
    subtotal: number;
  };
  draft: CheckoutDraft;
  status: OrderStatus;
};

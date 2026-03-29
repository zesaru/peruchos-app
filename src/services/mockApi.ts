import type { CheckoutDraft, FoodItem, SubmittedOrder } from "../types";
import { menuItems } from "../constants/menuData";

const NETWORK_DELAY_MS = 220;

function wait(duration = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function cloneMenu(): FoodItem[] {
  return menuItems.map((item) => ({ ...item }));
}

function cloneOrders(orders: SubmittedOrder[]): SubmittedOrder[] {
  return orders.map((order) => ({
    ...order,
    draft: { ...order.draft },
    summary: { ...order.summary },
    items: order.items.map((item) => ({
      ...item,
      selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
    })),
  }));
}

export async function fetchMenu(): Promise<FoodItem[]> {
  await wait();
  return cloneMenu();
}

export async function fetchOrders(existingOrders: SubmittedOrder[]): Promise<SubmittedOrder[]> {
  await wait(160);
  return cloneOrders(existingOrders);
}

export async function createOrder(input: {
  items: SubmittedOrder["items"];
  summary: SubmittedOrder["summary"];
  draft: CheckoutDraft;
}): Promise<SubmittedOrder> {
  await wait(260);

  return {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    items: input.items.map((item) => ({
      ...item,
      selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
    })),
    summary: { ...input.summary },
    draft: { ...input.draft },
    status: "pending",
  };
}

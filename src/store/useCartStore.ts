import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LayoutAnimation, Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createOrder, fetchOrders } from "../services/api";
import type {
  CartEntry,
  CheckoutDraft,
  ConfiguredCartItemInput,
  FoodItem,
  SubmittedOrder,
} from "../types";

type CartStore = {
  items: CartEntry[];
  summary: {
    itemCount: number;
    subtotal: number;
  };
  checkoutDraft: CheckoutDraft;
  orders: SubmittedOrder[];
  addItem: (item: FoodItem | CartEntry) => Promise<void>;
  addConfiguredItem: (input: ConfiguredCartItemInput) => Promise<void>;
  decreaseItem: (id: string) => void;
  updateNote: (id: string, note: string) => void;
  updateCheckoutDraft: (draft: Partial<CheckoutDraft>) => void;
  placeOrder: () => Promise<void>;
  submitOrder: () => Promise<SubmittedOrder | null>;
  refreshOrders: () => Promise<void>;
  clearCart: () => void;
};

const initialDraft: CheckoutDraft = {
  tableNumber: "",
  customerName: "",
  orderType: "Dine In",
};

function normalizeCartEntry(item: Partial<CartEntry>, index = 0): CartEntry {
  const baseId = item.id ?? `legacy-${index}`;

  return {
    category: item.category ?? "",
    description: item.description ?? "",
    id: baseId,
    image: item.image,
    lineId: item.lineId ?? `${baseId}-${index}`,
    macroCategory: item.macroCategory ?? "food",
    mostOrdered: item.mostOrdered,
    note: typeof item.note === "string" ? item.note : "",
    prepTime: item.prepTime ?? "15 min",
    price: typeof item.price === "number" ? item.price : 0,
    promo: item.promo,
    quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
    selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
    title: item.title ?? "",
  };
}

function normalizeSubmittedOrder(order: SubmittedOrder): SubmittedOrder {
  return {
    ...order,
    draft: { ...order.draft },
    items: order.items.map((item, index) => normalizeCartEntry(item, index)),
    summary: { ...order.summary },
  };
}

function normalizePersistedState(state: Pick<CartStore, "items" | "summary" | "checkoutDraft" | "orders">) {
  const items = Array.isArray(state.items) ? state.items.map((item, index) => normalizeCartEntry(item, index)) : [];
  const orders = Array.isArray(state.orders) ? state.orders.map(normalizeSubmittedOrder) : [];

  return {
    items,
    orders,
    checkoutDraft: {
      ...initialDraft,
      ...state.checkoutDraft,
    },
    summary: getSummary(items),
  };
}

function runLayoutAnimation() {
  if (Platform.OS === "web") {
    return;
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

async function runHaptic(
  feedback: () => Promise<void>
) {
  if (Platform.OS === "web") {
    return;
  }

  try {
    await feedback();
  } catch {
    // Haptics are best-effort on native devices.
  }
}

function getSummary(items: CartEntry[]) {
  return items.reduce(
    (accumulator, item) => {
      accumulator.itemCount += item.quantity;
      accumulator.subtotal += item.quantity * item.price;
      return accumulator;
    },
    { itemCount: 0, subtotal: 0 }
  );
}

function decrementCartItem(items: CartEntry[], id: string) {
  return items
    .map((entry) =>
      entry.lineId === id ? { ...entry, quantity: entry.quantity - 1 } : entry
    )
    .filter((entry) => entry.quantity > 0);
}

function createCartEntry(product: FoodItem, quantity: number, note: string): CartEntry {
  return {
    ...product,
    lineId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    note,
    quantity,
    selectedOptions: [],
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      summary: {
        itemCount: 0,
        subtotal: 0,
      },
      checkoutDraft: initialDraft,
      orders: [],
      addItem: async (item) => {
        runLayoutAnimation();
        await runHaptic(() => Haptics.selectionAsync());

        set((state) => {
          const normalizedItems = state.items.map((entry) => normalizeCartEntry(entry));
          const lineId = "lineId" in item ? item.lineId : null;

          const nextItems = lineId
            ? normalizedItems.map((entry) =>
                entry.lineId === lineId
                  ? { ...entry, quantity: entry.quantity + 1 }
                  : entry
              )
            : normalizedItems.some(
                (entry) =>
                  entry.id === item.id &&
                  entry.note.trim().length === 0 &&
                  entry.selectedOptions.length === 0
              )
              ? normalizedItems.map((entry) =>
                  entry.id === item.id &&
                  entry.note.trim().length === 0 &&
                  entry.selectedOptions.length === 0
                    ? { ...entry, quantity: entry.quantity + 1 }
                    : entry
                )
              : [...normalizedItems, createCartEntry(item, 1, "")];

          return {
            items: nextItems,
            summary: getSummary(nextItems),
          };
        });
      },
      addConfiguredItem: async ({ note, product, quantity, selectedOptions }) => {
        const trimmedNote = note.trim();
        const normalizedOptions = [...selectedOptions].sort();
        runLayoutAnimation();
        await runHaptic(() => Haptics.selectionAsync());

        set((state) => {
          const normalizedItems = state.items.map((entry) => normalizeCartEntry(entry));
          const existingIndex = normalizedItems.findIndex(
            (entry) =>
              entry.id === product.id &&
              entry.note === trimmedNote &&
              JSON.stringify([...entry.selectedOptions].sort()) === JSON.stringify(normalizedOptions)
          );

          const nextItems =
            existingIndex >= 0
              ? normalizedItems.map((entry, index) =>
                  index === existingIndex
                    ? { ...entry, quantity: entry.quantity + quantity }
                    : entry
                )
              : [
                  ...normalizedItems,
                  {
                    ...createCartEntry(product, quantity, trimmedNote),
                    selectedOptions: normalizedOptions,
                  },
                ];

          return {
            items: nextItems,
            summary: getSummary(nextItems),
          };
        });
      },
      decreaseItem: (id) => {
        runLayoutAnimation();
        set((state) => {
          const nextItems = decrementCartItem(state.items.map((entry) => normalizeCartEntry(entry)), id);

          return {
            items: nextItems,
            summary: getSummary(nextItems),
          };
        });
      },
      updateNote: (id, note) => {
        const trimmedNote = note.replace(/\s+$/u, "");

        set((state) => {
          const normalizedItems = state.items.map((entry) => normalizeCartEntry(entry));
          let changed = false;
          const nextItems = normalizedItems.map((entry) => {
            if (entry.lineId !== id || entry.note === trimmedNote) {
              return entry;
            }

            changed = true;
            return { ...entry, note: trimmedNote };
          });

          if (!changed) {
            return state;
          }

          return {
            items: nextItems,
            summary: getSummary(nextItems),
          };
        });
      },
      updateCheckoutDraft: (draft) => {
        set((state) => ({
          checkoutDraft: {
            ...state.checkoutDraft,
            ...draft,
          },
        }));
      },
      placeOrder: async () => {
        await runHaptic(() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        );
      },
      submitOrder: async () => {
        const snapshot = useCartStore.getState();
        if (snapshot.items.length === 0) {
          return null;
        }

        const createdOrder = await createOrder({
          items: snapshot.items,
          summary: snapshot.summary,
          draft: snapshot.checkoutDraft,
        });

        set((state) => ({
          items: [],
          summary: {
            itemCount: 0,
            subtotal: 0,
          },
          checkoutDraft: initialDraft,
          orders: [createdOrder, ...state.orders],
        }));

        if (createdOrder) {
          await runHaptic(() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          );
        }

        return createdOrder;
      },
      refreshOrders: async () => {
        const nextOrders = await fetchOrders(useCartStore.getState().orders);
        set(() => ({
          orders: nextOrders.map(normalizeSubmittedOrder),
        }));
      },
      clearCart: () => {
        set({
          items: [],
          summary: {
            itemCount: 0,
            subtotal: 0,
          },
          checkoutDraft: initialDraft,
        });
      },
    }),
    {
      name: "restaurant-cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as Partial<CartStore> | undefined;
        if (!typedPersisted) {
          return currentState;
        }

        return {
          ...currentState,
          ...typedPersisted,
          ...normalizePersistedState({
            checkoutDraft: typedPersisted.checkoutDraft ?? currentState.checkoutDraft,
            items: typedPersisted.items ?? currentState.items,
            orders: typedPersisted.orders ?? currentState.orders,
            summary: typedPersisted.summary ?? currentState.summary,
          }),
        };
      },
      partialize: (state) => ({
        items: state.items,
        summary: state.summary,
        checkoutDraft: state.checkoutDraft,
        orders: state.orders,
      }),
    }
  )
);

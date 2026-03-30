jest.mock("expo-haptics", () => ({
  NotificationFeedbackType: {
    Success: "success",
  },
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(undefined),
    setItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("react-native", () => ({
  LayoutAnimation: {
    Presets: {
      easeInEaseOut: "easeInEaseOut",
    },
    configureNext: jest.fn(),
  },
  Platform: {
    OS: "ios",
  },
}));

jest.mock("../src/services/api", () => ({
  createOrder: jest.fn(),
  fetchOrders: jest.fn(),
}));

import { useCartStore } from "../src/store/useCartStore";
import type { CartEntry, FoodItem } from "../src/types";

const baseProduct: FoodItem = {
  category: "Ceviches",
  description: "Fresh fish marinated in lime juice.",
  id: "dish-1",
  image: "https://example.com/ceviche.jpg",
  macroCategory: "food",
  prepTime: "15 min",
  price: 1600,
  title: "Ceviche Clasico",
};

const secondProduct: FoodItem = {
  ...baseProduct,
  id: "dish-2",
  price: 2200,
  title: "Lomo Saltado",
};

const initialDraft = {
  customerName: "",
  orderType: "Dine In" as const,
  tableNumber: "",
};

function createCartItem(
  overrides: Partial<CartEntry> = {}
): CartEntry {
  return {
    ...baseProduct,
    lineId: "line-1",
    note: "",
    quantity: 1,
    selectedOptions: [],
    ...overrides,
  };
}

function resetStore() {
  useCartStore.setState({
    checkoutDraft: initialDraft,
    items: [],
    orders: [],
    summary: {
      itemCount: 0,
      subtotal: 0,
    },
  });
}

describe("useCartStore", () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(1700000000000);
    jest.spyOn(Math, "random").mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("merges addConfiguredItem calls when product, trimmed note, and sorted options match", async () => {
    await useCartStore.getState().addConfiguredItem({
      note: "  no onion  ",
      product: baseProduct,
      quantity: 1,
      selectedOptions: ["Large", "Extra spice"],
    });

    await useCartStore.getState().addConfiguredItem({
      note: "no onion",
      product: baseProduct,
      quantity: 2,
      selectedOptions: ["Extra spice", "Large"],
    });

    const state = useCartStore.getState();

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      id: baseProduct.id,
      note: "no onion",
      quantity: 3,
      selectedOptions: ["Extra spice", "Large"],
    });
    expect(state.summary).toEqual({
      itemCount: 3,
      subtotal: 4800,
    });
  });

  it("keeps configured items separate when options differ and recalculates summary totals", async () => {
    await useCartStore.getState().addConfiguredItem({
      note: "",
      product: baseProduct,
      quantity: 2,
      selectedOptions: ["No onion"],
    });

    await useCartStore.getState().addConfiguredItem({
      note: "",
      product: secondProduct,
      quantity: 1,
      selectedOptions: [],
    });

    const state = useCartStore.getState();

    expect(state.items).toHaveLength(2);
    expect(state.summary).toEqual({
      itemCount: 3,
      subtotal: 5400,
    });
  });

  it("removes an item when decreaseItem drops quantity to zero", () => {
    useCartStore.setState({
      checkoutDraft: initialDraft,
      items: [
        createCartItem({
          lineId: "line-remove",
          quantity: 1,
        }),
      ],
      orders: [],
      summary: {
        itemCount: 1,
        subtotal: 1600,
      },
    });

    useCartStore.getState().decreaseItem("line-remove");

    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().summary).toEqual({
      itemCount: 0,
      subtotal: 0,
    });
  });

  it("trims trailing whitespace in updateNote without changing summary values", () => {
    useCartStore.setState({
      checkoutDraft: initialDraft,
      items: [
        createCartItem({
          lineId: "line-note",
          note: "old note",
          quantity: 2,
          selectedOptions: ["No onion"],
        }),
      ],
      orders: [],
      summary: {
        itemCount: 2,
        subtotal: 3200,
      },
    });

    useCartStore.getState().updateNote("line-note", "kitchen note   ");

    const state = useCartStore.getState();

    expect(state.items[0].note).toBe("kitchen note");
    expect(state.summary).toEqual({
      itemCount: 2,
      subtotal: 3200,
    });
  });
});

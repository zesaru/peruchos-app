import type { SubmittedOrder } from "../types";

const mockFrom = jest.fn();
const mockStorageFrom = jest.fn();
const mockGetPublicUrl = jest.fn();

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: mockFrom,
    storage: {
      from: mockStorageFrom,
    },
  },
}));

function loadApi() {
  let api: typeof import("./api");
  jest.isolateModules(() => {
    api = require("./api");
  });
  return api!;
}

describe("api service behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageFrom.mockReturnValue({
      getPublicUrl: mockGetPublicUrl,
    });
    mockGetPublicUrl.mockImplementation((path: string) => ({
      data: { publicUrl: `https://cdn.test/${path}` },
    }));
  });

  it("falls back to local catalog data when Supabase catalog queries fail", async () => {
    mockFrom.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: null, error: new Error("catalog failed") }),
        })),
      })),
    }));

    const { fetchCatalog } = loadApi();
    const payload = await fetchCatalog("en");

    expect(payload.macroCategories).toEqual(["food"]);
    expect(payload.subcategoriesByMacro.food[0]).toBe("All");
    expect(payload.items.length).toBeGreaterThan(0);
  });

  it("maps fetched orders and normalizes legacy items missing selectedOptions", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table !== "orders") {
        throw new Error(`Unexpected table ${table}`);
      }

      return {
        select: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({
            data: [
              {
                created_at: "2026-03-30T12:00:00.000Z",
                id: 77,
                kitchen_status: "ready",
                products: {
                  draft: {
                    customerName: "Cesar",
                    orderType: "Dine In",
                    tableNumber: "",
                  },
                  items: [
                    {
                      category: "Bebida",
                      description: "Gaseosa",
                      id: "dish-1",
                      note: "",
                      price: 1600,
                      quantity: 2,
                      title: "Inca Kola",
                    },
                  ],
                },
                table_id: 12,
                tables: { id: 12, table_number: 12 },
                total: 3200,
              },
            ],
            error: null,
          }),
        })),
      };
    });

    const { fetchOrders } = loadApi();
    const orders = await fetchOrders([]);

    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({
      id: "77",
      status: "ready",
      summary: {
        itemCount: 2,
        subtotal: 3200,
      },
    });
    expect(orders[0].draft.tableNumber).toBe("12");
    expect(orders[0].items[0].selectedOptions).toEqual([]);
    expect(orders[0].items[0].lineId).toBe("dish-1-0");
  });

  it("creates a mapped catalog item with localized fields and storage-backed image URLs", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "menus") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({
                data: [
                  {
                    display_order: 0,
                    id: 5,
                    key: "bebidas",
                    name_en: "Drinks",
                    name_es: "Bebidas",
                    name_ja: "飲み物",
                  },
                ],
                error: null,
              }),
            })),
          })),
        };
      }

      if (table === "dishes") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({
                data: [
                  {
                    category_id: 5,
                    description_en: "Peruvian soda",
                    description_es: "Gaseosa peruana",
                    description_ja: "ペルーのソーダ",
                    id: 9,
                    image: null,
                    image_path: "dishes/inca-kola.png",
                    is_available: true,
                    is_hot: false,
                    is_new: true,
                    is_recommended: true,
                    name_en: "Inca Kola",
                    name_es: "Inca Kola",
                    name_ja: "インカコーラ",
                    prep_time: 3,
                    price: 1600,
                  },
                ],
                error: null,
              }),
            })),
          })),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const { fetchCatalog } = loadApi();
    const payload = await fetchCatalog("en");

    expect(mockStorageFrom).toHaveBeenCalledWith("dishes");
    expect(mockGetPublicUrl).toHaveBeenCalledWith("dishes/inca-kola.png");
    expect(payload.macroCategories).toEqual(["drinks"]);
    expect(payload.items[0]).toMatchObject({
      category: "Drinks",
      description: "Peruvian soda",
      id: "9",
      image: "https://cdn.test/dishes/inca-kola.png",
      macroCategory: "drinks",
      mostOrdered: true,
      prepTime: "3 min",
      price: 1600,
      promo: true,
      title: "Inca Kola",
    });
  });

  it("returns existing orders unchanged when the fetch fails", async () => {
    const existingOrders: SubmittedOrder[] = [
      {
        id: "order-1",
        createdAt: "2026-03-30T00:00:00.000Z",
        items: [],
        summary: { itemCount: 0, subtotal: 0 },
        draft: { customerName: "", orderType: "Dine In", tableNumber: "" },
        status: "pending",
      },
    ];

    mockFrom.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn().mockResolvedValue({ data: null, error: new Error("read failed") }),
      })),
    });

    const { fetchOrders } = loadApi();
    const result = await fetchOrders(existingOrders);

    expect(result).toEqual(existingOrders);
  });

  it("returns a local fallback order when the insert fails", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "tables") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn().mockResolvedValue({
                data: { id: 12, table_number: 12 },
              }),
            })),
          })),
        };
      }

      if (table === "orders") {
        return {
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: new Error("insert failed"),
              }),
            })),
          })),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const { createOrder } = loadApi();
    const input: Pick<SubmittedOrder, "draft" | "items" | "summary"> = {
      draft: {
        customerName: "Walk-in",
        orderType: "Pickup",
        tableNumber: "12",
      },
      items: [
        {
          category: "Bebida",
          description: "Gaseosa",
          id: "drink-1",
          lineId: "drink-1-a",
          macroCategory: "drinks",
          note: "",
          prepTime: "1 min",
          price: 1600,
          quantity: 1,
          selectedOptions: ["Size: Regular"],
          title: "Inca Kola",
        },
      ],
      summary: {
        itemCount: 1,
        subtotal: 1600,
      },
    };

    const created = await createOrder(input);

    expect(created.id).toMatch(/^order-/);
    expect(created.status).toBe("pending");
    expect(created.summary).toEqual(input.summary);
    expect(created.draft).toEqual(input.draft);
    expect(created.items).toEqual(input.items);
  });
});

import { categories as fallbackCategories, menuItems } from "../constants/menuData";
import { getAllCategoryLabel } from "../i18n/translations";
import { supabase } from "../lib/supabase";
import type { AppLanguage, CartEntry, CheckoutDraft, FoodItem, OrderStatus, SubmittedOrder } from "../types";

type CatalogPayload = {
  macroCategories: string[];
  subcategoriesByMacro: Record<string, string[]>;
  items: FoodItem[];
};

type MenuRow = {
  id: number;
  key: string | null;
  display_order: number | null;
  name_es: string;
  name_en: string;
  name_ja: string;
};

type DishRow = {
  id: number;
  price: number;
  prep_time: number | null;
  image: string | null;
  image_path: string | null;
  is_available: boolean;
  is_hot: boolean | null;
  is_recommended: boolean | null;
  is_new: boolean | null;
  name_es: string;
  name_en: string;
  name_ja: string;
  description_es: string;
  description_en: string;
  description_ja: string;
  category_id: number;
};

type TableRow = {
  id: number;
  table_number: number;
};

type OrderRow = {
  id: number;
  created_at: string | null;
  total: number;
  products: unknown;
  kitchen_status: string | null;
  table_id: number | null;
  tables?: TableRow | TableRow[] | null;
};

type LegacyOrderProduct = {
  id?: number | string;
  image?: string | null;
  image_path?: string | null;
  macroCategory?: string;
  category?: string;
  name?: string;
  nameEs?: string;
  nameEn?: string;
  nameJa?: string;
  title?: string;
  description?: string;
  prepTime?: string;
  price?: number | string;
  quantity?: number;
  note?: string;
  notes?: string;
  selectedOptions?: string[];
};

const NETWORK_DELAY_MS = 120;

function wait(duration = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function getLocalizedValue<T extends { name_es?: string; name_en?: string; name_ja?: string; description_es?: string; description_en?: string; description_ja?: string }>(
  row: T,
  language: AppLanguage,
  prefix: "name" | "description"
) {
  const key = `${prefix}_${language}` as keyof T;
  const fallbackKey = `${prefix}_es` as keyof T;
  const localized = row[key];
  const fallback = row[fallbackKey];
  return typeof localized === "string" && localized.trim().length > 0
    ? localized
    : typeof fallback === "string"
      ? fallback
      : "";
}

function normalizeCategoryName(menu: MenuRow, language: AppLanguage) {
  return getLocalizedValue(menu, language, "name").trim();
}

function buildFallbackCatalog(language: AppLanguage): CatalogPayload {
  return {
    macroCategories: ["food"],
    subcategoriesByMacro: {
      desserts: [getAllCategoryLabel(language)],
      drinks: [getAllCategoryLabel(language)],
      food: [
        getAllCategoryLabel(language),
        ...fallbackCategories.filter((category) => category !== "All"),
      ],
    },
    items: menuItems.map((item) => ({ ...item, macroCategory: "food" })),
  };
}

function parseOrderProducts(value: unknown): {
  draft: CheckoutDraft;
  items: CartEntry[];
} {
  const fallbackDraft: CheckoutDraft = {
    customerName: "",
    orderType: "Dine In",
    tableNumber: "",
  };

  if (!value || typeof value !== "object") {
    return { draft: fallbackDraft, items: [] };
  }

  if (Array.isArray(value)) {
    return {
      draft: fallbackDraft,
      items: value.map((item, index) => normalizeLegacyOrderProduct(item as LegacyOrderProduct, index)),
    };
  }

  const products = value as {
    draft?: Partial<CheckoutDraft>;
    items?: CartEntry[];
  };

  return {
    draft: {
      ...fallbackDraft,
      ...products.draft,
    },
    items: Array.isArray(products.items)
      ? products.items.map((item, index) => normalizeCartEntry(item, index))
      : [],
  };
}

function normalizeLegacyOrderProduct(item: LegacyOrderProduct, index = 0): CartEntry {
  const title =
    item.title ??
    item.name ??
    item.nameEs ??
    item.nameEn ??
    item.nameJa ??
    "";
  const baseId = item.id != null ? String(item.id) : `legacy-${index}`;
  const numericPrice =
    typeof item.price === "number"
      ? item.price
      : typeof item.price === "string"
        ? Number(item.price)
        : 0;
  const image =
    typeof item.image === "string" && item.image.length > 0
      ? item.image
      : typeof item.image_path === "string" && item.image_path.length > 0
        ? supabase.storage.from("dishes").getPublicUrl(item.image_path).data.publicUrl
        : undefined;

  return {
    category: item.category ?? "",
    description: item.description ?? "",
    id: baseId,
    image,
    lineId: `${baseId}-${index}`,
    macroCategory: item.macroCategory ?? "food",
    note: typeof item.note === "string" ? item.note : typeof item.notes === "string" ? item.notes : "",
    prepTime: item.prepTime ?? "15 min",
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
    selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
    title,
  };
}

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
    items: order.items.map((item, index) => normalizeCartEntry(item, index)),
    summary: { ...order.summary },
    draft: { ...order.draft },
  };
}

function serializeOrderProducts(items: SubmittedOrder["items"]): LegacyOrderProduct[] {
  return items.map((item) => ({
    id: /^\d+$/u.test(item.id) ? Number(item.id) : item.id,
    image: item.image,
    category: item.category,
    macroCategory: item.macroCategory,
    name: item.title,
    notes: item.note || undefined,
    prepTime: item.prepTime,
    price: item.price,
    quantity: item.quantity,
    selectedOptions: item.selectedOptions,
    title: item.title,
  }));
}

function formatPrepTime(minutes: number | null) {
  if (!minutes || Number.isNaN(minutes)) {
    return "15 min";
  }

  return `${minutes} min`;
}

function resolveDishImage(dish: DishRow) {
  if (dish.image && /^https?:\/\//u.test(dish.image)) {
    return dish.image;
  }

  if (dish.image_path) {
    const { data } = supabase.storage.from("dishes").getPublicUrl(dish.image_path);
    return data.publicUrl;
  }

  return dish.image || undefined;
}

function normalizeOrderStatus(status: string | null): OrderStatus {
  switch (status) {
    case "preparing":
      return "preparing";
    case "ready":
      return "ready";
    case "delivered":
      return "delivered";
    case "pending":
    default:
      return "pending";
  }
}

function resolveMacroCategory(menu: MenuRow) {
  const source = `${menu.key ?? ""} ${menu.name_es} ${menu.name_en}`.toLowerCase();

  if (
    source.includes("bebida") ||
    source.includes("drink") ||
    source.includes("bar") ||
    source.includes("cocktail")
  ) {
    return "drinks";
  }

  if (
    source.includes("postre") ||
    source.includes("dessert") ||
    source.includes("dulce")
  ) {
    return "desserts";
  }

  return "food";
}

async function resolveTableId(tableNumber: string) {
  const parsed = Number.parseInt(tableNumber, 10);
  if (Number.isNaN(parsed)) {
    return null;
  }

  const { data } = await supabase
    .from("tables")
    .select("id, table_number")
    .eq("table_number", parsed)
    .maybeSingle<TableRow>();

  return data?.id ?? null;
}

export async function fetchCatalog(language: AppLanguage): Promise<CatalogPayload> {
  try {
    const [{ data: menuData, error: menuError }, { data: dishData, error: dishError }] =
      await Promise.all([
        supabase
          .from("menus")
          .select("id, key, display_order, name_es, name_en, name_ja")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("dishes")
          .select(
            "id, price, prep_time, image, image_path, is_available, is_hot, is_recommended, is_new, name_es, name_en, name_ja, description_es, description_en, description_ja, category_id"
          )
          .eq("is_available", true)
          .order("id", { ascending: true }),
      ]);

    if (menuError || dishError || !menuData || !dishData) {
      await wait();
      return buildFallbackCatalog(language);
    }

    const typedMenus = menuData as MenuRow[];
    const typedDishes = dishData as DishRow[];

    const menuById = new Map<number, { category: string; macroCategory: string }>();
    const macroCategories = new Set<string>();
    const subcategoriesByMacro: Record<string, string[]> = {
      desserts: [getAllCategoryLabel(language)],
      drinks: [getAllCategoryLabel(language)],
      food: [getAllCategoryLabel(language)],
    };

    typedMenus.forEach((menu) => {
      const label = normalizeCategoryName(menu, language);
      if (!label) {
        return;
      }

      const macroCategory = resolveMacroCategory(menu);
      menuById.set(menu.id, { category: label, macroCategory });
      macroCategories.add(macroCategory);

      if (!subcategoriesByMacro[macroCategory].includes(label)) {
        subcategoriesByMacro[macroCategory].push(label);
      }
    });

    const items = typedDishes
      .map<FoodItem | null>((dish) => {
        const menuConfig = menuById.get(dish.category_id);
        if (!menuConfig) {
          return null;
        }

        return {
          id: String(dish.id),
          title: getLocalizedValue(dish, language, "name"),
          description: getLocalizedValue(dish, language, "description"),
          macroCategory: menuConfig.macroCategory,
          category: menuConfig.category,
          price: Number(dish.price),
          prepTime: formatPrepTime(dish.prep_time),
          image: resolveDishImage(dish),
          mostOrdered: Boolean(dish.is_recommended),
          promo: Boolean(dish.is_new || dish.is_hot),
        };
      })
      .filter((item): item is FoodItem => item !== null);

    if (items.length === 0) {
      await wait();
      return buildFallbackCatalog(language);
    }

    return {
      macroCategories: Array.from(macroCategories),
      subcategoriesByMacro,
      items,
    };
  } catch {
    await wait();
    return buildFallbackCatalog(language);
  }
}

export async function fetchOrders(existingOrders: SubmittedOrder[]): Promise<SubmittedOrder[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, total, products, kitchen_status, table_id, tables(id, table_number)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      await wait();
      return existingOrders.map(normalizeSubmittedOrder);
    }

    return (data as OrderRow[]).map((order) => {
      const parsed = parseOrderProducts(order.products);
      const linkedTable = Array.isArray(order.tables) ? order.tables[0] : order.tables;

      return {
        id: String(order.id),
        createdAt: order.created_at ?? new Date().toISOString(),
        items: parsed.items,
        summary: {
          itemCount: parsed.items.reduce((count, item) => count + item.quantity, 0),
          subtotal: Number(order.total),
        },
        draft: {
          ...parsed.draft,
          tableNumber:
            parsed.draft.tableNumber || (linkedTable?.table_number ? String(linkedTable.table_number) : ""),
        },
        status: normalizeOrderStatus(order.kitchen_status),
      };
    });
  } catch {
    await wait();
    return existingOrders.map(normalizeSubmittedOrder);
  }
}

export async function createOrder(input: {
  items: SubmittedOrder["items"];
  summary: SubmittedOrder["summary"];
  draft: CheckoutDraft;
}): Promise<SubmittedOrder> {
  const now = new Date();
  const total = Math.round(input.summary.subtotal);
  const tableId = await resolveTableId(input.draft.tableNumber);
  const payload = {
    created_at: now.toISOString(),
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
    total,
    table_id: tableId,
    products: serializeOrderProducts(input.items),
  };

  try {
    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select("id, created_at, total, products, kitchen_status, table_id, tables(id, table_number)")
      .single<OrderRow>();

    if (error || !data) {
      throw error ?? new Error("Failed to create order");
    }

    const parsed = parseOrderProducts(data.products);
    const linkedTable = Array.isArray(data.tables) ? data.tables[0] : data.tables;

    return {
      id: String(data.id),
      createdAt: data.created_at ?? now.toISOString(),
      items: parsed.items,
      summary: {
        itemCount: parsed.items.reduce((count, item) => count + item.quantity, 0),
        subtotal: Number(data.total),
      },
      draft: {
        ...parsed.draft,
        tableNumber:
          parsed.draft.tableNumber || (linkedTable?.table_number ? String(linkedTable.table_number) : ""),
      },
      status: normalizeOrderStatus(data.kitchen_status),
    };
  } catch {
    await wait(240);
    return {
      id: `order-${Date.now()}`,
      createdAt: now.toISOString(),
      items: input.items.map((item) => ({ ...item })),
      summary: { ...input.summary },
      draft: { ...input.draft },
      status: "pending",
    };
  }
}

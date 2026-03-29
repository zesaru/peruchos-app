import type { AppLanguage, OrderStatus, OrderType } from "../types";

type TranslationShape = {
  menu: {
    subtitle: string;
    currentOrder: string;
    orderId: string;
    table: string;
    noItemsYet: string;
    addDishesPrompt: string;
    emptyCta: string;
    itemsLabel: string;
    placeOrder: string;
    searchPlaceholder: string;
    subtotalLabel: string;
    allCategory: string;
    totalLabel: string;
    historyShort: string;
    macroAll: string;
    macroFood: string;
    macroDrinks: string;
    macroSeafood: string;
    macroStarters: string;
    macroDesserts: string;
  };
  foodCard: {
    mostOrdered: string;
    addToCart: string;
  };
  cart: {
    edit: string;
    noNoteAdded: string;
    kitchenNotePlaceholder: string;
    decrease: string;
    increase: string;
    optionsPrefix: string;
  };
  configurator: {
    addToOrder: string;
    kitchenNote: string;
    optionIce: string;
    optionRice: string;
    optionSize: string;
    optionSpice: string;
    valueFullRice: string;
    valueHalfRice: string;
    valueFullIce: string;
    valueHot: string;
    valueLarge: string;
    valueLightIce: string;
    valueMedium: string;
    valueMild: string;
    valueNoIce: string;
    valueNoRice: string;
    valueRegular: string;
    quantity: string;
    title: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    items: string;
    subtotal: string;
    customerNamePlaceholder: string;
    tablePlaceholder: string;
    note: string;
    back: string;
    sendOrder: string;
  };
  history: {
    screenTitle: string;
    refresh: string;
    emptyTitle: string;
    emptyDescription: string;
    backToMenu: string;
    walkInCustomer: string;
    noTable: string;
    items: string;
  };
  navigation: {
    checkout: string;
    orderHistory: string;
  };
  orderType: Record<OrderType, string>;
  orderStatus: Record<OrderStatus, string>;
};

export const translations: Record<AppLanguage, TranslationShape> = {
  es: {
    menu: {
      subtitle: "Busca y arma pedidos rápido",
      currentOrder: "Tu orden actual",
      orderId: "Orden ID",
      table: "Mesa",
      noItemsYet: "Aún no hay items",
      addDishesPrompt: "Agrega platos del menú para construir la orden.",
      emptyCta: "Agrega platos para continuar",
      itemsLabel: "Items",
      placeOrder: "Hacer pedido",
      searchPlaceholder: "Busca tu comida favorita",
      subtotalLabel: "Subtotal",
      allCategory: "Todo",
      totalLabel: "Total",
      historyShort: "H",
      macroAll: "Todo",
      macroFood: "Cocina Peruana",
      macroDrinks: "Bebida",
      macroSeafood: "Del Mar",
      macroStarters: "Entradas y Sopas",
      macroDesserts: "Postres",
    },
    foodCard: {
      mostOrdered: "Más pedido",
      addToCart: "Agregar",
    },
    cart: {
      edit: "EDITAR",
      noNoteAdded: "Sin nota",
      kitchenNotePlaceholder: "Nota para cocina",
      decrease: "Disminuir",
      increase: "Aumentar",
      optionsPrefix: "Opciones:",
    },
    configurator: {
      addToOrder: "Agregar al pedido",
      kitchenNote: "Nota para cocina",
      optionIce: "Hielo",
      optionRice: "Arroz",
      optionSize: "Tamaño",
      optionSpice: "Picante",
      valueFullIce: "Hielo normal",
      valueFullRice: "Arroz completo",
      valueHalfRice: "Medio arroz",
      valueHot: "Alto",
      valueLarge: "Grande",
      valueLightIce: "Poco hielo",
      valueMedium: "Medio",
      valueMild: "Suave",
      valueNoIce: "Sin hielo",
      valueNoRice: "Sin arroz",
      valueRegular: "Regular",
      quantity: "Cantidad",
      title: "Configurar pedido",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Confirma los detalles del servicio",
      items: "items",
      subtotal: "subtotal",
      customerNamePlaceholder: "Nombre del cliente",
      tablePlaceholder: "Mesa o código de recojo",
      note: "Nota:",
      back: "Volver",
      sendOrder: "Enviar orden",
    },
    history: {
      screenTitle: "Historial de órdenes",
      refresh: "Actualizar",
      emptyTitle: "Aún no hay órdenes",
      emptyDescription: "Completa un checkout para empezar a construir el historial del servicio.",
      backToMenu: "Volver al menú",
      walkInCustomer: "Cliente sin reserva",
      noTable: "Sin mesa",
      items: "items",
    },
    navigation: {
      checkout: "Checkout",
      orderHistory: "Historial",
    },
    orderType: {
      "Dine In": "Mesa",
      Pickup: "Recojo",
    },
    orderStatus: {
      pending: "Enviada",
      preparing: "Preparando",
      ready: "Lista",
      delivered: "Entregada",
    },
  },
  en: {
    menu: {
      subtitle: "Search and build orders fast",
      currentOrder: "Your Current Order",
      orderId: "Order ID",
      table: "Table",
      noItemsYet: "No items yet",
      addDishesPrompt: "Add dishes from the menu to build the order.",
      emptyCta: "Add dishes to continue",
      itemsLabel: "Items",
      placeOrder: "Place Order",
      searchPlaceholder: "Search your favorite food",
      subtotalLabel: "Subtotal",
      allCategory: "All",
      totalLabel: "Total",
      historyShort: "H",
      macroAll: "All",
      macroFood: "Peruvian Cuisine",
      macroDrinks: "Drinks",
      macroSeafood: "Seafood",
      macroStarters: "Starters & Soups",
      macroDesserts: "Desserts",
    },
    foodCard: {
      mostOrdered: "Most ordered",
      addToCart: "Add",
    },
    cart: {
      edit: "EDIT",
      noNoteAdded: "No note added",
      kitchenNotePlaceholder: "Kitchen note",
      decrease: "Decrease",
      increase: "Increase",
      optionsPrefix: "Options:",
    },
    configurator: {
      addToOrder: "Add to order",
      kitchenNote: "Kitchen note",
      optionIce: "Ice",
      optionRice: "Rice",
      optionSize: "Size",
      optionSpice: "Spice",
      valueFullIce: "Regular Ice",
      valueFullRice: "Full Rice",
      valueHalfRice: "Half Rice",
      valueHot: "Hot",
      valueLarge: "Large",
      valueLightIce: "Light Ice",
      valueMedium: "Medium",
      valueMild: "Mild",
      valueNoIce: "No Ice",
      valueNoRice: "No Rice",
      valueRegular: "Regular",
      quantity: "Quantity",
      title: "Configurator",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Confirm service details",
      items: "items",
      subtotal: "subtotal",
      customerNamePlaceholder: "Customer name",
      tablePlaceholder: "Table or pickup code",
      note: "Note:",
      back: "Back",
      sendOrder: "Send order",
    },
    history: {
      screenTitle: "Order History",
      refresh: "Refresh",
      emptyTitle: "No orders sent yet",
      emptyDescription: "Complete a checkout to start building the service history.",
      backToMenu: "Back to menu",
      walkInCustomer: "Walk-in customer",
      noTable: "No table",
      items: "items",
    },
    navigation: {
      checkout: "Checkout",
      orderHistory: "Order History",
    },
    orderType: {
      "Dine In": "Dine In",
      Pickup: "Pickup",
    },
    orderStatus: {
      pending: "Sent",
      preparing: "Preparing",
      ready: "Ready",
      delivered: "Delivered",
    },
  },
  ja: {
    menu: {
      subtitle: "すばやく検索して注文を作成",
      currentOrder: "現在の注文",
      orderId: "注文ID",
      table: "テーブル",
      noItemsYet: "まだ商品がありません",
      addDishesPrompt: "メニューから料理を追加して注文を作成してください。",
      emptyCta: "料理を追加して続行",
      itemsLabel: "商品数",
      placeOrder: "注文する",
      searchPlaceholder: "料理を検索",
      subtotalLabel: "小計",
      allCategory: "すべて",
      totalLabel: "合計",
      historyShort: "履",
      macroAll: "すべて",
      macroFood: "ペルー料理",
      macroDrinks: "飲み物",
      macroSeafood: "海鮮",
      macroStarters: "前菜とスープ",
      macroDesserts: "デザート",
    },
    foodCard: {
      mostOrdered: "人気商品",
      addToCart: "追加",
    },
    cart: {
      edit: "編集",
      noNoteAdded: "メモなし",
      kitchenNotePlaceholder: "キッチンメモ",
      decrease: "減らす",
      increase: "増やす",
      optionsPrefix: "オプション:",
    },
    configurator: {
      addToOrder: "注文に追加",
      kitchenNote: "キッチンメモ",
      optionIce: "氷",
      optionRice: "ご飯",
      optionSize: "サイズ",
      optionSpice: "辛さ",
      valueFullIce: "通常の氷",
      valueFullRice: "普通盛り",
      valueHalfRice: "半分",
      valueHot: "辛口",
      valueLarge: "大",
      valueLightIce: "少なめ",
      valueMedium: "中辛",
      valueMild: "控えめ",
      valueNoIce: "氷なし",
      valueNoRice: "ご飯なし",
      valueRegular: "普通",
      quantity: "数量",
      title: "設定",
    },
    checkout: {
      title: "チェックアウト",
      subtitle: "注文内容を確認してください",
      items: "品目",
      subtotal: "小計",
      customerNamePlaceholder: "お客様名",
      tablePlaceholder: "テーブル番号または受取コード",
      note: "メモ:",
      back: "戻る",
      sendOrder: "注文を送信",
    },
    history: {
      screenTitle: "注文履歴",
      refresh: "更新",
      emptyTitle: "まだ注文がありません",
      emptyDescription: "チェックアウトを完了すると履歴が表示されます。",
      backToMenu: "メニューへ戻る",
      walkInCustomer: "フリーのお客様",
      noTable: "テーブルなし",
      items: "品目",
    },
    navigation: {
      checkout: "チェックアウト",
      orderHistory: "注文履歴",
    },
    orderType: {
      "Dine In": "店内",
      Pickup: "受取",
    },
    orderStatus: {
      pending: "送信済み",
      preparing: "調理中",
      ready: "準備完了",
      delivered: "提供済み",
    },
  },
};

export function getTranslations(language: AppLanguage) {
  return translations[language];
}

export function getAllCategoryLabel(language: AppLanguage) {
  return translations[language].menu.allCategory;
}

export function getMacroCategoryLabels(language: AppLanguage) {
  const menu = translations[language].menu;

  return {
    all: menu.macroAll,
    desserts: menu.macroDesserts,
    drinks: menu.macroDrinks,
    food: menu.macroFood,
    seafood: menu.macroSeafood,
    starters: menu.macroStarters,
  };
}

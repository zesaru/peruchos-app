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
    assignedTableLabel: string;
    note: string;
    back: string;
    sendOrder: string;
  };
  setup: {
    kicker: string;
    title: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    inputHint: string;
    continue: string;
    scanQr: string;
    errorTitle: string;
    emptyTableError: string;
    notFoundError: string;
    networkError: string;
  };
  adminUnlock: {
    kicker: string;
    title: string;
    description: string;
    descriptionNoTable: string;
    pinLabel: string;
    pinPlaceholder: string;
    cancel: string;
    continue: string;
    errorTitle: string;
    invalidPin: string;
  };
  adminSettings: {
    kicker: string;
    title: string;
    tableAssigned: string;
    noTableAssigned: string;
    pinSection: string;
    newPinPlaceholder: string;
    confirmPinPlaceholder: string;
    savePin: string;
    tableSection: string;
    scanQr: string;
    reassignTable: string;
    close: string;
    errorTitle: string;
    invalidPinFormat: string;
    pinMismatch: string;
    successTitle: string;
    pinUpdated: string;
  };
  scanner: {
    kicker: string;
    title: string;
    description: string;
    footer: string;
    processing: string;
    permissionTitle: string;
    permissionDescription: string;
    grantAccess: string;
    cancel: string;
    errorTitle: string;
    notFoundError: string;
    networkError: string;
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
      assignedTableLabel: "Mesa asignada",
      note: "Nota:",
      back: "Volver",
      sendOrder: "Enviar orden",
    },
    setup: {
      kicker: "Configurar tablet",
      title: "Asigna esta tablet a una mesa",
      description: "Ingresa el número de mesa para dejar la experiencia lista para self-order.",
      inputLabel: "Número de mesa",
      inputPlaceholder: "Ejemplo: 12 o pega el QR",
      inputHint: "Acepta número directo, URL del QR o payload pegado.",
      continue: "Continuar",
      scanQr: "Escanear QR",
      errorTitle: "No se pudo continuar",
      emptyTableError: "Ingresa un número de mesa válido.",
      notFoundError: "No encontramos esa mesa en el sistema.",
      networkError: "No pudimos validar la mesa. Revisa la conexión e inténtalo otra vez.",
    },
    adminUnlock: {
      kicker: "Acceso admin",
      title: "Reconfigurar esta tablet",
      description: "Ingresa el PIN para liberar la tablet de la mesa {table}.",
      descriptionNoTable: "Ingresa el PIN para abrir la reconfiguración de la tablet.",
      pinLabel: "PIN de administrador",
      pinPlaceholder: "••••",
      cancel: "Cancelar",
      continue: "Desbloquear",
      errorTitle: "PIN incorrecto",
      invalidPin: "El PIN no es válido.",
    },
    adminSettings: {
      kicker: "Panel admin",
      title: "Administrar tablet",
      tableAssigned: "Esta tablet está asignada a la mesa {table}.",
      noTableAssigned: "Esta tablet aún no tiene mesa asignada.",
      pinSection: "Cambiar PIN",
      newPinPlaceholder: "Nuevo PIN",
      confirmPinPlaceholder: "Confirmar PIN",
      savePin: "Guardar PIN",
      tableSection: "Mesa",
      scanQr: "Escanear QR de mesa",
      reassignTable: "Reasignar mesa",
      close: "Cerrar",
      errorTitle: "No se pudo guardar",
      invalidPinFormat: "El PIN debe tener entre 4 y 6 dígitos.",
      pinMismatch: "Los PIN no coinciden.",
      successTitle: "PIN actualizado",
      pinUpdated: "El nuevo PIN quedó guardado.",
    },
    scanner: {
      kicker: "Escáner QR",
      title: "Escanea el QR de la mesa",
      description: "Apunta la cámara al QR para asignar esta tablet a la mesa correcta.",
      footer: "Mantén el QR dentro del marco.",
      processing: "Validando mesa...",
      permissionTitle: "Permite usar la cámara",
      permissionDescription: "Necesitamos la cámara para leer el QR de la mesa.",
      grantAccess: "Permitir cámara",
      cancel: "Cancelar",
      errorTitle: "No se pudo asignar la mesa",
      notFoundError: "El QR no corresponde a una mesa válida.",
      networkError: "No pudimos validar el QR. Revisa la conexión e inténtalo otra vez.",
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
      assignedTableLabel: "Assigned table",
      note: "Note:",
      back: "Back",
      sendOrder: "Send order",
    },
    setup: {
      kicker: "Tablet setup",
      title: "Assign this tablet to a table",
      description: "Enter the table number once to keep the self-order flow ready for guests.",
      inputLabel: "Table number",
      inputPlaceholder: "Example: 12 or paste the QR",
      inputHint: "Accepts direct table number, QR URL, or pasted payload.",
      continue: "Continue",
      scanQr: "Scan QR",
      errorTitle: "Unable to continue",
      emptyTableError: "Enter a valid table number.",
      notFoundError: "We could not find that table in the system.",
      networkError: "We could not validate the table. Check the connection and try again.",
    },
    adminUnlock: {
      kicker: "Admin access",
      title: "Reconfigure this tablet",
      description: "Enter the PIN to release this tablet from table {table}.",
      descriptionNoTable: "Enter the PIN to open tablet reconfiguration.",
      pinLabel: "Administrator PIN",
      pinPlaceholder: "••••",
      cancel: "Cancel",
      continue: "Unlock",
      errorTitle: "Invalid PIN",
      invalidPin: "The PIN is not valid.",
    },
    adminSettings: {
      kicker: "Admin panel",
      title: "Manage tablet",
      tableAssigned: "This tablet is assigned to table {table}.",
      noTableAssigned: "This tablet does not have a table assigned yet.",
      pinSection: "Change PIN",
      newPinPlaceholder: "New PIN",
      confirmPinPlaceholder: "Confirm PIN",
      savePin: "Save PIN",
      tableSection: "Table",
      scanQr: "Scan table QR",
      reassignTable: "Reassign table",
      close: "Close",
      errorTitle: "Unable to save",
      invalidPinFormat: "The PIN must contain 4 to 6 digits.",
      pinMismatch: "The PIN values do not match.",
      successTitle: "PIN updated",
      pinUpdated: "The new PIN has been saved.",
    },
    scanner: {
      kicker: "QR scanner",
      title: "Scan the table QR",
      description: "Point the camera at the code to assign this tablet to the correct table.",
      footer: "Keep the QR code inside the frame.",
      processing: "Validating table...",
      permissionTitle: "Allow camera access",
      permissionDescription: "We need the camera to read the table QR code.",
      grantAccess: "Allow camera",
      cancel: "Cancel",
      errorTitle: "Unable to assign table",
      notFoundError: "The QR code does not match a valid table.",
      networkError: "We could not validate the QR code. Check the connection and try again.",
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
      assignedTableLabel: "割り当て済みテーブル",
      note: "メモ:",
      back: "戻る",
      sendOrder: "注文を送信",
    },
    setup: {
      kicker: "タブレット設定",
      title: "このタブレットをテーブルに割り当てる",
      description: "テーブル番号を一度入力して、セルフオーダーをすぐ使える状態にします。",
      inputLabel: "テーブル番号",
      inputPlaceholder: "例: 12 またはQR内容を貼り付け",
      inputHint: "テーブル番号、QRのURL、貼り付けたペイロードに対応します。",
      continue: "続ける",
      scanQr: "QRをスキャン",
      errorTitle: "続行できません",
      emptyTableError: "有効なテーブル番号を入力してください。",
      notFoundError: "そのテーブルはシステムで見つかりませんでした。",
      networkError: "テーブルを確認できませんでした。接続を確認して再試行してください。",
    },
    adminUnlock: {
      kicker: "管理者アクセス",
      title: "このタブレットを再設定する",
      description: "PINを入力して、テーブル{table}からこの端末を解除します。",
      descriptionNoTable: "PINを入力してタブレット設定を開きます。",
      pinLabel: "管理者PIN",
      pinPlaceholder: "••••",
      cancel: "キャンセル",
      continue: "解除する",
      errorTitle: "PINが違います",
      invalidPin: "PINが正しくありません。",
    },
    adminSettings: {
      kicker: "管理パネル",
      title: "タブレット管理",
      tableAssigned: "このタブレットはテーブル{table}に割り当てられています。",
      noTableAssigned: "このタブレットにはまだテーブルが割り当てられていません。",
      pinSection: "PIN変更",
      newPinPlaceholder: "新しいPIN",
      confirmPinPlaceholder: "PIN確認",
      savePin: "PINを保存",
      tableSection: "テーブル",
      scanQr: "テーブルQRをスキャン",
      reassignTable: "テーブルを再割り当て",
      close: "閉じる",
      errorTitle: "保存できません",
      invalidPinFormat: "PINは4〜6桁の数字で入力してください。",
      pinMismatch: "PINが一致しません。",
      successTitle: "PIN更新完了",
      pinUpdated: "新しいPINが保存されました。",
    },
    scanner: {
      kicker: "QRスキャナー",
      title: "テーブルQRを読み取る",
      description: "QRコードにカメラを向けて、このタブレットを正しいテーブルに割り当てます。",
      footer: "QRコードを枠の中に収めてください。",
      processing: "テーブルを確認中...",
      permissionTitle: "カメラへのアクセスを許可",
      permissionDescription: "テーブルQRを読むためにカメラが必要です。",
      grantAccess: "カメラを許可",
      cancel: "キャンセル",
      errorTitle: "テーブルを割り当てできません",
      notFoundError: "このQRは有効なテーブルに対応していません。",
      networkError: "QRを確認できませんでした。接続を確認して再試行してください。",
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

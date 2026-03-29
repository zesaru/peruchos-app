import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../App";
import { CartItem } from "../components/CartItem";
import { CategoryRibbon } from "../components/CategoryRibbon";
import { FoodCard } from "../components/FoodCard";
import { MacroCategoryTabs } from "../components/MacroCategoryTabs";
import { ProductConfiguratorPreview } from "../components/ProductConfiguratorPreview";
import { SplitViewContainer } from "../components/SplitViewContainer";
import { useResponsive } from "../hooks/useResponsive";
import { getAllCategoryLabel, getMacroCategoryLabels, getTranslations } from "../i18n/translations";
import { formatJPY } from "../lib/currency";
import { fetchCatalog } from "../services/api";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import type { Category, FoodItem } from "../types";

export function MenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState("");
  const { isTablet, menuColumns, typeRamp } = useResponsive();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const macroLabels = getMacroCategoryLabels(language);
  const allCategoryLabel = getAllCategoryLabel(language);
  const [selectedMacroCategory, setSelectedMacroCategory] = useState("food");
  const [selectedCategory, setSelectedCategory] = useState<Category>(allCategoryLabel);
  const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(null);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [cartHighlight, setCartHighlight] = useState(false);
  const [catalog, setCatalog] = useState<FoodItem[]>([]);
  const [macroCategories, setMacroCategories] = useState<string[]>(["food"]);
  const [subcategoriesByMacro, setSubcategoriesByMacro] = useState<Record<string, Category[]>>({
    desserts: [allCategoryLabel],
    drinks: [allCategoryLabel],
    food: [allCategoryLabel],
  });
  const cartItems = useCartStore((state) => state.items);
  const cartSummary = useCartStore((state) => state.summary);
  const placeOrder = useCartStore((state) => state.placeOrder);

  useEffect(() => {
    let mounted = true;
    void fetchCatalog(language).then((data) => {
      if (!mounted) {
        return;
      }

      setCatalog(data.items);
      setMacroCategories(data.macroCategories);
      setSubcategoriesByMacro(data.subcategoriesByMacro);
      const nextMacro = data.macroCategories.includes(selectedMacroCategory)
        ? selectedMacroCategory
        : data.macroCategories[0] ?? "food";
      setSelectedMacroCategory(nextMacro);
      setSelectedCategory(data.subcategoriesByMacro[nextMacro]?.[0] ?? allCategoryLabel);
    });
    return () => {
      mounted = false;
    };
  }, [allCategoryLabel, language]);

  const visibleCategories = useMemo(
    () => subcategoriesByMacro[selectedMacroCategory] ?? [allCategoryLabel],
    [allCategoryLabel, selectedMacroCategory, subcategoriesByMacro]
  );

  useEffect(() => {
    setSelectedCategory((current) =>
      visibleCategories.includes(current) ? current : allCategoryLabel
    );
  }, [allCategoryLabel, visibleCategories]);

  const filteredItems = useMemo(() => {
    const byMacro = catalog.filter((item) => item.macroCategory === selectedMacroCategory);

    const byCategory =
      selectedCategory === allCategoryLabel
        ? byMacro
        : byMacro.filter((item) => item.category === selectedCategory);

    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return byCategory;
    }

    return byCategory.filter((item) => {
      return (
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.description.toLowerCase().includes(trimmedQuery)
      );
    });
  }, [allCategoryLabel, catalog, query, selectedCategory, selectedMacroCategory]);

  const organizedItems = useMemo(() => {
    return [...filteredItems].sort((left, right) => {
      const priorityDelta =
        Number(Boolean(right.mostOrdered)) - Number(Boolean(left.mostOrdered));
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      const promoDelta = Number(Boolean(right.promo)) - Number(Boolean(left.promo));
      if (promoDelta !== 0) {
        return promoDelta;
      }

      return left.title.localeCompare(right.title);
    });
  }, [filteredItems]);

  const macroCategoryOptions = useMemo(
    () =>
      macroCategories.map((categoryId) => ({
        id: categoryId,
        label:
          categoryId === "food"
            ? macroLabels.food
            : categoryId === "drinks"
              ? macroLabels.drinks
              : categoryId === "seafood"
                ? macroLabels.seafood
                : categoryId === "starters"
                  ? macroLabels.starters
                  : macroLabels.desserts,
      })),
    [macroCategories, macroLabels]
  );

  const activeMacroLabel = useMemo(() => {
    return (
      macroCategoryOptions.find((category) => category.id === selectedMacroCategory)?.label ??
      macroLabels.food
    );
  }, [macroCategoryOptions, macroLabels.food, selectedMacroCategory]);

  function handleSelectMacroCategory(categoryId: string) {
    setSelectedMacroCategory(categoryId);
    setSelectedCategory(subcategoriesByMacro[categoryId]?.[0] ?? allCategoryLabel);
  }

  function handleSelectItem(item: FoodItem) {
    setSelectedProduct(item);
    setIsConfiguratorOpen(true);
  }

  function handleConfiguredItemAdded() {
    setCartHighlight(true);
    setTimeout(() => {
      setCartHighlight(false);
    }, 650);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f6dedd] px-4 py-4">
      <SplitViewContainer
        cartPanel={
          <View
            className={`flex-1 rounded-[28px] px-4 py-5 ${
              cartHighlight ? "border-2 border-[#2fa34f] bg-[#f6fff8]" : "border border-[#f0e9e5] bg-white"
            }`}
          >
            <View className="gap-3 border-b border-[#efebe8] pb-4">
              <View className="gap-1">
                <Text className="text-[18px] text-[#232120]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.menu.currentOrder}
                </Text>
                <Text className="text-[12px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                  {t.menu.orderId}: #161
                </Text>
                <Text className="text-[12px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                  {t.menu.table}: 12
                </Text>
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1 rounded-[18px] bg-[#faf6f4] px-3 py-3">
                  <Text className="text-[11px] uppercase tracking-[1px] text-[#8c857f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {t.menu.itemsLabel}
                  </Text>
                  <Text className="mt-1 text-[20px] text-[#232120]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {cartSummary.itemCount}
                  </Text>
                </View>
                <View className="flex-1 rounded-[18px] bg-[#faf6f4] px-3 py-3">
                  <Text className="text-[11px] uppercase tracking-[1px] text-[#8c857f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {t.menu.totalLabel}
                  </Text>
                  <Text className="mt-1 text-[20px] text-[#232120]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {formatJPY(cartSummary.subtotal)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-1 gap-3 py-4">
              {cartItems.length === 0 ? (
                <View className="rounded-[22px] bg-[#faf6f4] p-4">
                  <Text className="text-[16px] text-[#232120]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {t.menu.noItemsYet}
                  </Text>
                  <Text className="mt-1 text-[13px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                    {t.menu.addDishesPrompt}
                  </Text>
                </View>
              ) : (
                cartItems.map((item) => <CartItem key={item.lineId} item={item} />)
              )}
            </View>

            <View className="gap-3 border-t border-[#efebe8] pt-4">
              <View className="gap-2 rounded-[20px] bg-[#faf6f4] px-4 py-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[13px] text-[#8c857f]" style={{ fontFamily: "Inter_700Bold" }}>
                    {t.menu.subtotalLabel}
                  </Text>
                  <Text className="text-[15px] text-[#232120]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {formatJPY(cartSummary.subtotal)}
                  </Text>
                </View>
                <View className="h-px bg-[#ece5e1]" />
                <View className="flex-row items-center justify-between">
                  <Text className="text-[13px] text-[#8c857f]" style={{ fontFamily: "Inter_700Bold" }}>
                    {t.menu.totalLabel}
                  </Text>
                  <Text className="text-[26px] text-[#232120]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {formatJPY(cartSummary.subtotal)}
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                className={`items-center rounded-2xl py-4 ${
                  cartItems.length === 0 ? "bg-[#f0e6e3]" : "bg-[#d80f16]"
                }`}
                disabled={cartItems.length === 0}
                hitSlop={14}
                onPress={async () => {
                  await placeOrder();
                  navigation.navigate("Checkout");
                }}
              >
                <Text
                  className={`text-[16px] ${
                    cartItems.length === 0 ? "text-[#9c948e]" : "text-white"
                  }`}
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  {cartItems.length === 0 ? t.menu.emptyCta : t.menu.placeOrder}
                </Text>
              </Pressable>
            </View>
          </View>
        }
        isTablet={isTablet}
        menuPanel={
          <View className="flex-1 gap-3 rounded-[28px] bg-white px-5 py-5">
            <View className="flex-row items-start gap-4">
              <View className="flex-1 gap-4">
                <MacroCategoryTabs
                  categories={macroCategoryOptions}
                  onSelect={handleSelectMacroCategory}
                  selectedCategory={selectedMacroCategory}
                />

                <View className="rounded-full border border-[#ece7e4] bg-[#faf9f8] px-4 py-3">
                  <TextInput
                    className="text-[14px] text-[#1f1f1f]"
                    onChangeText={setQuery}
                    placeholder={t.menu.searchPlaceholder}
                    placeholderTextColor="#9c948e"
                    value={query}
                  />
                </View>
              </View>
              <Pressable
                className="mt-0.5 h-12 w-12 items-center justify-center rounded-full bg-[#1692f5]"
                onPress={() => navigation.navigate("History")}
              >
                <Text className="text-[20px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.menu.historyShort}
                </Text>
              </Pressable>
            </View>

            <View className="gap-2 rounded-[22px] border border-[#f1ece9] bg-[#fcfbfa] px-4 py-3">
              <View className="flex-row items-end justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text
                    className="text-[#232120]"
                    style={{ fontFamily: "Inter_800ExtraBold", fontSize: typeRamp.section }}
                  >
                    {activeMacroLabel}
                  </Text>
                  <Text
                    className="text-[13px] text-[#8c857f]"
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    {selectedCategory === allCategoryLabel ? activeMacroLabel : selectedCategory}
                  </Text>
                </View>
                <View className="rounded-full bg-white px-3 py-2">
                  <Text
                    className="text-[12px] text-[#5c5651]"
                    style={{ fontFamily: "Inter_800ExtraBold" }}
                  >
                    {organizedItems.length} {t.checkout.items}
                  </Text>
                </View>
              </View>

              <CategoryRibbon
                categories={visibleCategories}
                onSelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </View>

            <FoodCard
              data={organizedItems}
              key={`${selectedCategory}-${query}-${isTablet ? "tablet" : "phone"}`}
              numColumns={menuColumns}
              onSelectItem={handleSelectItem}
            />
          </View>
        }
        panelRadius={32}
        shellGap={12}
      />
      <ProductConfiguratorPreview
        item={selectedProduct}
        onAdded={handleConfiguredItemAdded}
        onClose={() => {
          setIsConfiguratorOpen(false);
          setSelectedProduct(null);
        }}
        visible={isConfiguratorOpen}
      />
    </SafeAreaView>
  );
}

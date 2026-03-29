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
import { fetchCatalog } from "../services/api";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import type { Category, FoodItem } from "../types";

export function MenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState("");
  const { isTablet, menuColumns } = useResponsive();
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
            <View className="gap-1 border-b border-[#efebe8] pb-4">
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

            <Pressable
              accessibilityRole="button"
              className="items-center rounded-2xl bg-[#d80f16] py-4"
              hitSlop={14}
              onPress={async () => {
                await placeOrder();
                navigation.navigate("Checkout");
              }}
            >
              <Text className="text-[16px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                {t.menu.placeOrder}
              </Text>
            </Pressable>
          </View>
        }
        isTablet={isTablet}
        menuPanel={
          <View className="flex-1 gap-2 rounded-[28px] bg-white px-5 py-5">
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

            <CategoryRibbon
              categories={visibleCategories}
              onSelect={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

            <FoodCard
              data={filteredItems}
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

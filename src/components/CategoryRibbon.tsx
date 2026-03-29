import { Pressable, ScrollView, Text, View } from "react-native";

import { getTranslations } from "../i18n/translations";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import type { Category } from "../types";

type CategoryRibbonProps = {
  categories: Category[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
};

function getCategoryIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized === "all" || normalized.includes("todo")) {
    return "•";
  }

  if (normalized.includes("kimb") || normalized.includes("roll")) {
    return "◫";
  }

  if (normalized.includes("soup") || normalized.includes("caldo") || normalized.includes("ramen")) {
    return "◌";
  }

  if (normalized.includes("noodle") || normalized.includes("pasta") || normalized.includes("fideo")) {
    return "≋";
  }

  return "•";
}

export function CategoryRibbon({
  categories,
  onSelect,
  selectedCategory,
}: CategoryRibbonProps) {
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const uniqueCategories = Array.from(
    new Set(categories.filter((category) => typeof category === "string" && category.trim().length > 0))
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 0, paddingRight: 2 }}
    >
      <View className="flex-row items-center gap-1">
        {uniqueCategories.map((category, index) => {
          const active = category === selectedCategory;

          return (
            <Pressable
              key={`${category}-${index}`}
              hitSlop={8}
              onPress={() => onSelect(category)}
              className={`h-9 flex-row items-center self-start rounded-full border px-2.5 ${
                active
                  ? "border-[#ea8f93] bg-white"
                  : "border-[#ece7e4] bg-[#f4f3f3]"
              }`}
            >
              <Text
                className={`mr-1 text-[10px] ${
                  active ? "text-[#d80f16]" : "text-[#9a938d]"
                }`}
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {getCategoryIcon(category)}
              </Text>
              <Text
                className={`text-[13px] ${
                  active ? "text-[#d80f16]" : "text-[#75716d]"
                }`}
                style={{ fontFamily: active ? "Inter_800ExtraBold" : "Inter_700Bold" }}
              >
                {category === "All" ? t.menu.allCategory : category}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

import { Pressable, Text, View } from "react-native";

type MacroCategoryTabsProps = {
  categories: Array<{ id: string; label: string }>;
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
};

export function MacroCategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: MacroCategoryTabsProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {categories.map((category) => {
        const active = category.id === selectedCategory;

        return (
          <Pressable
            key={category.id}
            className={`rounded-full px-4 py-3 ${
              active ? "bg-[#d80f16]" : "bg-[#f1efee]"
            }`}
            hitSlop={10}
            onPress={() => onSelect(category.id)}
          >
            <Text
              className={`text-[14px] ${active ? "text-white" : "text-[#4a4541]"}`}
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

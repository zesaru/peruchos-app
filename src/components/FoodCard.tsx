import { FlashList } from "@shopify/flash-list";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { formatJPY } from "../lib/currency";
import { getTranslations } from "../i18n/translations";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { RemoteImageCard } from "./RemoteImageCard";
import type { FoodItem } from "../types";

type FoodCardProps = {
  data: FoodItem[];
  numColumns: number;
  onSelectItem: (item: FoodItem) => void;
};

const mockImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
];

const FoodCardItem = memo(function FoodCardItem({
  index,
  item,
  onSelectItem,
}: {
  index: number;
  item: FoodItem;
  onSelectItem: (item: FoodItem) => void;
}) {
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(250)}>
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityLabel={`${t.foodCard.addToCart} ${item.title}`}
          accessibilityRole="button"
          className="m-1 overflow-hidden rounded-[20px] border border-[#ecd8d4] bg-white"
          hitSlop={12}
          onPress={() => onSelectItem(item)}
          onPressIn={() => {
            scale.value = withSpring(0.985, { damping: 18, stiffness: 240 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 18, stiffness: 240 });
          }}
        >
          <View className="relative">
            <RemoteImageCard
              fallbackUri={mockImages[index % mockImages.length]}
              heightClassName="h-36"
              uri={item.image}
            />
            {item.mostOrdered ? (
              <View className="absolute left-2 top-2 rounded-full bg-[#d80f16] px-3 py-1">
                <Text
                  className="text-[11px] text-white"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  {t.foodCard.mostOrdered}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="gap-3 p-3.5">
            <View className="flex-row items-center justify-between gap-2">
              <Text
                className="flex-1 text-[11px] uppercase tracking-[1px] text-[#9a938d]"
                numberOfLines={1}
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {item.category}
              </Text>
              <Text
                className="text-[11px] text-[#9a938d]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {item.prepTime}
              </Text>
            </View>

            <Text
              className="text-[19px] text-[#22201e]"
              numberOfLines={2}
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {item.title}
            </Text>

            <Text
              className="min-h-[36px] text-[12px] leading-5 text-[#8c857f]"
              numberOfLines={2}
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {item.description}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text
                className="text-[21px] text-[#1f1f1f]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {formatJPY(item.price)}
              </Text>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#d80f16] shadow-sm">
                <Text
                  className="text-[20px] text-white"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  +
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

export function FoodCard({ data, numColumns, onSelectItem }: FoodCardProps) {
  const renderItem = useCallback(
    ({ index, item }: { index: number; item: FoodItem }) => (
      <FoodCardItem index={index} item={item} onSelectItem={onSelectItem} />
    ),
    [onSelectItem]
  );

  const keyExtractor = useCallback((item: FoodItem) => item.id, []);

  return (
    <FlashList
      contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
      data={data}
      key={`menu-${numColumns}`}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

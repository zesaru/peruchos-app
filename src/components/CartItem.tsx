import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { formatJPY } from "../lib/currency";
import { getTranslations } from "../i18n/translations";
import { RemoteImageCard } from "./RemoteImageCard";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import type { CartEntry } from "../types";

const thumb =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80";

type CartItemProps = {
  item: CartEntry;
};

export function CartItem({ item }: CartItemProps) {
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const addItem = useCartStore((state) => state.addItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const updateNote = useCartStore((state) => state.updateNote);
  const [draftNote, setDraftNote] = useState(item.note);
  const selectedOptions = Array.isArray(item.selectedOptions) ? item.selectedOptions : [];

  useEffect(() => {
    setDraftNote(item.note);
  }, [item.lineId, item.note]);

  return (
    <Animated.View
      entering={FadeInRight.duration(220)}
      className="gap-3 rounded-[18px] border border-[#f1ece9] bg-white p-3"
    >
      <View className="flex-row gap-3">
        <View className="h-14 w-14 overflow-hidden rounded-[12px]">
          <RemoteImageCard
            fallbackUri={thumb}
            heightClassName="h-14"
            uri={item.image}
          />
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text
              className="flex-1 text-[15px] text-[#232120]"
              numberOfLines={2}
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {item.title}
            </Text>
            <Text
              className="text-[10px] uppercase tracking-[0.8px] text-[#1692f5]"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {t.cart.edit}
            </Text>
          </View>

          {selectedOptions.length > 0 ? (
            <Text
              className="text-[12px] text-[#8c857f]"
              numberOfLines={1}
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {t.cart.optionsPrefix} {selectedOptions.join(" · ")}
            </Text>
          ) : null}

          <View className="mt-1 flex-row items-center justify-between">
            <Text
              className="text-[17px] text-[#22201e]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {formatJPY(item.price * item.quantity)}
            </Text>

            <View className="flex-row items-center gap-1.5 rounded-full bg-[#f5f5f5] px-2 py-1">
              <Pressable
                accessibilityLabel={`${t.cart.decrease} ${item.title}`}
                accessibilityRole="button"
                className="h-7 w-7 items-center justify-center rounded-full bg-white"
                hitSlop={12}
                onPress={() => decreaseItem(item.lineId)}
              >
                <Text
                  className="text-[16px] text-[#232120]"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  -
                </Text>
              </Pressable>
              <Text
                className="min-w-[18px] text-center text-[14px] text-[#232120]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {item.quantity}
              </Text>
              <Pressable
                accessibilityLabel={`${t.cart.increase} ${item.title}`}
                accessibilityRole="button"
                className="h-7 w-7 items-center justify-center rounded-full bg-white"
                hitSlop={12}
                onPress={() => void addItem(item)}
              >
                <Text
                  className="text-[16px] text-[#232120]"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <TextInput
        blurOnSubmit
        className="rounded-2xl bg-[#faf7f5] px-4 py-3 text-[12px] text-[#232120]"
        multiline
        onBlur={() => updateNote(item.lineId, draftNote)}
        onChangeText={setDraftNote}
        placeholder={t.cart.kitchenNotePlaceholder}
        placeholderTextColor="#a19a94"
        textAlignVertical="top"
        value={draftNote}
      />
    </Animated.View>
  );
}

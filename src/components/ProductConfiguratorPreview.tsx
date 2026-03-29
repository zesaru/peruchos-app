import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { formatJPY } from "../lib/currency";
import { getTranslations } from "../i18n/translations";
import { RemoteImageCard } from "./RemoteImageCard";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import type { FoodItem } from "../types";

type ProductConfiguratorPreviewProps = {
  item: FoodItem | null;
  onAdded?: () => void;
  onClose: () => void;
  visible: boolean;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80";

export function ProductConfiguratorPreview({
  item,
  onAdded,
  onClose,
  visible,
}: ProductConfiguratorPreviewProps) {
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const addConfiguredItem = useCartStore((state) => state.addConfiguredItem);
  const [draftNote, setDraftNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!visible || !item) {
      return;
    }

    setDraftNote("");
    setQuantity(1);
    setSelectedOptions([]);
  }, [item, visible]);

  if (!item) {
    return null;
  }

  const optionGroups =
    item.macroCategory === "drinks"
      ? [
          { label: t.configurator.optionSize, options: ["Small", "Regular", "Large"] },
          { label: t.configurator.optionIce, options: ["No Ice", "Light Ice", "Regular Ice"] },
        ]
      : [
          { label: t.configurator.optionRice, options: ["No Rice", "Half Rice", "Full Rice"] },
          { label: t.configurator.optionSpice, options: ["Mild", "Medium", "Hot"] },
        ];

  function selectOption(groupLabel: string, option: string) {
    setSelectedOptions((current) => {
      const next = current.filter((entry) => !entry.startsWith(`${groupLabel}:`));
      next.push(`${groupLabel}: ${option}`);
      return next;
    });
  }

  function isSelected(groupLabel: string, option: string) {
    return selectedOptions.includes(`${groupLabel}: ${option}`);
  }

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/35 px-6">
        <View className="w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[#f0e9e5] bg-white shadow-sm">
          <RemoteImageCard
            fallbackUri={fallbackImage}
            heightClassName="h-56"
            uri={item.image}
          />

          <View className="gap-4 p-5">
            <View className="gap-2">
              <Text
                className="text-[24px] text-[#231f20]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {item.title}
              </Text>
              <Text
                className="text-[14px] leading-6 text-[#8c857f]"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                {item.description}
              </Text>
            </View>

            <View className="rounded-[20px] bg-[#faf7f5] p-4">
              <Text
                className="text-[12px] uppercase tracking-[1.6px] text-[#d80f16]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {t.configurator.title}
              </Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Text
                  className="text-[14px] text-[#5f5954]"
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  {t.configurator.quantity}
                </Text>
                <View className="flex-row items-center gap-3 rounded-full bg-white px-2 py-2">
                  <Pressable
                    className="h-9 w-9 items-center justify-center rounded-full bg-[#f3efed]"
                    hitSlop={12}
                    onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                  >
                    <Text
                      className="text-[18px] text-[#231f20]"
                      style={{ fontFamily: "Inter_800ExtraBold" }}
                    >
                      -
                    </Text>
                  </Pressable>
                  <Text
                    className="min-w-[24px] text-center text-[16px] text-[#231f20]"
                    style={{ fontFamily: "Inter_800ExtraBold" }}
                  >
                    {quantity}
                  </Text>
                  <Pressable
                    className="h-9 w-9 items-center justify-center rounded-full bg-[#f3efed]"
                    hitSlop={12}
                    onPress={() => setQuantity((current) => current + 1)}
                  >
                    <Text
                      className="text-[18px] text-[#231f20]"
                      style={{ fontFamily: "Inter_800ExtraBold" }}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View className="mt-4 gap-4">
                {optionGroups.map((group) => (
                  <View key={group.label} className="gap-2">
                    <Text
                      className="text-[13px] text-[#5f5954]"
                      style={{ fontFamily: "Inter_700Bold" }}
                    >
                      {group.label}
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {group.options.map((option) => {
                        const active = isSelected(group.label, option);

                        return (
                          <Pressable
                            key={option}
                            className={`rounded-full px-4 py-2 ${
                              active ? "bg-[#d80f16]" : "bg-white"
                            }`}
                            hitSlop={10}
                            onPress={() => selectOption(group.label, option)}
                          >
                            <Text
                              className={`text-[13px] ${
                                active ? "text-white" : "text-[#231f20]"
                              }`}
                              style={{ fontFamily: "Inter_700Bold" }}
                            >
                              {option}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
              <TextInput
                className="mt-4 min-h-[92px] rounded-2xl bg-white px-4 py-4 text-[14px] text-[#231f20]"
                multiline
                onChangeText={setDraftNote}
                placeholder={t.configurator.kitchenNote}
                placeholderTextColor="#9f9691"
                textAlignVertical="top"
                value={draftNote}
              />
            </View>

            <View className="gap-4">
              <Text
                className="text-[28px] text-[#231f20]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {formatJPY(item.price * quantity)}
              </Text>
              <Pressable
                className="items-center rounded-[22px] bg-[#2fa34f] px-6 py-5"
                hitSlop={12}
                onPress={async () => {
                  await addConfiguredItem({
                    note: draftNote,
                    product: item,
                    quantity,
                    selectedOptions,
                  });
                  onAdded?.();
                  onClose();
                }}
              >
                <Text
                  className="text-[17px] text-white"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  {t.configurator.addToOrder}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

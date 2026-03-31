import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatJPY } from "../lib/currency";
import { getTranslations } from "../i18n/translations";
import { useResponsive } from "../hooks/useResponsive";
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
  const { isTablet } = useResponsive();
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

  const optionValues = {
    fullIce: t.configurator.valueFullIce,
    fullRice: t.configurator.valueFullRice,
    halfRice: t.configurator.valueHalfRice,
    hot: t.configurator.valueHot,
    large: t.configurator.valueLarge,
    lightIce: t.configurator.valueLightIce,
    medium: t.configurator.valueMedium,
    mild: t.configurator.valueMild,
    noIce: t.configurator.valueNoIce,
    noRice: t.configurator.valueNoRice,
    regular: t.configurator.valueRegular,
  };

  const optionGroups =
    item.macroCategory === "drinks"
      ? [
          {
            label: t.configurator.optionSize,
            options: [
              { id: "regular", label: optionValues.regular },
              { id: "large", label: optionValues.large },
            ],
          },
          {
            label: t.configurator.optionIce,
            options: [
              { id: "no-ice", label: optionValues.noIce },
              { id: "light-ice", label: optionValues.lightIce },
              { id: "full-ice", label: optionValues.fullIce },
            ],
          },
        ]
      : [
          {
            label: t.configurator.optionRice,
            options: [
              { id: "no-rice", label: optionValues.noRice },
              { id: "half-rice", label: optionValues.halfRice },
              { id: "full-rice", label: optionValues.fullRice },
            ],
          },
          {
            label: t.configurator.optionSpice,
            options: [
              { id: "mild", label: optionValues.mild },
              { id: "medium", label: optionValues.medium },
              { id: "hot", label: optionValues.hot },
            ],
          },
        ];

  function buildOptionValue(groupLabel: string, optionLabel: string) {
    return `${groupLabel}: ${optionLabel}`;
  }

  function selectOption(groupLabel: string, optionLabel: string) {
    setSelectedOptions((current) => {
      const next = current.filter((entry) => !entry.startsWith(`${groupLabel}:`));
      next.push(buildOptionValue(groupLabel, optionLabel));
      return next;
    });
  }

  function isSelected(groupLabel: string, optionLabel: string) {
    return selectedOptions.includes(buildOptionValue(groupLabel, optionLabel));
  }

  const summaryEntries = [
    ...selectedOptions,
    draftNote.trim().length > 0 ? `${t.configurator.kitchenNote}: ${draftNote.trim()}` : null,
  ].filter((entry): entry is string => Boolean(entry));

  const ctaSummary = t.configurator.ctaSummary
    .replace("{quantity}", String(quantity))
    .replace("{total}", formatJPY(item.price * quantity));

  return (
    <Modal animationType="slide" onRequestClose={onClose} visible={visible}>
      <SafeAreaView className="flex-1 bg-[#fff8f7]">
        <View className="flex-1 bg-[#fff8f7]">
          <View className="border-b border-[#efe7e3] px-5 py-4">
            <View>
              <Text
                className="text-[12px] uppercase tracking-[1.6px] text-[#d80f16]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {t.configurator.title}
              </Text>
              <Text
                className="mt-1 text-[22px] text-[#231f20]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {item.title}
              </Text>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-5 px-5 py-5"
            showsVerticalScrollIndicator={false}
          >
            <View className={isTablet ? "flex-row items-start gap-6" : "gap-5"}>
              <View className={isTablet ? "flex-1 gap-4" : "gap-5"}>
                <RemoteImageCard
                  fallbackUri={fallbackImage}
                  heightClassName={isTablet ? "h-[520px]" : "h-72"}
                  uri={item.image}
                />
                <View className="gap-2">
                  <Text
                    className="text-[16px] leading-7 text-[#5f5954]"
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    {item.description}
                  </Text>
                  <Text
                    className="text-[14px] text-[#8c857f]"
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    {item.category} · {item.prepTime}
                  </Text>
                </View>
              </View>

              <View className={isTablet ? "min-w-0 flex-1" : ""}>
                <View className="rounded-[24px] bg-white p-5">
                  <Text
                    className="text-[32px] text-[#231f20]"
                    style={{ fontFamily: "Inter_800ExtraBold" }}
                  >
                    {formatJPY(item.price * quantity)}
                  </Text>
                  <Text
                    className="mt-1 text-[13px] text-[#8c857f]"
                    style={{ fontFamily: "Inter_700Bold" }}
                  >
                    {formatJPY(item.price)} {t.configurator.priceEach}
                  </Text>

                  <View className="mt-5 flex-row items-center justify-between">
                    <Text
                      className="text-[15px] text-[#5f5954]"
                      style={{ fontFamily: "Inter_700Bold" }}
                    >
                      {t.configurator.quantity}
                    </Text>
                    <View className="flex-row items-center gap-3 rounded-full bg-[#faf7f5] px-2 py-2">
                      <Pressable
                        className="h-10 w-10 items-center justify-center rounded-full bg-white"
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
                        className="min-w-[28px] text-center text-[18px] text-[#231f20]"
                        style={{ fontFamily: "Inter_800ExtraBold" }}
                      >
                        {quantity}
                      </Text>
                      <Pressable
                        className="h-10 w-10 items-center justify-center rounded-full bg-white"
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

                  <View className="mt-5 gap-4">
                    {optionGroups.map((group) => (
                      <View key={group.label} className="gap-2">
                        <Text
                          className="text-[14px] text-[#5f5954]"
                          style={{ fontFamily: "Inter_700Bold" }}
                        >
                          {group.label}
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          {group.options.map((option) => {
                            const active = isSelected(group.label, option.label);

                            return (
                              <Pressable
                                key={option.id}
                                className={`flex-row items-center gap-2 rounded-full border px-4 py-3 ${
                                  active
                                    ? "border-[#d80f16] bg-[#d80f16]"
                                    : "border-[#ece3de] bg-[#faf7f5]"
                                }`}
                                hitSlop={10}
                                onPress={() => selectOption(group.label, option.label)}
                              >
                                {active ? (
                                  <Text
                                    className="text-[12px] text-white"
                                    style={{ fontFamily: "Inter_800ExtraBold" }}
                                  >
                                    ✓
                                  </Text>
                                ) : null}
                                <Text
                                  className={`text-[13px] ${
                                    active ? "text-white" : "text-[#231f20]"
                                  }`}
                                  style={{ fontFamily: "Inter_700Bold" }}
                                >
                                  {option.label}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                  </View>

                  <TextInput
                    className="mt-5 min-h-[120px] rounded-2xl bg-[#faf7f5] px-4 py-4 text-[15px] text-[#231f20]"
                    multiline
                    onChangeText={setDraftNote}
                    placeholder={`${t.configurator.kitchenNote} (${t.configurator.noteOptional})`}
                    placeholderTextColor="#9f9691"
                    textAlignVertical="top"
                    value={draftNote}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="border-t border-[#efe7e3] bg-white px-5 py-4">
            <View className="mb-4 gap-2">
              <Text
                className="text-[12px] uppercase tracking-[1.4px] text-[#8c857f]"
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                {t.configurator.selectionSummary}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {summaryEntries.length > 0 ? (
                  summaryEntries.map((entry) => (
                    <View key={entry} className="rounded-full bg-[#faf7f5] px-3 py-2">
                      <Text
                        className="text-[12px] text-[#3d3936]"
                        style={{ fontFamily: "Inter_700Bold" }}
                      >
                        {entry}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View className="rounded-full bg-[#faf7f5] px-3 py-2">
                    <Text
                      className="text-[12px] text-[#8c857f]"
                      style={{ fontFamily: "Inter_700Bold" }}
                    >
                      {item.category}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View className="flex-row justify-end gap-3">
              <Pressable
                className="min-w-[220px] items-center justify-center rounded-[22px] bg-[#d80f16] px-6 py-5"
                hitSlop={12}
                onPress={onClose}
              >
                <Text
                  className="text-[17px] text-white"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  {t.adminUnlock.cancel}
                </Text>
              </Pressable>
              <Pressable
                className="min-w-[240px] items-center rounded-[22px] bg-[#2fa34f] px-6 py-5"
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
                <Text
                  className="mt-1 text-[12px] text-white/90"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  {ctaSummary}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

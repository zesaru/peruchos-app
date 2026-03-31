import { Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatJPY } from "../lib/currency";
import { getTranslations } from "../i18n/translations";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import { useDeviceStore } from "../store/useDeviceStore";
import type { OrderType } from "../types";

export function CheckoutScreen() {
  const navigation = useNavigation();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const assignedTable = useDeviceStore((state) => state.assignedTable);
  const setupCompleted = useDeviceStore((state) => state.setupCompleted);
  const summary = useCartStore((state) => state.summary);
  const items = useCartStore((state) => state.items);
  const checkoutDraft = useCartStore((state) => state.checkoutDraft);
  const updateCheckoutDraft = useCartStore((state) => state.updateCheckoutDraft);
  const submitOrder = useCartStore((state) => state.submitOrder);

  function setOrderType(orderType: OrderType) {
    updateCheckoutDraft({ orderType });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f6dedd] px-4 py-4">
      <View className="flex-1 gap-5 rounded-[30px] bg-white p-5">
        <View className="gap-2">
          <Text className="text-[13px] uppercase tracking-[1.5px] text-[#d80f16]" style={{ fontFamily: "Inter_800ExtraBold" }}>
            {t.checkout.title}
          </Text>
          <Text className="text-[28px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
            {t.checkout.subtitle}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-[22px] bg-[#faf7f5] p-4">
            <Text className="text-[24px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {summary.itemCount}
            </Text>
            <Text className="text-[12px] uppercase text-[#8c857f]" style={{ fontFamily: "Inter_700Bold" }}>
              {t.checkout.items}
            </Text>
          </View>
          <View className="flex-1 rounded-[22px] bg-[#faf7f5] p-4">
            <Text className="text-[24px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {formatJPY(summary.subtotal)}
            </Text>
            <Text className="text-[12px] uppercase text-[#8c857f]" style={{ fontFamily: "Inter_700Bold" }}>
              {t.checkout.subtotal}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <TextInput
            className="rounded-2xl border border-[#ece7e4] bg-[#faf9f8] px-4 py-4 text-[15px] text-[#1f1f1f]"
            onChangeText={(customerName) => updateCheckoutDraft({ customerName })}
            placeholder={t.checkout.customerNamePlaceholder}
            placeholderTextColor="#9c948e"
            value={checkoutDraft.customerName}
          />
          {setupCompleted && assignedTable ? (
            <View className="rounded-2xl border border-[#ece7e4] bg-[#faf9f8] px-4 py-4">
              <Text className="text-[11px] uppercase tracking-[1px] text-[#8c857f]" style={{ fontFamily: "Inter_700Bold" }}>
                {t.checkout.assignedTableLabel}
              </Text>
              <Text className="mt-1 text-[18px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                {t.menu.table} {assignedTable.tableNumber}
              </Text>
            </View>
          ) : (
            <TextInput
              className="rounded-2xl border border-[#ece7e4] bg-[#faf9f8] px-4 py-4 text-[15px] text-[#1f1f1f]"
              onChangeText={(tableNumber) => updateCheckoutDraft({ tableNumber })}
              placeholder={t.checkout.tablePlaceholder}
              placeholderTextColor="#9c948e"
              value={checkoutDraft.tableNumber}
            />
          )}
          <View className="flex-row gap-3">
            {(["Dine In", "Pickup"] as OrderType[]).map((type) => {
              const active = checkoutDraft.orderType === type;
              return (
                <Pressable
                  key={type}
                  className={`flex-1 rounded-2xl px-4 py-3 ${
                    active ? "bg-[#d80f16]" : "bg-[#f1efee]"
                  }`}
                  onPress={() => setOrderType(type)}
                >
                  <Text
                    className={`text-center text-[14px] ${
                      active ? "text-white" : "text-[#3a3734]"
                    }`}
                    style={{ fontFamily: "Inter_800ExtraBold" }}
                  >
                    {t.orderType[type]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-1 gap-2">
          {items.map((item) => (
            <View key={item.lineId} className="flex-row items-center justify-between rounded-2xl bg-[#faf7f5] px-4 py-3">
              <View className="flex-1 gap-1">
                <Text className="text-[15px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {item.quantity}x {item.title}
                </Text>
                {item.note ? (
                  <Text className="text-[12px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                    {t.checkout.note} {item.note}
                  </Text>
                ) : null}
                {(Array.isArray(item.selectedOptions) ? item.selectedOptions : []).length > 0 ? (
                  <Text className="text-[12px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                    {(Array.isArray(item.selectedOptions) ? item.selectedOptions : []).join(" · ")}
                  </Text>
                ) : null}
              </View>
              <Text className="text-[15px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                {formatJPY(item.quantity * item.price)}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 items-center rounded-2xl bg-[#ece7e4] py-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-[15px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {t.checkout.back}
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 items-center rounded-2xl bg-[#d80f16] py-4"
            onPress={async () => {
              const order = await submitOrder();
              if (order) {
                navigation.navigate("History" as never);
              }
            }}
          >
            <Text className="text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {t.checkout.sendOrder}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

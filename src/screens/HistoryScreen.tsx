import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatJPY } from "../lib/currency";
import { getTranslations } from "../i18n/translations";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import type { OrderStatus } from "../types";

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getStatusBadgeClasses(status: OrderStatus) {
  switch (status) {
    case "preparing":
      return {
        container: "bg-[#fff4df] border border-[#ffd38a]",
        text: "text-[#9a6200]",
      };
    case "ready":
      return {
        container: "bg-[#e9f9ef] border border-[#94d8a8]",
        text: "text-[#1d7a39]",
      };
    case "delivered":
      return {
        container: "bg-[#eef4ff] border border-[#b7cdfa]",
        text: "text-[#2c59aa]",
      };
    case "pending":
    default:
      return {
        container: "bg-[#ffe8e8] border border-[#f4b6b8]",
        text: "text-[#b4232a]",
      };
  }
}

export function HistoryScreen() {
  const navigation = useNavigation();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const orders = useCartStore((state) => state.orders);
  const refreshOrders = useCartStore((state) => state.refreshOrders);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  return (
    <SafeAreaView className="flex-1 bg-[#f6dedd] px-4 py-4">
      <ScrollView contentContainerClassName="gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[28px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
            {t.history.screenTitle}
          </Text>
          <Pressable className="rounded-2xl bg-[#d80f16] px-4 py-3" onPress={() => void refreshOrders()}>
            <Text className="text-[13px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {t.history.refresh}
            </Text>
          </Pressable>
        </View>

        {orders.length === 0 ? (
          <View className="rounded-[28px] bg-white p-6">
            <Text className="text-[20px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {t.history.emptyTitle}
            </Text>
            <Text className="mt-2 text-[14px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
              {t.history.emptyDescription}
            </Text>
            <Pressable className="mt-4 rounded-2xl bg-[#d80f16] py-4" onPress={() => navigation.goBack()}>
              <Text className="text-center text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                {t.history.backToMenu}
              </Text>
            </Pressable>
          </View>
        ) : (
          orders.map((order) => {
            const badge = getStatusBadgeClasses(order.status);

            return (
              <View key={order.id} className="gap-3 rounded-[26px] bg-white p-5">
                <View className="flex-row items-start justify-between gap-3">
                  <View>
                    <Text className="text-[18px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                      {order.draft.customerName || t.history.walkInCustomer}
                    </Text>
                    <Text className="mt-1 text-[12px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                      {t.orderType[order.draft.orderType]} • {order.draft.tableNumber || t.history.noTable} •{" "}
                      {formatTime(order.createdAt)}
                    </Text>
                  </View>
                  <View className={`rounded-full px-3 py-1 ${badge.container}`}>
                    <Text
                      className={`text-[11px] ${badge.text}`}
                      style={{ fontFamily: "Inter_800ExtraBold" }}
                    >
                      {t.orderStatus[order.status]}
                    </Text>
                  </View>
                </View>

                <Text className="text-[14px] text-[#d80f16]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {order.summary.itemCount} {t.history.items} • {formatJPY(order.summary.subtotal)}
                </Text>

                <View className="gap-2">
                  {order.items.map((item) => (
                    <View
                      key={`${order.id}-${item.lineId ?? item.id}`}
                      className="flex-row items-center justify-between rounded-2xl bg-[#faf7f5] px-4 py-3"
                    >
                      <View className="flex-1">
                        <Text className="text-[14px] text-[#1f1f1f]" style={{ fontFamily: "Inter_700Bold" }}>
                          {item.quantity}x {item.title}
                        </Text>
                        {(Array.isArray(item.selectedOptions) ? item.selectedOptions : []).length > 0 ? (
                          <Text className="mt-1 text-[12px] text-[#8c857f]" style={{ fontFamily: "Inter_500Medium" }}>
                            {(Array.isArray(item.selectedOptions) ? item.selectedOptions : []).join(" · ")}
                          </Text>
                        ) : null}
                      </View>
                      <Text className="text-[14px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                        {formatJPY(item.quantity * item.price)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

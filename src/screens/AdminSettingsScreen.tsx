import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../App";
import { getTranslations } from "../i18n/translations";
import { useResponsive } from "../hooks/useResponsive";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useCartStore } from "../store/useCartStore";
import { useDeviceStore } from "../store/useDeviceStore";

export function AdminSettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isTablet } = useResponsive();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const assignedTable = useDeviceStore((state) => state.assignedTable);
  const clearSetup = useDeviceStore((state) => state.clearSetup);
  const updateAdminPin = useDeviceStore((state) => state.updateAdminPin);
  const clearCart = useCartStore((state) => state.clearCart);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  function handleSavePin() {
    const trimmedPin = newPin.trim();
    if (!/^\d{4,6}$/u.test(trimmedPin)) {
      Alert.alert(t.adminSettings.errorTitle, t.adminSettings.invalidPinFormat);
      return;
    }

    if (trimmedPin !== confirmPin.trim()) {
      Alert.alert(t.adminSettings.errorTitle, t.adminSettings.pinMismatch);
      return;
    }

    updateAdminPin(trimmedPin);
    setNewPin("");
    setConfirmPin("");
    Alert.alert(t.adminSettings.successTitle, t.adminSettings.pinUpdated);
  }

  function handleReassignTable() {
    clearCart();
    clearSetup();
    navigation.reset({
      index: 0,
      routes: [{ name: "TableSetup" }],
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f7] px-6 py-8">
      <View className="flex-1 items-center justify-center">
        <View className={`w-full rounded-[34px] bg-white ${isTablet ? "max-w-[980px] px-8 py-8" : "max-w-[620px] px-6 py-8"}`}>
          <View className="gap-2">
            <Text
              className="text-[13px] uppercase tracking-[2px] text-[#d80f16]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.adminSettings.kicker}
            </Text>
            <Text
              className="text-[28px] text-[#231f20]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.adminSettings.title}
            </Text>
            <Text
              className="text-[14px] text-[#8c857f]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {assignedTable
                ? t.adminSettings.tableAssigned.replace("{table}", assignedTable.tableNumber)
                : t.adminSettings.noTableAssigned}
            </Text>
          </View>

          <View className={`mt-8 gap-6 ${isTablet ? "flex-row items-start" : ""}`}>
            <View className={`${isTablet ? "flex-1" : ""} gap-3 rounded-[24px] bg-[#faf7f5] p-4`}>
              <Text
                className="text-[12px] uppercase tracking-[1.5px] text-[#8c857f]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {t.adminSettings.pinSection}
              </Text>
              <TextInput
                className="rounded-2xl border border-[#ece7e4] bg-white px-4 py-4 text-[17px] text-[#1f1f1f]"
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setNewPin}
                placeholder={t.adminSettings.newPinPlaceholder}
                placeholderTextColor="#9c948e"
                secureTextEntry
                value={newPin}
              />
              <TextInput
                className="rounded-2xl border border-[#ece7e4] bg-white px-4 py-4 text-[17px] text-[#1f1f1f]"
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setConfirmPin}
                placeholder={t.adminSettings.confirmPinPlaceholder}
                placeholderTextColor="#9c948e"
                secureTextEntry
                value={confirmPin}
              />
              <Pressable
                className="items-center rounded-2xl bg-[#231f20] py-4"
                onPress={handleSavePin}
              >
                <Text className="text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.adminSettings.savePin}
                </Text>
              </Pressable>
            </View>

            <View className={`${isTablet ? "mt-0 flex-1" : ""} gap-3 rounded-[24px] border border-[#f0e5e1] bg-[#fffafa] p-4`}>
              <Text
                className="text-[12px] uppercase tracking-[1.5px] text-[#8c857f]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {t.adminSettings.tableSection}
              </Text>
              <Pressable
                className="items-center rounded-2xl bg-[#231f20] py-4"
                onPress={() => {
                  clearCart();
                  clearSetup();
                  navigation.navigate("TableScanner");
                }}
              >
                <Text className="text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.adminSettings.scanQr}
                </Text>
              </Pressable>
              <Pressable
                className="items-center rounded-2xl bg-[#d80f16] py-4"
                onPress={handleReassignTable}
              >
                <Text className="text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.adminSettings.reassignTable}
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            className="mt-6 items-center rounded-2xl bg-[#ece7e4] py-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-[15px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {t.adminSettings.close}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

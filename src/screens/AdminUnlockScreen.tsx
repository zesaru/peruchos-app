import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../App";
import { getTranslations } from "../i18n/translations";
import { useResponsive } from "../hooks/useResponsive";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useDeviceStore } from "../store/useDeviceStore";

export function AdminUnlockScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isTablet } = useResponsive();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const assignedTable = useDeviceStore((state) => state.assignedTable);
  const verifyAdminPin = useDeviceStore((state) => state.verifyAdminPin);
  const [pin, setPin] = useState("");

  function handleUnlock() {
    if (!verifyAdminPin(pin)) {
      Alert.alert(t.adminUnlock.errorTitle, t.adminUnlock.invalidPin);
      return;
    }

    navigation.replace("AdminSettings");
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f7] px-6 py-8">
      <View className="flex-1 items-center justify-center">
        <View className={`w-full rounded-[34px] bg-white ${isTablet ? "max-w-[920px] px-8 py-8" : "max-w-[560px] px-6 py-8"}`}>
          <View className={isTablet ? "flex-row items-center gap-8" : "gap-8"}>
            <View className={`${isTablet ? "flex-1" : ""} items-center gap-2`}>
            <Text
              className="text-[13px] uppercase tracking-[2px] text-[#d80f16]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.adminUnlock.kicker}
            </Text>
            <Text
              className="text-center text-[28px] text-[#231f20]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.adminUnlock.title}
            </Text>
            <Text
              className="text-center text-[14px] text-[#8c857f]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {assignedTable
                ? t.adminUnlock.description.replace("{table}", assignedTable.tableNumber)
                : t.adminUnlock.descriptionNoTable}
            </Text>
            </View>

            <View className={`${isTablet ? "flex-1" : ""} gap-3`}>
              <Text
                className="text-[12px] uppercase tracking-[1.5px] text-[#8c857f]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {t.adminUnlock.pinLabel}
              </Text>
              <TextInput
                className="rounded-2xl border border-[#ece7e4] bg-[#faf9f8] px-4 py-4 text-center text-[24px] tracking-[8px] text-[#1f1f1f]"
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setPin}
                placeholder={t.adminUnlock.pinPlaceholder}
                placeholderTextColor="#9c948e"
                secureTextEntry
                value={pin}
              />

              <View className="mt-5 flex-row gap-3">
                <Pressable
                  className="flex-1 items-center rounded-2xl bg-[#ece7e4] py-4"
                  onPress={() => navigation.goBack()}
                >
                  <Text className="text-[15px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {t.adminUnlock.cancel}
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 items-center rounded-2xl bg-[#231f20] py-4"
                  onPress={handleUnlock}
                >
                  <Text className="text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {t.adminUnlock.continue}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

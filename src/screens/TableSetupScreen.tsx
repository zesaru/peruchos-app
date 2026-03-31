import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../App";
import { getTranslations } from "../i18n/translations";
import { useResponsive } from "../hooks/useResponsive";
import { resolveTableByNumber } from "../services/api";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useDeviceStore } from "../store/useDeviceStore";

export function TableSetupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isTablet } = useResponsive();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const completeSetup = useDeviceStore((state) => state.completeSetup);
  const [tableNumber, setTableNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleContinue() {
    const trimmedTableNumber = tableNumber.trim();
    if (!trimmedTableNumber) {
      Alert.alert(t.setup.errorTitle, t.setup.emptyTableError);
      return;
    }

    setSubmitting(true);

    try {
      const table = await resolveTableByNumber(trimmedTableNumber);
      if (!table) {
        Alert.alert(t.setup.errorTitle, t.setup.notFoundError);
        return;
      }

      completeSetup({
        id: table.id,
        tableNumber: table.tableNumber,
      });
      navigation.replace("Menu");
    } catch {
      Alert.alert(t.setup.errorTitle, t.setup.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f7] px-6 py-8">
      <View className="flex-1 items-center justify-center">
        <View className={`w-full rounded-[34px] bg-white ${isTablet ? "max-w-[980px] px-8 py-8" : "max-w-[620px] px-6 py-8"}`}>
          <View className={isTablet ? "flex-row items-stretch gap-8" : "gap-8"}>
            <View className={`${isTablet ? "flex-1 justify-center" : ""} items-center gap-2`}>
            <Text
              className="text-[13px] uppercase tracking-[2px] text-[#d80f16]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.setup.kicker}
            </Text>
            <Text
              className="text-center text-[28px] text-[#231f20]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.setup.title}
            </Text>
            <Text
              className="text-center text-[14px] text-[#8c857f]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {t.setup.description}
            </Text>
            </View>

            <View className={`${isTablet ? "flex-1 justify-center" : ""} gap-3`}>
              <Text
                className="text-[12px] uppercase tracking-[1.5px] text-[#8c857f]"
                style={{ fontFamily: "Inter_700Bold" }}
              >
                {t.setup.inputLabel}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                className="rounded-2xl border border-[#ece7e4] bg-[#faf9f8] px-4 py-4 text-[17px] text-[#1f1f1f]"
                onChangeText={setTableNumber}
                placeholder={t.setup.inputPlaceholder}
                placeholderTextColor="#9c948e"
                value={tableNumber}
              />
              <Text
                className="text-[12px] text-[#8c857f]"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                {t.setup.inputHint}
              </Text>

              <Pressable
                className={`mt-5 items-center rounded-2xl py-4 ${
                  submitting ? "bg-[#ef9ba0]" : "bg-[#d80f16]"
                }`}
                disabled={submitting}
                onPress={() => void handleContinue()}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-[16px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                    {t.setup.continue}
                  </Text>
                )}
              </Pressable>

              <Pressable
                className="items-center rounded-2xl bg-[#231f20] py-4"
                onPress={() => navigation.navigate("TableScanner")}
              >
                <Text className="text-[16px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.setup.scanQr}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

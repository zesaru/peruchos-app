import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../App";
import { getTranslations } from "../i18n/translations";
import { resolveTableByNumber } from "../services/api";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useDeviceStore } from "../store/useDeviceStore";

export function TableScannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const completeSetup = useDeviceStore((state) => state.completeSetup);
  const [permission, requestPermission] = useCameraPermissions();
  const [submitting, setSubmitting] = useState(false);
  const [scannedValue, setScannedValue] = useState<string | null>(null);

  async function handleBarcodeScanned(rawValue: string) {
    if (submitting || scannedValue === rawValue) {
      return;
    }

    setSubmitting(true);
    setScannedValue(rawValue);

    try {
      const table = await resolveTableByNumber(rawValue);
      if (!table) {
        Alert.alert(t.scanner.errorTitle, t.scanner.notFoundError);
        setScannedValue(null);
        return;
      }

      completeSetup({
        id: table.id,
        tableNumber: table.tableNumber,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "Menu" }],
      });
    } catch {
      Alert.alert(t.scanner.errorTitle, t.scanner.networkError);
      setScannedValue(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#081720] px-6 py-8">
        <ActivityIndicator color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#fff8f7] px-6 py-8">
        <View className="flex-1 items-center justify-center">
          <View className="w-full max-w-[560px] rounded-[30px] bg-white px-6 py-8">
            <Text
              className="text-[13px] uppercase tracking-[2px] text-[#d80f16]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.scanner.kicker}
            </Text>
            <Text
              className="mt-2 text-[28px] text-[#231f20]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.scanner.permissionTitle}
            </Text>
            <Text
              className="mt-2 text-[14px] text-[#8c857f]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {t.scanner.permissionDescription}
            </Text>

            <View className="mt-8 gap-3">
              <Pressable
                className="items-center rounded-2xl bg-[#d80f16] py-4"
                onPress={() => void requestPermission()}
              >
                <Text className="text-[15px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.scanner.grantAccess}
                </Text>
              </Pressable>
              <Pressable
                className="items-center rounded-2xl bg-[#ece7e4] py-4"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-[15px] text-[#1f1f1f]" style={{ fontFamily: "Inter_800ExtraBold" }}>
                  {t.scanner.cancel}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#081720]">
      <View className="flex-1 bg-[#081720] px-5 py-5">
        <View className="flex-row items-start justify-between">
          <View className="max-w-[70%]">
            <Text
              className="text-[13px] uppercase tracking-[2px] text-[#ff8b90]"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.scanner.kicker}
            </Text>
            <Text
              className="mt-2 text-[28px] text-white"
              style={{ fontFamily: "Inter_800ExtraBold" }}
            >
              {t.scanner.title}
            </Text>
            <Text
              className="mt-2 text-[14px] text-[#d8d2cc]"
              style={{ fontFamily: "Inter_500Medium" }}
            >
              {t.scanner.description}
            </Text>
          </View>
          <Pressable
            className="rounded-2xl bg-white/10 px-4 py-3"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-[14px] text-white" style={{ fontFamily: "Inter_800ExtraBold" }}>
              {t.scanner.cancel}
            </Text>
          </Pressable>
        </View>

        <View className="mt-6 flex-1 overflow-hidden rounded-[34px] border border-white/10 bg-black">
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            className="flex-1"
            facing="back"
            onBarcodeScanned={
              scannedValue ? undefined : ({ data }) => void handleBarcodeScanned(data)
            }
          />

          <View className="absolute inset-0 items-center justify-center">
            <View className="h-[260px] w-[260px] rounded-[32px] border-4 border-[#ffffff]" />
          </View>

          <View className="absolute bottom-0 left-0 right-0 bg-black/45 px-6 py-5">
            <Text
              className="text-center text-[14px] text-white"
              style={{ fontFamily: "Inter_700Bold" }}
            >
              {submitting ? t.scanner.processing : t.scanner.footer}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

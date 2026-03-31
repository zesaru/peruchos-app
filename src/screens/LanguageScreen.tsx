import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../App";
import { PeruchosLogo } from "../components/PeruchosLogo";
import { useAppSettingsStore } from "../store/useAppSettingsStore";
import { useDeviceStore } from "../store/useDeviceStore";
import type { AppLanguage } from "../types";

const languages = [
  { code: "es", label: "Español", note: "Continuar en español" },
  { code: "en", label: "English", note: "Continue in English" },
  { code: "ja", label: "日本語", note: "日本語で続行" },
];

export function LanguageScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setLanguage = useAppSettingsStore((state) => state.setLanguage);
  const setupCompleted = useDeviceStore((state) => state.setupCompleted);

  return (
    <SafeAreaView className="flex-1 bg-[#fff8f7] px-6 py-8">
      <View className="flex-1 items-center justify-center">
        <PeruchosLogo size="hero" />

        <View className="mt-12 items-center">
          <Text
            className="text-[13px] uppercase tracking-[2.2px] text-[#a39a95]"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            Powered by
          </Text>
          <Text
            className="mt-1 text-[24px] text-[#231f20]"
            style={{ fontFamily: "Inter_800ExtraBold" }}
          >
            Plebeyus
          </Text>
        </View>

        <View className="mt-14 w-full max-w-[720px] gap-4">
          <Text
            className="text-center text-[13px] uppercase tracking-[2px] text-[#d80f16]"
            style={{ fontFamily: "Inter_800ExtraBold" }}
          >
            Select language
          </Text>
          <View className="flex-row items-stretch justify-center gap-3">
            {languages.map((language) => (
              <Pressable
                key={language.code}
                className="min-h-[120px] flex-1 items-center justify-center rounded-[24px] border border-[#efe7e3] bg-white px-5 py-5"
                hitSlop={12}
                onPress={() => {
                  setLanguage(language.code as AppLanguage);
                  navigation.replace(setupCompleted ? "Menu" : "TableSetup");
                }}
              >
                <View className="items-center justify-center">
                  <Text
                    className="text-center text-[20px] text-[#231f20]"
                    style={{ fontFamily: "Inter_800ExtraBold" }}
                  >
                    {language.label}
                  </Text>
                  <Text
                    className="mt-2 text-center text-[14px] text-[#8c857f]"
                    style={{ fontFamily: "Inter_500Medium" }}
                  >
                    {language.note}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

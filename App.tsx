import "./global.css";

import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from "@expo-google-fonts/playfair-display";

import { CheckoutScreen } from "./src/screens/CheckoutScreen";
import { AdminUnlockScreen } from "./src/screens/AdminUnlockScreen";
import { AdminSettingsScreen } from "./src/screens/AdminSettingsScreen";
import { PeruchosLogo } from "./src/components/PeruchosLogo";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { getTranslations } from "./src/i18n/translations";
import { LanguageScreen } from "./src/screens/LanguageScreen";
import { MenuScreen } from "./src/screens/MenuScreen";
import { TableScannerScreen } from "./src/screens/TableScannerScreen";
import { TableSetupScreen } from "./src/screens/TableSetupScreen";
import { useAppSettingsStore } from "./src/store/useAppSettingsStore";

export type RootStackParamList = {
  Language: undefined;
  TableSetup: undefined;
  TableScanner: undefined;
  AdminUnlock: undefined;
  AdminSettings: undefined;
  Menu: undefined;
  Checkout: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#081720",
    card: "#0e1f29",
    text: "#f6f1e8",
    border: "#173240",
    primary: "#e36d3b",
  },
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const introOpacity = useRef(new Animated.Value(1)).current;
  const language = useAppSettingsStore((state) => state.language);
  const t = getTranslations(language);
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    const timeout = setTimeout(() => {
      Animated.timing(introOpacity, {
        duration: 320,
        toValue: 0,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShowIntro(false);
        }
      });
    }, 1300);

    return () => {
      clearTimeout(timeout);
      introOpacity.stopAnimation();
    };
  }, [fontsLoaded, introOpacity]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer theme={theme}>
            <StatusBar style="dark" />
            <Stack.Navigator
              initialRouteName="Language"
              screenOptions={{
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#f6dedd" },
                headerStyle: { backgroundColor: "#fff8f7" },
                headerTintColor: "#231f20",
                headerTitleStyle: { fontWeight: "800" },
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen
                component={LanguageScreen}
                name="Language"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={TableSetupScreen}
                name="TableSetup"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={TableScannerScreen}
                name="TableScanner"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={AdminUnlockScreen}
                name="AdminUnlock"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={AdminSettingsScreen}
                name="AdminSettings"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={MenuScreen}
                name="Menu"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                component={CheckoutScreen}
                name="Checkout"
                options={{ title: t.navigation.checkout }}
              />
              <Stack.Screen
                component={HistoryScreen}
                name="History"
                options={{ title: t.navigation.orderHistory }}
              />
            </Stack.Navigator>
          </NavigationContainer>

          {showIntro ? (
            <Animated.View
              pointerEvents="none"
              style={{
                alignItems: "center",
                backgroundColor: "#fff8f7",
                bottom: 0,
                justifyContent: "center",
                left: 0,
                opacity: introOpacity,
                position: "absolute",
                right: 0,
                top: 0,
              }}
            >
              <PeruchosLogo size="hero" />
              <View className="mt-10 items-center">
                <Text
                  className="text-[12px] uppercase tracking-[2.4px] text-[#a39a95]"
                  style={{ fontFamily: "Inter_700Bold" }}
                >
                  Powered by
                </Text>
                <Text
                  className="mt-1 text-[22px] text-[#231f20]"
                  style={{ fontFamily: "Inter_800ExtraBold" }}
                >
                  Plebeyus
                </Text>
              </View>
            </Animated.View>
          ) : null}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

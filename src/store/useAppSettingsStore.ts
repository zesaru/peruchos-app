import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppLanguage } from "../types";

type AppSettingsStore = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set) => ({
      language: "es",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "app-settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);

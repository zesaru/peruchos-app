import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AssignedTable } from "../types";

const DEFAULT_ADMIN_PIN = "2580";

type DeviceStore = {
  setupCompleted: boolean;
  assignedTable: AssignedTable | null;
  adminPin: string;
  completeSetup: (table: AssignedTable) => void;
  clearSetup: () => void;
  verifyAdminPin: (pin: string) => boolean;
  updateAdminPin: (pin: string) => void;
};

export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => ({
      setupCompleted: false,
      assignedTable: null,
      adminPin: DEFAULT_ADMIN_PIN,
      completeSetup: (table) =>
        set({
          assignedTable: table,
          setupCompleted: true,
        }),
      clearSetup: () =>
        set({
          assignedTable: null,
          setupCompleted: false,
        }),
      verifyAdminPin: (pin) => pin.trim() === get().adminPin,
      updateAdminPin: (pin) =>
        set({
          adminPin: pin.trim(),
        }),
    }),
    {
      name: "device-setup-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        adminPin: state.adminPin,
        assignedTable: state.assignedTable,
        setupCompleted: state.setupCompleted,
      }),
    }
  )
);

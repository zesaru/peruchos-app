import type { ReactNode } from "react";
import { View } from "react-native";

type SplitViewContainerProps = {
  isTablet: boolean;
  panelRadius: number;
  shellGap: number;
  menuPanel: ReactNode;
  cartPanel: ReactNode;
};

export function SplitViewContainer({
  cartPanel,
  isTablet,
  panelRadius,
  shellGap,
  menuPanel,
}: SplitViewContainerProps) {
  return (
    <View
      className="flex-1 border border-[#ebdfda] bg-white shadow-sm shadow-black/10"
      style={{ borderRadius: panelRadius, padding: shellGap }}
    >
      <View className={isTablet ? "flex-1 flex-row" : "flex-1"}>
        <View className={isTablet ? "min-h-0 flex-[7]" : "min-h-0 flex-[3]"}>{menuPanel}</View>
        <View
          className={isTablet ? "min-h-0 flex-[3]" : "min-h-0 flex-[2]"}
          style={{ marginLeft: isTablet ? shellGap : 0, marginTop: isTablet ? 0 : shellGap }}
        >
          {cartPanel}
        </View>
      </View>
    </View>
  );
}

import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { height, width } = useWindowDimensions();
  const isTablet = width >= 900;
  const isLargeTablet = width >= 1280;
  const menuColumns = isTablet ? (isLargeTablet ? 4 : 3) : 2;
  const fontBoost = Math.min(Math.max(width / 390, 0.92), 1.55);

  return {
    height,
    isLargeTablet,
    isTablet,
    isPhone: !isTablet,
    menuColumns,
    shell: {
      outerPadding: isTablet ? 20 : 14,
      contentGap: isTablet ? 18 : 14,
      panelRadius: isTablet ? 32 : 24,
    },
    typeRamp: {
      hero: Math.round(34 * fontBoost),
      section: Math.round(28 * fontBoost),
      cardTitle: Math.round(18 * fontBoost),
      body: Math.round(15 * fontBoost),
      caption: Math.round(12 * fontBoost),
    },
  };
}

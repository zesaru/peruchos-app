import { Text, View } from "react-native";

type PeruchosLogoProps = {
  size?: "hero" | "compact";
  showTagline?: boolean;
  orientation?: "stacked" | "horizontal";
};

export function PeruchosLogo({
  size = "hero",
  showTagline = true,
  orientation = "stacked",
}: PeruchosLogoProps) {
  const hero = size === "hero";
  const horizontal = orientation === "horizontal";
  const frameWidth = hero ? "w-[160px]" : "w-[108px]";
  const peRuSize = hero ? "text-[58px] leading-[60px]" : "text-[38px] leading-[40px]";
  const chosSize = hero ? "text-[36px] leading-[38px]" : "text-[24px] leading-[26px]";
  const borderWidth = hero ? "border-[6px]" : "border-[4px]";
  const dividerWidth = hero ? "border-b-[6px]" : "border-b-[4px]";
  const taglineText = hero ? "text-[16px]" : "text-[11px]";
  const underlineWidth = hero ? "w-40" : "w-28";
  const horizontalBrandSize = hero ? "text-[36px] leading-[38px]" : "text-[20px] leading-[22px]";
  const horizontalSubSize = hero ? "text-[11px]" : "text-[9px]";
  const horizontalUnderlineWidth = hero ? "w-36" : "w-24";

  if (horizontal) {
    return (
      <View className="flex-row items-center gap-3">
        <View className={`${borderWidth} border-[#e10613] bg-[#e10613] px-[2px] py-[2px]`}>
          <View className="overflow-hidden bg-[#e10613]">
            <View className="absolute inset-x-0 top-0 h-full justify-evenly">
              {Array.from({ length: hero ? 16 : 10 }).map((_, index) => (
                <View key={index} className="h-[1px] bg-white/20" />
              ))}
            </View>

            <View className={`${frameWidth} px-2 py-2`}>
              <View className={`items-center ${dividerWidth} border-white py-2`}>
                <Text className={`${peRuSize} text-white`} style={{ fontFamily: "Inter_800ExtraBold" }}>
                  PE
                </Text>
              </View>

              <View className={`items-center ${dividerWidth} border-white bg-white py-2`}>
                <Text className={`${peRuSize} text-[#e10613]`} style={{ fontFamily: "Inter_800ExtraBold" }}>
                  RU
                </Text>
              </View>

              <View className="items-center py-3">
                <Text className={`${chosSize} text-white`} style={{ fontFamily: "Inter_800ExtraBold" }}>
                  CHO'S
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="items-start justify-center">
          <Text className={`${horizontalBrandSize} text-[#231f20]`} style={{ fontFamily: "Inter_800ExtraBold" }}>
            Perucho's
          </Text>
          {showTagline ? (
            <>
              <Text
                className={`mt-1 uppercase tracking-[0.4px] text-[#e10613] ${horizontalSubSize}`}
                style={{ fontFamily: "Inter_800ExtraBold" }}
              >
                Taberna Criolla
              </Text>
              <View className={`mt-2 h-[2px] bg-[#e10613] ${horizontalUnderlineWidth}`} />
            </>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className={`${borderWidth} border-[#e10613] bg-[#e10613] px-[2px] py-[2px]`}>
        <View className="overflow-hidden bg-[#e10613]">
          <View className="absolute inset-x-0 top-0 h-full justify-evenly">
            {Array.from({ length: hero ? 16 : 10 }).map((_, index) => (
              <View key={index} className="h-[1px] bg-white/20" />
            ))}
          </View>

          <View className={`${frameWidth} px-2 py-2`}>
            <View className={`items-center ${dividerWidth} border-white py-2`}>
              <Text className={`${peRuSize} text-white`} style={{ fontFamily: "Inter_800ExtraBold" }}>
                PE
              </Text>
            </View>

            <View className={`items-center ${dividerWidth} border-white bg-white py-2`}>
              <Text className={`${peRuSize} text-[#e10613]`} style={{ fontFamily: "Inter_800ExtraBold" }}>
                RU
              </Text>
            </View>

            <View className="items-center py-3">
              <Text className={`${chosSize} text-white`} style={{ fontFamily: "Inter_800ExtraBold" }}>
                CHO'S
              </Text>
            </View>
          </View>
        </View>
      </View>

      {showTagline ? (
        <View className="mt-3 items-center">
          <Text
            className={`${taglineText} uppercase tracking-[-0.3px] text-[#e10613]`}
            style={{ fontFamily: "Inter_800ExtraBold" }}
          >
            Taberna Criolla
          </Text>
          <View className={`mt-2 h-[3px] bg-[#e10613] ${underlineWidth}`} />
        </View>
      ) : null}
    </View>
  );
}

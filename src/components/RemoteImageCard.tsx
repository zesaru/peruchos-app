import { useState } from "react";
import { Image, Text, View } from "react-native";

type RemoteImageCardProps = {
  fallbackUri?: string;
  heightClassName: string;
  uri?: string;
};

export function RemoteImageCard({
  fallbackUri,
  heightClassName,
  uri,
}: RemoteImageCardProps) {
  const [failed, setFailed] = useState(false);
  const resolvedUri = failed ? fallbackUri : uri || fallbackUri;

  if (!resolvedUri) {
    return (
      <View className={`w-full items-center justify-center bg-[#f2efed] ${heightClassName}`}>
        <Text
          className="text-[13px] uppercase tracking-[1.8px] text-[#a29a94]"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          No Image
        </Text>
      </View>
    );
  }

  return (
    <View className={`w-full overflow-hidden bg-[#f2efed] ${heightClassName}`}>
      <Image
        className="h-full w-full"
        onError={() => setFailed(true)}
        resizeMode="cover"
        source={{ uri: resolvedUri }}
      />
      {failed ? (
        <View className="absolute inset-0 items-center justify-center bg-[#f2efed]">
          <Text
            className="text-[13px] uppercase tracking-[1.8px] text-[#a29a94]"
            style={{ fontFamily: "Inter_700Bold" }}
          >
            No Image
          </Text>
        </View>
      ) : null}
    </View>
  );
}

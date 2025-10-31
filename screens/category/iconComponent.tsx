import { THEME } from "@/lib/theme";
import { IconDto, IconType } from "@/types/iconType";
import {
  Feather,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

const libs = {
  Feather,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
};

export const IconComponent = React.memo(function IconComponent(props: IconDto) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  const IconLib = libs[props.lib as keyof typeof libs];
  if (!IconLib) return null;

  return (
    <View className="w-10 h-10 items-center justify-center">
      <IconLib name={props.icon} size={22} color={theme.foreground} />
    </View>
  );
});

import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View, TouchableOpacity } from "react-native";
import { IconComponent } from "./iconComponent";
import { IconDto, IconLibName, IconType } from "@/types/iconType";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { formatToBR } from "@/utils/FormatDate";

type CategoryComponentProps = {
  icon: string;
  lib: IconLibName;
  title: string;
  date: string;
  value: number;
  onPress?: () => void;
};

export function CategoryComponent({
  icon,
  lib,
  title,
  date,
  value,
  onPress,
}: CategoryComponentProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="border border-border rounded-2xl p-3 flex-row items-center bg-background shadow-sm mb-3"
      style={{
        shadowColor: theme.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
      }}
    >

      <View className="w-14 h-14 rounded-xl items-center justify-center border border-border bg-muted/30">
        <IconComponent icon={icon} lib={lib} />
      </View>

      <View className="flex-1 ml-3">
        <Text className="font-semibold text-base text-foreground">
          {title}
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">{formatToBR(date)}</Text>
      </View>

      <View>
        <Text className="font-extrabold text-lg text-foreground">
          {formatarValorBr(value)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

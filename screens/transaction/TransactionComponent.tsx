import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View, TouchableOpacity } from "react-native";

type TransactionComponentProps = {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  date: string;
  value: string;
  category: string;
  onPress?: () => void;
};

export function TransactionComponent({
  icon = "tag",
  title,
  date,
  value,
  category,
  onPress,
}: TransactionComponentProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="border border-border rounded-2xl p-3 flex-row items-center bg-background shadow-sm"
      style={{
        shadowColor: theme.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      {/* Ícone */}
      <View className="w-14 h-14 rounded-xl items-center justify-center border border-border bg-muted/30">
        <Feather name={icon} size={28} color={theme.foreground} />
      </View>

      {/* Texto */}
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-base text-foreground">
          {title}
        </Text>
        <Text className="font-medium text-sm text-ring">
          {category}
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">{date}</Text>
      </View>

      {/* Valor */}
      <View>
        <Text className="font-extrabold text-lg text-foreground">
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

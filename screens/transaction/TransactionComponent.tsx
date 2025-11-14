import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View, TouchableOpacity } from "react-native";
import { IconComponent } from "../category/iconComponent";
import { IconLibName } from "@/types/iconType";
import { formatToBR } from "@/utils/FormatDate";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { useVisibilityStore } from "@/store/useVisibilityStore";

type TransactionComponentProps = {
  iconName: string;
  iconLib: IconLibName;
  title: string;
  date: string;
  value: number;
  category?: string;
  type: 'income' | 'expense';
  onPress?: () => void;
};

export function TransactionComponent({
  iconName,
  iconLib,
  title,
  date,
  value,
  category,
  type,
  onPress,
}: TransactionComponentProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { valuesVisible } = useVisibilityStore();

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
        <IconComponent icon={iconName} lib={iconLib} />
      </View>

      <View className="flex-1 ml-3">
        <Text className="font-semibold text-base text-foreground">
          {title}
        </Text>
        <Text className="font-medium text-sm text-ring">
          {category}
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">{formatToBR(date)}</Text>
      </View>

      <View>
        <Text className="font-extrabold text-lg text-foreground">
          {valuesVisible ? (
            <>
              {type === "income" ? "+ " : "- "}
              {formatarValorBr(value)}
            </>
          ) : (
            `${type === "income" ? "+ " : "- "}R$ ••••••`
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

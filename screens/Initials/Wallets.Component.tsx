import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { THEME } from "@/lib/theme";

type WalletComponentProps = {
  title: string;
  amount: number;
  onDelete?: () => void;
  isActive?: boolean;
};

export default function WalletComponent({ title, amount, onDelete, isActive }: WalletComponentProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  return (
    <View className="bg-card w-full px-2 py-4 border border-border rounded-2xl flex-row items-center justify-between gap-4 mb-4">
      <View className="flex-row items-center gap-3 flex-1">
        <View className=" p-2 rounded-full">
          <Feather name="credit-card" size={20} color={isDark ? "#fff" : "#000"} />
        </View>
        <View className="flex-1">
          <Text
            className="color-foreground text-lg font-medium"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {isActive && (
            <Text className="color-primary text-xs font-medium mt-1">
              Carteira Ativa
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center gap-3">
        <Text className="color-foreground text-lg font-bold text-right shrink">
          {formatarValorBr(amount)}
        </Text>
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={18} color={theme.destructive} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

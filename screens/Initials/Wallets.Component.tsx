import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { formatarValorBr } from "@/utils/FormatCurrent";

type WalletComponentProps = {
  title: string;
  amount: number;
};

export default function WalletComponent({ title, amount }: WalletComponentProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="bg-card w-full px-2 py-4 border border-border rounded-2xl flex-row items-center justify-between gap-4 mb-4">
      <View className="flex-row items-center gap-3 flex-1">
        <View className=" p-2 rounded-full">
          <Feather name="credit-card" size={20} color={isDark ? "#fff" : "#000"} />
        </View>
        <Text
          className="color-foreground text-lg font-medium flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      <Text className="color-foreground text-lg font-bold text-right shrink">
        {formatarValorBr(amount)}
      </Text>
    </View>
  );
}

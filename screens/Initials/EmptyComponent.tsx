import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export default function EmptyWallets() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-1 items-center justify-center px-6 mt-10">
      <View className="w-28 h-28 rounded-full bg-muted items-center justify-center mb-6">
        <MaterialCommunityIcons
          name="wallet-outline"
          size={60}
          color={theme.mutedForeground}
        />
      </View>

      <Text className="text-2xl font-semibold text-foreground text-center mb-2">
        Nenhuma carteira ainda
      </Text>

      <Text className="text-muted-foreground text-center mb-6 text-base">
        Crie sua primeira carteira para começar a gerenciar suas finanças.
      </Text>

      
    </View>
  );
}
